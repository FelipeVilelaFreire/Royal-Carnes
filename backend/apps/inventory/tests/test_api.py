from decimal import Decimal

from rest_framework.test import APITestCase

from apps.core.seed_loader import BackendSeedApplier, BackendSeedLoader
from apps.inventory.models import InventoryItem, InventoryMovement


class InventoryApiTests(APITestCase):
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

    def test_seed_creates_inventory_for_catalog_variants(self):
        self.assertEqual(InventoryItem.objects.count(), 5)
        item = InventoryItem.objects.get(variant__sku="PICANHA-1KG")
        self.assertEqual(item.product.key, "picanha")
        self.assertEqual(item.measurement_unit.key, "kg")
        self.assertEqual(item.available_quantity, Decimal("24.000"))
        self.assertEqual(item.sellable_quantity, Decimal("22.000"))

    def test_admin_can_list_inventory_items(self):
        self.authenticate()

        response = self.client.get(
            "/api/v1/inventory/admin/items/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(len(response.data), 5)
        self.assertIn("sellable_quantity", response.data[0])

    def test_admin_can_create_inventory_item_for_variant(self):
        self.authenticate()

        response = self.client.post(
            "/api/v1/inventory/admin/items/",
            {
                "product_key": "fraldinha",
                "variant_sku": "FRALDINHA-1KG",
                "measurement_unit_key": "kg",
                "available_quantity": "9.000",
                "reserved_quantity": "0.000",
                "low_stock_threshold": "2.000",
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["product_key"], "fraldinha")
        self.assertEqual(response.data["variant_sku"], "FRALDINHA-1KG")
        self.assertEqual(response.data["measurement_unit_key"], "kg")

    def test_admin_can_adjust_inventory_and_records_movement(self):
        self.authenticate()
        item = InventoryItem.objects.get(variant__sku="PICANHA-1KG")

        response = self.client.post(
            f"/api/v1/inventory/admin/items/{item.id}/adjust/",
            {
                "quantity_delta": "-4.000",
                "reserved_delta": "1.000",
                "reason": "Ajuste manual de teste",
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 200, response.data)
        item.refresh_from_db()
        self.assertEqual(item.available_quantity, Decimal("20.000"))
        self.assertEqual(item.reserved_quantity, Decimal("3.000"))
        self.assertEqual(InventoryMovement.objects.filter(inventory_item=item).count(), 1)

    def test_adjustment_cannot_make_reserved_greater_than_available(self):
        self.authenticate()
        item = InventoryItem.objects.get(variant__sku="ANCHO-1KG")

        response = self.client.post(
            f"/api/v1/inventory/admin/items/{item.id}/adjust/",
            {
                "quantity_delta": "0.000",
                "reserved_delta": "20.000",
                "reason": "Reserva invalida",
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 400, response.data)
        self.assertEqual(response.data["code"], "reserved_exceeds_available")

    def test_customer_cannot_access_inventory_admin(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")

        response = self.client.get(
            "/api/v1/inventory/admin/items/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 403, response.data)


class InventorySeedReuseTests(APITestCase):
    def test_example_seeds_apply_inventory_with_domain_specific_units(self):
        expectations = [
            ("examples/bikeclub", "BIKE-URBANA-ARO26", "unit"),
            ("examples/camisaclub", "CAMISETA-STREET-M", "unit"),
        ]
        for seed, sku, unit_key in expectations:
            manifest = BackendSeedLoader().load(seed)
            BackendSeedApplier(manifest).apply()
            item = InventoryItem.objects.get(variant__sku=sku)
            self.assertEqual(item.measurement_unit.key, unit_key)

    def test_product_level_inventory_seed_is_idempotent(self):
        manifest = BackendSeedLoader().load("examples/bikeclub")

        BackendSeedApplier(manifest).apply()
        BackendSeedApplier(manifest).apply()

        self.assertEqual(InventoryItem.objects.filter(product__key="revisao-mensal", variant__isnull=True).count(), 1)
