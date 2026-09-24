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
        self.assertIn("created_at", list_response.data[0])

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
        self.assertIn("updated_at", detail_response.data)

        update_response = self.client.patch(
            f"/api/v1/customers/{create_response.data['id']}/",
            {
                "name": "Cliente API Editado",
                "status": "paused",
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(update_response.status_code, 200, update_response.data)
        self.assertEqual(update_response.data["name"], "Cliente API Editado")
        self.assertEqual(update_response.data["status"], "paused")

    def test_customer_role_cannot_list_customers(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")

        response = self.client.get(
            "/api/v1/customers/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 403, response.data)

    def test_customer_can_save_a_named_address_and_read_it_from_profile(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")

        create_response = self.client.post(
            "/api/v1/customers/me/addresses/",
            {
                "label": "Casa",
                "postal_code": "01310-100",
                "street": "Avenida Paulista",
                "number": "1000",
                "complement": "Apto 12",
                "district": "Bela Vista",
                "city": "São Paulo",
                "state": "SP",
                "is_default": True,
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(create_response.status_code, 201, create_response.data)
        self.assertEqual(create_response.data["label"], "Casa")

        profile_response = self.client.get(
            "/api/v1/customers/me/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(profile_response.status_code, 200, profile_response.data)
        saved_address = next(address for address in profile_response.data["addresses"] if address["id"] == create_response.data["id"])
        self.assertEqual(saved_address["label"], "Casa")
        self.assertEqual(saved_address["state"], "SP")
        self.assertTrue(saved_address["is_default"])
