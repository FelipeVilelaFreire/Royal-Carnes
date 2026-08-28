from decimal import Decimal

from rest_framework.test import APITestCase

from apps.catalog.models import MeasurementUnit, Product, ProductVariant
from apps.core.seed_loader import BackendSeedApplier, BackendSeedLoader
from apps.subscriptions.models import Plan, PlanEntitlement, PlanPrice, Subscription, SubscriptionCycle
from apps.subscriptions.selectors import current_cycle_for_subscription
from apps.subscriptions.services import EntitlementValidationError, validate_cycle_item_selection


class SubscriptionsApiTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        manifest = BackendSeedLoader().load("royalprime")
        BackendSeedApplier(manifest).apply()

    def authenticate(self, email="admin@royalprime.local", password="RoyalPrime123!"):
        response = self.client.post(
            "/api/v1/auth/login/",
            {
                "email": email,
                "password": password,
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")

    def test_seed_creates_plans_entitlements_subscription_and_cycle(self):
        self.assertEqual(Plan.objects.count(), 3)
        self.assertEqual(PlanPrice.objects.count(), 3)
        self.assertEqual(PlanEntitlement.objects.count(), 5)
        self.assertEqual(Subscription.objects.count(), 1)
        self.assertEqual(SubscriptionCycle.objects.count(), 1)

        pro = Plan.objects.get(key="pro")
        entitlement = pro.entitlements.get(key="premium-cuts-12kg")
        self.assertEqual(entitlement.target_type, "collection")
        self.assertEqual(entitlement.collection.key, "churrasco-premium")
        self.assertEqual(entitlement.measurement_unit.key, "kg")
        self.assertEqual(entitlement.quantity, Decimal("12.000"))

    def test_public_plans_endpoint_returns_entitlements(self):
        response = self.client.get(
            "/api/v1/subscriptions/plans/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 200, response.data)
        plan_keys = [plan["key"] for plan in response.data]
        self.assertEqual(plan_keys, ["basic", "premium", "pro"])
        pro = next(plan for plan in response.data if plan["key"] == "pro")
        self.assertEqual(pro["prices"][0]["amount_cents"], 44900)
        self.assertEqual(pro["entitlements"][0]["target_key"], "churrasco-premium")
        self.assertEqual(pro["entitlements"][0]["measurement_unit_key"], "kg")

    def test_customer_can_read_own_subscription_and_current_cycle(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")

        subscription_response = self.client.get(
            "/api/v1/subscriptions/me/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        cycle_response = self.client.get(
            "/api/v1/subscriptions/me/cycles/current/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(subscription_response.status_code, 200, subscription_response.data)
        self.assertEqual(cycle_response.status_code, 200, cycle_response.data)
        self.assertEqual(subscription_response.data["subscription"]["plan"]["key"], "pro")
        self.assertEqual(cycle_response.data["cycle"]["items"][0]["variant_sku"], "PICANHA-1KG")

    def test_customer_can_add_valid_item_to_current_cycle(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")

        response = self.client.post(
            "/api/v1/subscriptions/me/cycles/current/items/",
            {
                "entitlement_key": "premium-cuts-12kg",
                "product_key": "maminha",
                "variant_sku": "MAMINHA-1KG",
                "quantity": "1.000",
                "measurement_unit_key": "kg",
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["product_key"], "maminha")
        self.assertEqual(response.data["variant_sku"], "MAMINHA-1KG")
        self.assertEqual(response.data["measurement_unit_key"], "kg")

    def test_admin_can_list_plans_subscriptions_and_cycles(self):
        self.authenticate()

        plans_response = self.client.get(
            "/api/v1/subscriptions/admin/plans/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        subscriptions_response = self.client.get(
            "/api/v1/subscriptions/admin/subscriptions/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        cycles_response = self.client.get(
            "/api/v1/subscriptions/admin/cycles/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(plans_response.status_code, 200, plans_response.data)
        self.assertEqual(subscriptions_response.status_code, 200, subscriptions_response.data)
        self.assertEqual(cycles_response.status_code, 200, cycles_response.data)
        self.assertEqual(subscriptions_response.data[0]["customer_name"], "Cliente RoyalPrime")

    def test_admin_can_create_plan_with_entitlement(self):
        self.authenticate()

        response = self.client.post(
            "/api/v1/subscriptions/admin/plans/",
            {
                "key": "familia",
                "name": "Familia",
                "price_cents": 25900,
                "entitlements": [
                    {
                        "key": "family-cuts",
                        "target_type": "category",
                        "target_key": "carnes",
                        "quantity": 5,
                        "measurement_unit_key": "kg",
                        "constraints": {
                            "maxSelections": 4,
                            "allowedCommercialModes": ["subscription"],
                        },
                    }
                ],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["key"], "familia")
        self.assertEqual(response.data["entitlements"][0]["target_key"], "carnes")
        self.assertEqual(response.data["entitlements"][0]["measurement_unit_key"], "kg")

    def test_admin_create_plan_returns_structured_error_for_invalid_entitlement_reference(self):
        self.authenticate()

        response = self.client.post(
            "/api/v1/subscriptions/admin/plans/",
            {
                "key": "invalid-reference",
                "name": "Invalid Reference",
                "price_cents": 10000,
                "entitlements": [
                    {
                        "key": "missing-category",
                        "target_type": "category",
                        "target_key": "nao-existe",
                        "quantity": 1,
                        "measurement_unit_key": "kg",
                    }
                ],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 400, response.data)
        self.assertEqual(response.data["code"], "plan_entitlement_reference_not_found")

    def test_admin_create_subscription_returns_structured_error_for_invalid_reference(self):
        self.authenticate()

        response = self.client.post(
            "/api/v1/subscriptions/admin/subscriptions/",
            {
                "customer_id": 999999,
                "plan_key": "pro",
                "status": "active",
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 400, response.data)
        self.assertEqual(response.data["code"], "subscription_reference_not_found")

    def test_operator_without_manage_permission_cannot_create_plan(self):
        self.authenticate("operador@royalprime.local", "RoyalPrime123!")

        response = self.client.post(
            "/api/v1/subscriptions/admin/plans/",
            {
                "key": "new-plan",
                "name": "New Plan",
                "price_cents": 10000,
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 403, response.data)

    def test_entitlement_validation_is_generic_and_blocks_overuse(self):
        subscription = Subscription.objects.select_related("organization", "plan").get()
        cycle = current_cycle_for_subscription(subscription)
        entitlement = subscription.plan.entitlements.get(key="premium-cuts-12kg")
        product = Product.objects.get(organization=subscription.organization, key="picanha")
        variant = ProductVariant.objects.get(organization=subscription.organization, sku="PICANHA-1KG")

        with self.assertRaises(EntitlementValidationError) as error:
            validate_cycle_item_selection(
                organization=subscription.organization,
                cycle=cycle,
                entitlement=entitlement,
                product=product,
                variant=variant,
                quantity=11,
                measurement_unit=entitlement.measurement_unit,
            )

        self.assertEqual(error.exception.code, "quantity_exceeded")

    def test_entitlement_validation_blocks_target_mismatch(self):
        subscription = Subscription.objects.select_related("organization", "plan").get()
        cycle = current_cycle_for_subscription(subscription)
        entitlement = subscription.plan.entitlements.get(key="premium-cuts-12kg")
        product = Product.objects.get(organization=subscription.organization, key="coxinha-da-asa")
        variant = ProductVariant.objects.get(organization=subscription.organization, sku="COXINHA-ASA-1KG")

        with self.assertRaises(EntitlementValidationError) as error:
            validate_cycle_item_selection(
                organization=subscription.organization,
                cycle=cycle,
                entitlement=entitlement,
                product=product,
                variant=variant,
                quantity=1,
                measurement_unit=entitlement.measurement_unit,
            )

        self.assertEqual(error.exception.code, "target_mismatch")

    def test_entitlement_validation_blocks_unit_mismatch(self):
        subscription = Subscription.objects.select_related("organization", "plan").get()
        cycle = current_cycle_for_subscription(subscription)
        entitlement = subscription.plan.entitlements.get(key="premium-cuts-12kg")
        product = Product.objects.get(organization=subscription.organization, key="picanha")
        variant = ProductVariant.objects.get(organization=subscription.organization, sku="PICANHA-1KG")
        bag = MeasurementUnit.objects.get(organization=subscription.organization, key="bag")

        with self.assertRaises(EntitlementValidationError) as error:
            validate_cycle_item_selection(
                organization=subscription.organization,
                cycle=cycle,
                entitlement=entitlement,
                product=product,
                variant=variant,
                quantity=1,
                measurement_unit=bag,
            )

        self.assertEqual(error.exception.code, "unit_mismatch")


class SubscriptionsSeedReuseTests(APITestCase):
    def test_example_seeds_use_different_units_without_backend_branching(self):
        for seed, expected_plan, expected_units in [
            ("examples/bikeclub", "urbano", {"unit", "service"}),
            ("examples/camisaclub", "club", {"unit"}),
        ]:
            manifest = BackendSeedLoader().load(seed)
            BackendSeedApplier(manifest).apply()
            plan = Plan.objects.get(key=expected_plan)
            units = {
                entitlement.measurement_unit.key
                for entitlement in plan.entitlements.select_related("measurement_unit")
            }
            self.assertTrue(expected_units.issubset(units))
