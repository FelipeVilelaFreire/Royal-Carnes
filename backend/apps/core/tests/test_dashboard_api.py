from rest_framework.test import APITestCase

from apps.core.seed_loader import BackendSeedApplier, BackendSeedLoader


class AdminDashboardApiTests(APITestCase):
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

    def test_admin_dashboard_summary_returns_aggregate_contract(self):
        self.authenticate()

        response = self.client.get(
            "/api/v1/admin/dashboard/summary/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 200, response.data)
        self.assertIn("order_config", response.data)
        self.assertIn("delivery_config", response.data)
        self.assertIn("orders", response.data)
        self.assertIn("deliveries", response.data)
        self.assertIn("subscriptions", response.data)
        self.assertIn("kinds", response.data["order_config"])
        self.assertIn("statuses", response.data["order_config"])
        self.assertIn("statuses", response.data["delivery_config"])

    def test_customer_cannot_access_admin_dashboard_summary(self):
        self.authenticate("cliente@royalprime.local", "RoyalPrime123!")

        response = self.client.get(
            "/api/v1/admin/dashboard/summary/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 403, response.data)

