from decimal import Decimal

from django.utils import timezone
from rest_framework.test import APITestCase

from apps.core.models import CodeSequence
from apps.core.seed_loader import BackendSeedApplier, BackendSeedLoader
from apps.boxes.models import BoxCycle, BoxSubscription
from apps.customers.models import Address, Customer
from apps.deliveries.models import Delivery
from apps.inventory.models import InventoryItem
from apps.orders.models import Order, OrderKindDefinition, OrderStatusDefinition
from apps.organizations.models import Organization
from apps.subscriptions.models import Subscription, SubscriptionCycleItem


class OrdersApiTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        manifest = BackendSeedLoader().load("royalprime")
        BackendSeedApplier(manifest).apply()

    def authenticate(self, email="admin@royalprime.local", password="RoyalPrime123!"):
        response = self.client.post(
            "/api/v1/auth/login/",
            {"email": email, "password": password},
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")

    def test_seed_creates_order_config_and_demo_orders(self):
        self.assertEqual(OrderKindDefinition.objects.count(), 3)
        self.assertEqual(OrderStatusDefinition.objects.count(), 9)
        self.assertEqual(Order.objects.count(), 4)
        self.assertTrue(OrderStatusDefinition.objects.get(key="received").is_initial)
        self.assertEqual(
            OrderStatusDefinition.objects.get(key="received").metadata["ui"],
            {"statusColor": "received", "statusTone": "neutral"},
        )
        self.assertEqual(
            [status.key for status in OrderStatusDefinition.objects.order_by("sort_order")],
            [
                "received",
                "approved",
                "separating",
                "ready",
                "out-for-delivery",
                "delivered",
                "completed",
                "delivery-failed",
                "cancelled",
            ],
        )
        self.assertEqual(OrderKindDefinition.objects.get(key="royal-box").commercial_mode.key, "box")
        self.assertTrue(Order.objects.filter(metadata__seedKey="pedido-felipe-churrasco-familia").exists())
        subscription_order = Order.objects.select_related("subscription", "subscription_cycle").get(
            metadata__seedKey="pedido-assinatura-pro-setembro"
        )
        self.assertEqual(subscription_order.kind_key, "subscription-cycle")
        self.assertIsNotNone(subscription_order.subscription)
        self.assertIsNotNone(subscription_order.subscription_cycle)
        self.assertEqual(subscription_order.subscription_cycle.cycle_number, 1)

    def test_checkout_config_exposes_only_v1_payment_options(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")
        response = self.client.get("/api/v1/orders/config/", HTTP_X_ORGANIZATION_SLUG="royalprime")

        self.assertEqual(response.status_code, 200, response.data)
        payment_methods = response.data["checkout"]["paymentMethods"]
        self.assertEqual([method["key"] for method in payment_methods], ["pix", "whatsapp", "payOnDelivery"])
        self.assertEqual(payment_methods[2]["availableFor"], ["royalDelivery"])
        self.assertEqual(response.data["checkout"]["whatsappUrl"], "https://wa.me/5511998765432")

    def test_customer_can_create_order_and_inventory_is_reserved(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")

        response = self.client.post(
            "/api/v1/orders/me/",
            {
                "kind_key": "delivery",
                "items": [
                    {
                        "product_key": "picanha",
                        "variant_sku": "PICANHA-1KG",
                        "quantity": "1.000",
                    }
                ],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["code"], "RP-000005")
        self.assertEqual(response.data["status_key"], "received")
        self.assertEqual(response.data["total_cents"], 8990)
        self.assertEqual(Delivery.objects.count(), 5)
        self.assertEqual(Delivery.objects.get(order_id=response.data["id"]).status_key, "received")
        item = InventoryItem.objects.get(variant__sku="PICANHA-1KG")
        self.assertEqual(item.reserved_quantity, Decimal("6.000"))

    def test_customer_cannot_create_order_with_zero_quantity(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")

        response = self.client.post(
            "/api/v1/orders/me/",
            {
                "kind_key": "delivery",
                "items": [
                    {
                        "product_key": "picanha",
                        "variant_sku": "PICANHA-1KG",
                        "quantity": "0.000",
                    }
                ],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 400, response.data)
        self.assertEqual(response.data["code"], "order_item_quantity_invalid")

    def test_customer_cannot_create_royal_box_order_without_cycle(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")

        response = self.client.post(
            "/api/v1/orders/me/",
            {
                "kind_key": "royal-box",
                "items": [
                    {
                        "product_key": "picanha",
                        "variant_sku": "PICANHA-1KG",
                        "quantity": "1.000",
                    }
                ],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 400, response.data)
        self.assertEqual(response.data["code"], "box_cycle_required_for_order")

    def test_customer_checkout_creates_recurring_royal_box_cycle_and_order(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")
        customer = Customer.objects.get(email="cliente@royalprime.local")
        address = Address.objects.create(
            organization=customer.organization,
            customer=customer,
            recipient_name=customer.name,
            street="Rua Nelson Mandela",
            number="100",
            city="Rio de Janeiro",
            state="RJ",
        )

        response = self.client.post(
            "/api/v1/orders/me/royal-box/",
            {
                "address_id": address.id,
                "recurrence_day": 30,
                "items": [
                    {
                        "product_key": "picanha",
                        "variant_sku": "PICANHA-1KG",
                        "quantity": "1.000",
                    }
                ],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["kind_key"], "royal-box")
        self.assertEqual(response.data["box_recurrence_day"], 30)
        cycle = BoxCycle.objects.get(id=response.data["box_cycle_id"])
        self.assertEqual(cycle.status, BoxCycle.Status.ORDER_CREATED)
        self.assertEqual(cycle.subscription.default_delivery_address_id, address.id)
        self.assertEqual(cycle.subscription.schedule.recurrence_rule["dayOfMonth"], 30)
        delivery = Delivery.objects.get(order_id=response.data["id"])
        self.assertEqual(delivery.promised_delivery_starts_on, timezone.localdate(cycle.scheduled_for))
        self.assertEqual(delivery.promised_delivery_by_on, timezone.localdate(cycle.scheduled_for))
        self.assertEqual(delivery.delivery_promise_snapshot["source"], "royal_box_recurring_delivery_day")
        self.assertEqual(BoxSubscription.objects.filter(customer=customer).count(), 1)

    def test_subscription_order_requires_cycle(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")

        response = self.client.post(
            "/api/v1/orders/me/",
            {
                "kind_key": "subscription-cycle",
                "items": [
                    {
                        "product_key": "picanha",
                        "variant_sku": "PICANHA-1KG",
                        "quantity": "1.000",
                    }
                ],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 400, response.data)
        self.assertEqual(response.data["code"], "subscription_required_for_order")

    def test_subscription_order_reserves_cycle_balance_on_the_server(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")
        subscription = Subscription.objects.get(plan__key="pro")
        cycle = subscription.cycles.get(cycle_number=1)
        initial_quantity = SubscriptionCycleItem.objects.get(
            cycle=cycle,
            entitlement__key="picanha-3kg",
            variant__sku="PICANHA-1KG",
        ).quantity

        response = self.client.post(
            "/api/v1/orders/me/",
            {
                "kind_key": "subscription-cycle",
                "subscription_id": subscription.id,
                "subscription_cycle_id": cycle.id,
                "items": [
                    {
                        "product_key": "picanha",
                        "variant_sku": "PICANHA-1KG",
                        "quantity": "1.000",
                    }
                ],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 201, response.data)
        cycle_item = SubscriptionCycleItem.objects.get(
            cycle=cycle,
            entitlement__key="picanha-3kg",
            variant__sku="PICANHA-1KG",
        )
        self.assertEqual(cycle_item.quantity, initial_quantity + Decimal("1.000"))
        self.assertEqual(cycle_item.status, SubscriptionCycleItem.Status.RESERVED)

    def test_subscription_order_rejects_combined_quantities_over_cycle_balance(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")
        subscription = Subscription.objects.get(plan__key="pro")
        cycle = subscription.cycles.get(cycle_number=1)

        response = self.client.post(
            "/api/v1/orders/me/",
            {
                "kind_key": "subscription-cycle",
                "subscription_id": subscription.id,
                "subscription_cycle_id": cycle.id,
                "items": [
                    {"product_key": "picanha", "variant_sku": "PICANHA-1KG", "quantity": "6.000"},
                    {"product_key": "picanha", "variant_sku": "PICANHA-1KG", "quantity": "6.000"},
                ],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 400, response.data)
        self.assertEqual(response.data["code"], "quantity_exceeded")

    def test_admin_can_list_and_transition_order_by_seeded_workflow(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")
        create_response = self.client.post(
            "/api/v1/orders/me/",
            {
                "kind_key": "delivery",
                "items": [{"product_key": "picanha", "variant_sku": "PICANHA-1KG", "quantity": "1.000"}],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(create_response.status_code, 201, create_response.data)
        self.authenticate()

        list_response = self.client.get("/api/v1/orders/admin/orders/", HTTP_X_ORGANIZATION_SLUG="royalprime")
        transition_response = self.client.post(
            f"/api/v1/orders/admin/orders/{create_response.data['id']}/transition/",
            {"status_key": "approved", "note": "Aprovado no teste"},
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(list_response.status_code, 200, list_response.data)
        self.assertEqual(list_response.data[0]["id"], create_response.data["id"])
        self.assertEqual(transition_response.status_code, 200, transition_response.data)
        self.assertEqual(transition_response.data["status_key"], "approved")
        self.assertEqual(transition_response.data["status_history"][-1]["from_status_key"], "received")

    def test_order_workflow_synchronizes_its_delivery_status(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")
        create_response = self.client.post(
            "/api/v1/orders/me/",
            {
                "kind_key": "delivery",
                "items": [{"product_key": "picanha", "variant_sku": "PICANHA-1KG", "quantity": "1.000"}],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(create_response.status_code, 201, create_response.data)
        self.authenticate()

        order_id = create_response.data["id"]
        for status_key in ("approved", "separating", "ready", "out-for-delivery", "delivered"):
            response = self.client.post(
                f"/api/v1/orders/admin/orders/{order_id}/transition/",
                {"status_key": status_key},
                format="json",
                HTTP_X_ORGANIZATION_SLUG="royalprime",
            )
            self.assertEqual(response.status_code, 200, response.data)
            self.assertEqual(Delivery.objects.get(order_id=order_id).status_key, status_key)

        self.assertEqual(response.data["status_key"], "delivered")

    def test_admin_can_replace_items_of_received_order_and_recalculate_inventory(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")
        create_response = self.client.post(
            "/api/v1/orders/me/",
            {
                "kind_key": "delivery",
                "items": [{"product_key": "picanha", "variant_sku": "PICANHA-1KG", "quantity": "1.000"}],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(create_response.status_code, 201, create_response.data)
        inventory_item = InventoryItem.objects.get(variant__sku="PICANHA-1KG")
        reserved_before = inventory_item.reserved_quantity

        self.authenticate()
        response = self.client.put(
            f"/api/v1/orders/admin/orders/{create_response.data['id']}/items/",
            {
                "items": [{"product_key": "picanha", "variant_sku": "PICANHA-1KG", "quantity": "2.000"}],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["items"][0]["quantity"], "2.000")
        self.assertEqual(response.data["total_cents"], 17980)
        inventory_item.refresh_from_db()
        self.assertEqual(inventory_item.reserved_quantity, reserved_before + Decimal("1.000"))

    def test_admin_can_set_any_order_status_and_correct_a_terminal_status(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")
        create_response = self.client.post(
            "/api/v1/orders/me/",
            {
                "kind_key": "delivery",
                "items": [{"product_key": "picanha", "variant_sku": "PICANHA-1KG", "quantity": "1.000"}],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.authenticate()

        response = self.client.post(
            f"/api/v1/orders/admin/orders/{create_response.data['id']}/transition/",
            {"status_key": "ready"},
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["status_key"], "ready")
        self.assertEqual(Delivery.objects.get(order_id=create_response.data["id"]).status_key, "ready")

        terminal_response = self.client.post(
            f"/api/v1/orders/admin/orders/{create_response.data['id']}/transition/",
            {"status_key": "delivered"},
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(terminal_response.status_code, 200, terminal_response.data)

        correction_response = self.client.post(
            f"/api/v1/orders/admin/orders/{create_response.data['id']}/transition/",
            {"status_key": "approved"},
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(correction_response.status_code, 200, correction_response.data)
        self.assertEqual(correction_response.data["status_key"], "approved")
        self.assertEqual(Delivery.objects.get(order_id=create_response.data["id"]).status_key, "approved")

    def test_customer_cannot_access_admin_orders(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")

        response = self.client.get("/api/v1/orders/admin/orders/", HTTP_X_ORGANIZATION_SLUG="royalprime")

        self.assertEqual(response.status_code, 403, response.data)


class OrdersSeedReuseTests(APITestCase):
    def test_example_seeds_use_different_order_statuses_and_code_prefixes(self):
        expectations = [
            ("examples/bikeclub", "requested", "BIKE-OS"),
            ("examples/camisaclub", "created", "CAM"),
        ]
        for seed, status_key, prefix in expectations:
            manifest = BackendSeedLoader().load(seed)
            BackendSeedApplier(manifest).apply()
            self.assertTrue(OrderStatusDefinition.objects.get(key=status_key).is_initial)
            organization = Organization.objects.get(slug=manifest.key)
            self.assertEqual(CodeSequence.objects.get(organization=organization, key="orders").prefix, prefix)
