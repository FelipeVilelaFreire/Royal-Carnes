from datetime import timedelta

from django.utils import timezone
from rest_framework.test import APITestCase

from apps.core.seed_loader import BackendSeedApplier, BackendSeedLoader
from apps.deliveries.models import Delivery, DeliveryPromisePolicy, DeliveryStatusDefinition
from apps.orders.models import Order
from apps.deliveries.services import delivery_promise_status


class DeliveriesApiTests(APITestCase):
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

    def create_order(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")
        response = self.client.post(
            "/api/v1/orders/me/",
            {
                "kind_key": "delivery",
                "items": [{"product_key": "picanha", "variant_sku": "PICANHA-1KG", "quantity": "1.000"}],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(response.status_code, 201, response.data)
        return response.data

    def test_seed_creates_delivery_status_config_and_demo_deliveries(self):
        self.assertEqual(DeliveryStatusDefinition.objects.count(), 9)
        self.assertEqual(DeliveryPromisePolicy.objects.count(), 3)
        self.assertEqual(Delivery.objects.count(), 4)
        self.assertTrue(DeliveryStatusDefinition.objects.get(key="received").is_initial)
        self.assertTrue(Delivery.objects.filter(metadata__seedKey="entrega-felipe-churrasco-familia").exists())
        self.assertEqual(
            Delivery.objects.get(metadata__seedKey="entrega-assinatura-pro-setembro").delivery_promise_snapshot["policyKey"],
            "assinaturas-royal",
        )

    def test_delivery_status_is_derived_from_order_and_confirmation_is_logistics_data(self):
        order = self.create_order()
        self.authenticate()

        delivery = Delivery.objects.get(order_id=order["id"])
        transition_response = self.client.post(
            f"/api/v1/deliveries/admin/deliveries/{delivery.id}/transition/",
            {"status_key": "approved"},
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(delivery.code, "DEL-000005")
        self.assertEqual(delivery.status_key, "received")
        self.assertEqual(transition_response.status_code, 400, transition_response.data)
        self.assertEqual(transition_response.data["code"], "delivery_status_is_derived")
        for status_key in ("approved", "separating", "ready", "out-for-delivery"):
            order_transition_response = self.client.post(
                f"/api/v1/orders/admin/orders/{order['id']}/transition/",
                {"status_key": status_key},
                format="json",
                HTTP_X_ORGANIZATION_SLUG="royalprime",
            )
            self.assertEqual(order_transition_response.status_code, 200, order_transition_response.data)
        delivery.refresh_from_db()
        self.assertEqual(delivery.status_key, "out-for-delivery")
        self.assertEqual(Order.objects.get(pk=order["id"]).status_key, "out-for-delivery")
        confirm_response = self.client.post(
            f"/api/v1/deliveries/admin/deliveries/{delivery.id}/confirm/",
            {"confirmation_type": "code", "confirmed_by": "Cliente RoyalPrime", "note": "Codigo validado"},
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(confirm_response.status_code, 200, confirm_response.data)
        self.assertEqual(confirm_response.data["status_key"], "out-for-delivery")
        self.assertEqual(confirm_response.data["confirmation"]["confirmation_type"], "code")
        self.assertEqual(Order.objects.get(pk=order["id"]).status_key, "out-for-delivery")

    def test_customer_can_read_own_deliveries(self):
        order = self.create_order()

        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")
        list_response = self.client.get("/api/v1/deliveries/me/", HTTP_X_ORGANIZATION_SLUG="royalprime")

        self.assertEqual(list_response.status_code, 200, list_response.data)
        self.assertGreaterEqual(len(list_response.data), 1)
        self.assertTrue(any(delivery["order_code"] == order["code"] for delivery in list_response.data))

    def test_delivery_snapshots_the_policy_resolved_for_its_order(self):
        order = self.create_order()
        delivery = Delivery.objects.get(order_id=order["id"])

        self.assertIsNotNone(delivery.promised_delivery_starts_on)
        self.assertIsNotNone(delivery.promised_delivery_by_on)
        self.assertEqual(delivery.delivery_promise_snapshot["minBusinessDays"], 1)
        self.assertEqual(delivery.delivery_promise_snapshot["maxBusinessDays"], 2)
        self.assertEqual(delivery.delivery_promise_snapshot["source"], "delivery_promise_policy")
        self.assertEqual(delivery.delivery_promise_snapshot["policyKey"], "avulso-padrao")

    def test_admin_can_manage_a_delivery_promise_policy(self):
        self.authenticate()
        response = self.client.post(
            "/api/v1/deliveries/admin/promise-policies/",
            {
                "key": "camisas-express",
                "name": "Camisas express",
                "min_business_days": 1,
                "max_business_days": 3,
                "approaching_business_days": 1,
                "order_kind_keys": ["shipment"],
                "subscription_plan_keys": ["clube-camisas"],
                "is_active": True,
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["key"], "camisas-express")
        self.assertEqual(DeliveryPromisePolicy.objects.get(key="camisas-express").max_business_days, 3)

    def test_delivery_promise_status_reports_deadline_risk_without_a_second_workflow(self):
        delivery = Delivery.objects.first()
        today = timezone.localdate()
        delivery.promised_delivery_by_on = today + timedelta(days=7)
        self.assertEqual(delivery_promise_status(delivery, today)["state"], "on_track")

        delivery.promised_delivery_by_on = today
        self.assertEqual(delivery_promise_status(delivery, today)["state"], "due_today")

        delivery.promised_delivery_by_on = today - timedelta(days=1)
        self.assertEqual(delivery_promise_status(delivery, today)["state"], "overdue")

    def test_order_cancellation_and_failure_update_the_delivery(self):
        order = self.create_order()
        self.authenticate()
        delivery = Delivery.objects.get(order_id=order["id"])

        cancel_response = self.client.post(
            f"/api/v1/orders/admin/orders/{order['id']}/transition/",
            {"status_key": "cancelled"},
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(cancel_response.status_code, 200, cancel_response.data)
        self.assertEqual(Order.objects.get(pk=order["id"]).status_key, "cancelled")
        delivery.refresh_from_db()
        self.assertEqual(delivery.status_key, "cancelled")

        order = self.create_order()
        self.authenticate()
        delivery = Delivery.objects.get(order_id=order["id"])
        for status_key in ("approved", "separating", "ready", "out-for-delivery", "delivery-failed"):
            response = self.client.post(
                f"/api/v1/orders/admin/orders/{order['id']}/transition/",
                {"status_key": status_key},
                format="json",
                HTTP_X_ORGANIZATION_SLUG="royalprime",
            )
            self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(Order.objects.get(pk=order["id"]).status_key, "delivery-failed")
        delivery.refresh_from_db()
        self.assertEqual(delivery.status_key, "delivery-failed")

    def test_admin_cannot_duplicate_delivery_for_order(self):
        order = self.create_order()
        self.authenticate()

        response = self.client.post(
            "/api/v1/deliveries/admin/deliveries/",
            {"order_id": order["id"]},
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 400, response.data)
        self.assertEqual(response.data["code"], "delivery_already_exists")

    def test_customer_cannot_access_delivery_admin(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")

        response = self.client.get("/api/v1/deliveries/admin/deliveries/", HTTP_X_ORGANIZATION_SLUG="royalprime")

        self.assertEqual(response.status_code, 403, response.data)


class DeliveriesSeedReuseTests(APITestCase):
    def test_example_seeds_use_different_delivery_statuses(self):
        expectations = [
            ("examples/bikeclub", "created", "transporte-bike-padrao"),
            ("examples/camisaclub", "waiting", "camisa-padrao"),
        ]
        for seed, status_key, policy_key in expectations:
            manifest = BackendSeedLoader().load(seed)
            BackendSeedApplier(manifest).apply()
            self.assertTrue(DeliveryStatusDefinition.objects.get(key=status_key).is_initial)
            self.assertTrue(DeliveryPromisePolicy.objects.get(key=policy_key).is_default)
