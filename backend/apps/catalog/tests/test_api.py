from tempfile import TemporaryDirectory

from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import IntegrityError, transaction
from django.test import override_settings
from rest_framework.test import APITestCase

from apps.catalog.models import Category, Collection, CommercialMode, MeasurementUnit, Product, ProductMedia, ProductPrice, ProductVariant
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
        self.assertEqual(Category.objects.count(), 15)
        self.assertEqual(Product.objects.count(), 14)
        self.assertEqual(ProductMedia.objects.count(), 14)
        self.assertEqual(MeasurementUnit.objects.count(), 5)
        self.assertGreaterEqual(ProductVariant.objects.count(), 27)
        self.assertTrue(Collection.objects.filter(key="churrasco-premium", image_url__gt="").exists())
        self.assertTrue(
            Product.objects.filter(
                key="picanha",
                collection_links__collection__key="churrasco-premium",
            ).exists()
        )
        self.assertTrue(Category.objects.filter(key="bovinos-premium", parent__key="bovinos").exists())

    def test_public_catalog_endpoints(self):
        collections_response = self.client.get(
            "/api/v1/catalog/collections/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        categories_response = self.client.get(
            "/api/v1/catalog/categories/",
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
        units_response = self.client.get(
            "/api/v1/catalog/measurement-units/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(collections_response.status_code, 200, collections_response.data)
        self.assertEqual(categories_response.status_code, 200, categories_response.data)
        self.assertEqual(products_response.status_code, 200, products_response.data)
        self.assertEqual(modes_response.status_code, 200, modes_response.data)
        self.assertEqual(units_response.status_code, 200, units_response.data)
        self.assertTrue(collections_response.data[0]["image_url"])
        self.assertGreaterEqual(len(categories_response.data), 15)
        self.assertGreaterEqual(len(units_response.data), 5)
        self.assertTrue(any(category["key"] == "bovinos-premium" for category in categories_response.data))
        self.assertGreaterEqual(len(products_response.data), 14)
        self.assertTrue(products_response.data[0]["primary_media_url"])
        self.assertGreaterEqual(len(products_response.data[0]["media"]), 1)
        self.assertIn("unit_key", products_response.data[0]["variants"][0])
        self.assertIn("attributes", products_response.data[0]["variants"][0])

    def test_admin_can_list_and_create_product(self):
        self.authenticate()

        collections_response = self.client.get(
            "/api/v1/catalog/admin/collections/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        list_response = self.client.get(
            "/api/v1/catalog/admin/products/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(collections_response.status_code, 200, collections_response.data)
        self.assertGreaterEqual(len(collections_response.data), 5)
        self.assertTrue(collections_response.data[0]["image_url"])
        self.assertEqual(list_response.status_code, 200, list_response.data)

        create_response = self.client.post(
            "/api/v1/catalog/admin/products/",
            {
                "key": "patinho",
                "name": "Patinho",
                "description": "Corte magro para rotina",
                "status": "draft",
                "category_keys": ["carnes", "combos"],
                "unit": "kg",
                "price_cents": 5490,
                "commercial_mode_keys": ["delivery"],
                "collection_keys": ["dia-a-dia"],
                "media_items": [
                    {
                        "url": "https://example.com/patinho.jpg",
                        "isPrimary": True,
                    }
                ],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(create_response.status_code, 201, create_response.data)
        self.assertEqual(create_response.data["key"], "patinho")
        self.assertEqual(create_response.data["description"], "Corte magro para rotina")
        self.assertEqual(create_response.data["status"], "draft")
        self.assertEqual(create_response.data["primary_media_url"], "https://example.com/patinho.jpg")
        self.assertEqual(
            [category["key"] for category in create_response.data["categories"]],
            ["carnes", "combos"],
        )

    def test_admin_can_update_category_and_admin_list_keeps_inactive(self):
        self.authenticate()
        category = Category.objects.get(key="carnes")

        response = self.client.patch(
            f"/api/v1/catalog/admin/categories/{category.id}/",
            {
                "name": "Carnes especiais",
                "sort_order": 15,
                "is_active": False,
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["name"], "Carnes especiais")
        self.assertEqual(response.data["sort_order"], 15)
        self.assertFalse(response.data["is_active"])

        admin_response = self.client.get(
            "/api/v1/catalog/admin/categories/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        public_response = self.client.get(
            "/api/v1/catalog/categories/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(admin_response.status_code, 200, admin_response.data)
        self.assertTrue(any(item["key"] == "carnes" for item in admin_response.data))
        self.assertFalse(any(item["key"] == "carnes" for item in public_response.data))

    def test_admin_can_create_category_with_parent(self):
        self.authenticate()

        response = self.client.post(
            "/api/v1/catalog/admin/categories/",
            {
                "key": "aves-premium",
                "name": "Aves premium",
                "parent_key": "aves",
                "sort_order": 35,
                "is_active": True,
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["key"], "aves-premium")
        self.assertEqual(response.data["name"], "Aves premium")
        self.assertEqual(response.data["sort_order"], 35)
        self.assertTrue(response.data["is_active"])
        self.assertEqual(Category.objects.get(key="aves-premium").parent.key, "aves")

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

    def test_admin_can_upload_media_and_attach_to_product(self):
        self.authenticate()
        product = Product.objects.get(key="picanha")

        with TemporaryDirectory() as media_root:
            with override_settings(MEDIA_ROOT=media_root):
                upload_response = self.client.post(
                    "/api/v1/catalog/admin/uploads/media/",
                    {
                        "file": SimpleUploadedFile(
                            "picanha.jpg",
                            b"fake-image-content",
                            content_type="image/jpeg",
                        )
                    },
                    format="multipart",
                    HTTP_X_ORGANIZATION_SLUG="royalprime",
                )

        self.assertEqual(upload_response.status_code, 201, upload_response.data)
        self.assertIn("/media/catalog/uploads/", upload_response.data["url"])

        response = self.client.patch(
            f"/api/v1/catalog/admin/products/{product.id}/",
            {
                "media_items": [
                    {
                        "url": upload_response.data["url"],
                        "isPrimary": True,
                    }
                ]
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["primary_media_url"], upload_response.data["url"])
        self.assertTrue(ProductMedia.objects.filter(product=product, url=upload_response.data["url"]).exists())

    def test_admin_cannot_create_product_without_valid_category(self):
        self.authenticate()

        empty_response = self.client.post(
            "/api/v1/catalog/admin/products/",
            {
                "key": "produto-sem-categoria",
                "name": "Produto sem categoria",
                "category_keys": [],
                "unit": "kg",
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(empty_response.status_code, 400, empty_response.data)

        missing_response = self.client.post(
            "/api/v1/catalog/admin/products/",
            {
                "key": "produto-categoria-invalida",
                "name": "Produto categoria invalida",
                "category_keys": ["categoria-inexistente"],
                "unit": "kg",
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(missing_response.status_code, 400, missing_response.data)
        self.assertEqual(missing_response.data["code"], "product_category_not_found")

    def test_admin_can_update_product_and_public_catalog_reflects_it(self):
        self.authenticate()
        product = Product.objects.get(key="picanha")

        response = self.client.patch(
            f"/api/v1/catalog/admin/products/{product.id}/",
            {
                "name": "Picanha suina",
                "status": "draft",
                "category_keys": ["suinos"],
                "price_cents": 8990,
                "commercial_mode_keys": ["delivery"],
                "collection_keys": ["dia-a-dia"],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["name"], "Picanha suina")
        self.assertEqual(response.data["status"], "draft")
        self.assertEqual([category["key"] for category in response.data["categories"]], ["suinos"])
        self.assertEqual(response.data["collection_keys"], ["dia-a-dia"])
        delivery_base_price = next(
            price
            for price in response.data["prices"]
            if (
                price["commercial_mode_key"] == "delivery"
                and price["price_type"] == "base"
                and price["collection_key"] is None
                and price["variant_sku"] is None
            )
        )
        self.assertEqual(delivery_base_price["amount_cents"], 8990)

        public_response = self.client.get(
            f"/api/v1/catalog/products/{product.id}/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(public_response.status_code, 200, public_response.data)
        self.assertEqual(public_response.data["name"], "Picanha suina")
        self.assertEqual([category["key"] for category in public_response.data["categories"]], ["suinos"])

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

        collections_response = self.client.get(
            "/api/v1/catalog/admin/collections/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        response = self.client.get(
            "/api/v1/catalog/admin/products/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(collections_response.status_code, 403, collections_response.data)
        self.assertEqual(response.status_code, 403, response.data)
