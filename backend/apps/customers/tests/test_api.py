from rest_framework.test import APITestCase

from apps.core.seed_loader import BackendSeedApplier, BackendSeedLoader


class CustomersApiTests(APITestCase):
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

    def test_admin_can_list_create_and_detail_customers(self):
        self.authenticate()

        list_response = self.client.get(
            "/api/v1/customers/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(list_response.status_code, 200, list_response.data)

        create_response = self.client.post(
            "/api/v1/customers/",
            {
                "name": "Cliente API",
                "email": "cliente-api@royalprime.local",
                "phone": "+5500000000777",
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(create_response.status_code, 201, create_response.data)

        detail_response = self.client.get(
            f"/api/v1/customers/{create_response.data['id']}/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(detail_response.status_code, 200, detail_response.data)
        self.assertEqual(detail_response.data["email"], "cliente-api@royalprime.local")

    def test_customer_role_cannot_list_customers(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")

        response = self.client.get(
            "/api/v1/customers/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 403, response.data)
