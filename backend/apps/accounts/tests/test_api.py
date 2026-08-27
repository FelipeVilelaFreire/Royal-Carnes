from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.core.seed_loader import BackendSeedApplier, BackendSeedLoader
from apps.customers.models import Customer


class AuthUsersApiTests(APITestCase):
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
        return response

    def test_login_returns_user_memberships_and_permissions(self):
        response = self.authenticate()

        self.assertIn("access", response.data)
        self.assertEqual(response.data["user"]["email"], "admin@royalprime.local")
        self.assertIn("royalprime", response.data["permissions"])
        self.assertIn("settings.manage", response.data["permissions"]["royalprime"])

    def test_me_returns_current_user_context(self):
        self.authenticate()

        response = self.client.get("/api/v1/accounts/me/", HTTP_X_ORGANIZATION_SLUG="royalprime")

        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["user"]["email"], "admin@royalprime.local")
        self.assertIn("memberships", response.data)

    def test_register_creates_customer_user(self):
        response = self.client.post(
            "/api/v1/auth/register/",
            {
                "email": "novo@royalprime.local",
                "password": "NovoCliente123!",
                "name": "Novo Cliente",
                "phone": "+5500000000999",
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 201, response.data)
        user = User.objects.get(email="novo@royalprime.local")
        self.assertTrue(Customer.objects.filter(user=user, email=user.email).exists())

    def test_admin_can_list_and_create_users(self):
        self.authenticate()

        list_response = self.client.get(
            "/api/v1/accounts/users/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(list_response.status_code, 200, list_response.data)

        create_response = self.client.post(
            "/api/v1/accounts/users/",
            {
                "email": "novo-operador@royalprime.local",
                "password": "NovoOperador123!",
                "name": "Novo Operador",
                "roles": ["operator"],
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        self.assertEqual(create_response.status_code, 201, create_response.data)

    def test_customer_role_cannot_list_admin_users(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")

        response = self.client.get(
            "/api/v1/accounts/users/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 403, response.data)
