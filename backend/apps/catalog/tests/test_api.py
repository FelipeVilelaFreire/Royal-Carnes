from django.db import IntegrityError, transaction
from rest_framework.test import APITestCase

from apps.catalog.models import Collection, CommercialMode, MeasurementUnit, Product, ProductMedia, ProductPrice, ProductVariant
from apps.core.seed_loader import BackendSeedApplier, BackendSeedLoader


class CatalogApiTests(APITestCase):
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

    def test_seed_creates_collections_and_products(self):
        self.assertEqual(Collection.objects.count(), 5)
        self.assertEqual(Product.objects.count(), 14)
        self.assertEqual(ProductMedia.objects.count(), 14)
        self.assertEqual(MeasurementUnit.objects.count(), 5)
        self.assertGreaterEqual(ProductVariant.objects.count(), 27)
        self.assertTrue(
            Product.objects.filter(
                key="picanha",
                collection_links__collection__key="churrasco-premium",
            ).exists()
        )

    def test_public_catalog_endpoints(self):
        collections_response = self.client.get(
            "/api/v1/catalog/collections/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        products_response = self.client.get(
            "/api/v1/catalog/products/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        modes_response = self.client.get(
            "/api/v1/catalog/commercial-modes/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(collections_response.status_code, 200, collections_response.data)
        self.assertEqual(products_response.status_code, 200, products_response.data)
        self.assertEqual(modes_response.status_code, 200, modes_response.data)
        self.assertGreaterEqual(len(products_response.data), 14)
        self.assertTrue(products_response.data[0]["primary_media_url"])
        self.assertGreaterEqual(len(products_response.data[0]["media"]), 1)
        self.assertIn("unit_key", products_response.data[0]["variants"][0])
        self.assertIn("attributes", products_response.data[0]["variants"][0])

    def test_admin_can_list_and_create_product(self):
        self.authenticate()

        list_response = self.client.get(
            "/api/v1/catalog/admin/products/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(list_response.status_code, 200, list_response.data)

        create_response = self.client.post(
            "/api/v1/catalog/admin/products/",
            {
                "key": "patinho",
                "name": "Patinho",
                "category_keys": ["carnes", "combos"],
                "unit": "kg",
                "price_cents": 5490,
                "commercial_mode_keys": ["delivery"],
                "collection_keys": ["dia-a-dia"],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(create_response.status_code, 201, create_response.data)
        self.assertEqual(create_response.data["key"], "patinho")
        self.assertEqual(
            [category["key"] for category in create_response.data["categories"]],
            ["carnes", "combos"],
        )

    def test_admin_can_create_product_with_variants(self):
        self.authenticate()

        response = self.client.post(
            "/api/v1/catalog/admin/products/",
            {
                "key": "bife-de-chorizo",
                "name": "Bife de chorizo",
                "category_keys": ["carnes"],
                "unit": "kg",
                "commercial_mode_keys": ["delivery"],
                "collection_keys": ["churrasco-premium"],
                "variants": [
                    {
                        "sku": "CHORIZO-1KG",
                        "name": "Bife de chorizo 1kg",
                        "unit": "kg",
                        "unit_key": "kg",
                        "unit_quantity": 1,
                        "weight_grams": 1000,
                        "attributes": {"cut": "chorizo"},
                        "price_cents": 12990,
                        "commercial_mode_keys": ["delivery"],
                    }
                ],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["variants"][0]["sku"], "CHORIZO-1KG")
        self.assertEqual(response.data["variants"][0]["unit_key"], "kg")
        self.assertEqual(response.data["variants"][0]["attributes"]["cut"], "chorizo")
        self.assertEqual(response.data["prices"][0]["variant_sku"], "CHORIZO-1KG")

    def test_variant_sku_is_unique_per_organization(self):
        product = Product.objects.get(key="maminha")
        existing = ProductVariant.objects.get(sku="PICANHA-1KG")

        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                ProductVariant.objects.create(
                    organization=existing.organization,
                    product=product,
                    sku=existing.sku,
                    name="SKU duplicado",
                    unit="kg",
                    measurement_unit=existing.measurement_unit,
                )

    def test_product_price_is_unique_when_optional_fields_are_null(self):
        product = Product.objects.get(key="picanha")
        mode = CommercialMode.objects.get(key="delivery")
        existing = ProductPrice.objects.filter(
            product=product,
            commercial_mode=mode,
            variant__isnull=True,
            collection__isnull=True,
            price_type=ProductPrice.PriceType.BASE,
        ).first()

        self.assertIsNotNone(existing)
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                ProductPrice.objects.create(
                    organization=product.organization,
                    product=product,
                    commercial_mode=mode,
                    price_type=ProductPrice.PriceType.BASE,
                    currency=product.organization.currency,
                    amount_cents=9999,
                )

    def test_customer_cannot_access_admin_catalog(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")

        response = self.client.get(
            "/api/v1/catalog/admin/products/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 403, response.data)
