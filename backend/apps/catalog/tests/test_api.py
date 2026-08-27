from rest_framework.test import APITestCase

from apps.catalog.models import Collection, Product
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
        self.assertEqual(Product.objects.count(), 4)
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
        self.assertGreaterEqual(len(products_response.data), 4)

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
                "key": "maminha",
                "name": "Maminha",
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
        self.assertEqual(create_response.data["key"], "maminha")
        self.assertEqual(
            [category["key"] for category in create_response.data["categories"]],
            ["carnes", "combos"],
        )

    def test_customer_cannot_access_admin_catalog(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")

        response = self.client.get(
            "/api/v1/catalog/admin/products/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 403, response.data)
