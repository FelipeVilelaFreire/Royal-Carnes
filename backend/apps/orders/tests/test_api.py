from decimal import Decimal

from rest_framework.test import APITestCase

from apps.core.models import CodeSequence
from apps.core.seed_loader import BackendSeedApplier, BackendSeedLoader
from apps.deliveries.models import Delivery
from apps.inventory.models import InventoryItem
from apps.orders.models import Order, OrderKindDefinition, OrderStatusDefinition
from apps.organizations.models import Organization


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

    def test_seed_creates_order_config_without_orders(self):
        self.assertEqual(OrderKindDefinition.objects.count(), 2)
        self.assertEqual(OrderStatusDefinition.objects.count(), 6)
        self.assertEqual(Order.objects.count(), 0)
        self.assertTrue(OrderStatusDefinition.objects.get(key="received").is_initial)

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
        self.assertEqual(response.data["code"], "RP-000001")
        self.assertEqual(response.data["status_key"], "received")
        self.assertEqual(response.data["total_cents"], 8990)
        self.assertEqual(Delivery.objects.count(), 1)
        self.assertEqual(Delivery.objects.get(order_id=response.data["id"]).status_key, "pending")
        item = InventoryItem.objects.get(variant__sku="PICANHA-1KG")
        self.assertEqual(item.reserved_quantity, Decimal("3.000"))

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
        self.assertEqual(transition_response.status_code, 200, transition_response.data)
        self.assertEqual(transition_response.data["status_key"], "approved")
        self.assertEqual(transition_response.data["status_history"][-1]["from_status_key"], "received")

    def test_invalid_status_transition_is_blocked_by_seeded_workflow(self):
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

        self.assertEqual(response.status_code, 400, response.data)
        self.assertEqual(response.data["code"], "order_status_transition_not_allowed")

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
