from rest_framework.test import APITestCase

from apps.core.seed_loader import BackendSeedApplier, BackendSeedLoader
from apps.deliveries.models import Delivery, DeliveryStatusDefinition


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

    def test_seed_creates_delivery_status_config_without_deliveries(self):
        self.assertEqual(DeliveryStatusDefinition.objects.count(), 6)
        self.assertEqual(Delivery.objects.count(), 0)
        self.assertTrue(DeliveryStatusDefinition.objects.get(key="pending").is_initial)

    def test_admin_can_create_transition_and_confirm_delivery(self):
        order = self.create_order()
        self.authenticate()

        delivery = Delivery.objects.get(order_id=order["id"])
        transition_response = self.client.post(
            f"/api/v1/deliveries/admin/deliveries/{delivery.id}/transition/",
            {"status_key": "packing"},
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        out_response = self.client.post(
            f"/api/v1/deliveries/admin/deliveries/{delivery.id}/transition/",
            {"status_key": "out-for-delivery"},
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        confirm_response = self.client.post(
            f"/api/v1/deliveries/admin/deliveries/{delivery.id}/confirm/",
            {"confirmation_type": "code", "confirmed_by": "Cliente RoyalPrime", "note": "Codigo validado"},
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(delivery.code, "DEL-000001")
        self.assertEqual(delivery.status_key, "pending")
        self.assertEqual(transition_response.status_code, 200, transition_response.data)
        self.assertEqual(transition_response.data["status_key"], "packing")
        self.assertEqual(out_response.status_code, 200, out_response.data)
        self.assertEqual(out_response.data["status_key"], "out-for-delivery")
        self.assertEqual(confirm_response.status_code, 200, confirm_response.data)
        self.assertEqual(confirm_response.data["status_key"], "delivered")
        self.assertEqual(confirm_response.data["confirmation"]["confirmation_type"], "code")

    def test_customer_can_read_own_deliveries(self):
        order = self.create_order()

        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")
        list_response = self.client.get("/api/v1/deliveries/me/", HTTP_X_ORGANIZATION_SLUG="royalprime")

        self.assertEqual(list_response.status_code, 200, list_response.data)
        self.assertEqual(len(list_response.data), 1)
        self.assertEqual(list_response.data[0]["order_code"], order["code"])

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
            ("examples/bikeclub", "created"),
            ("examples/camisaclub", "waiting"),
        ]
        for seed, status_key in expectations:
            manifest = BackendSeedLoader().load(seed)
            BackendSeedApplier(manifest).apply()
            self.assertTrue(DeliveryStatusDefinition.objects.get(key=status_key).is_initial)
