from rest_framework.test import APITestCase

from apps.core.seed_loader import BackendSeedApplier, BackendSeedLoader
from apps.orders.models import Order
from apps.payments.models import Payment
from apps.subscriptions.models import Subscription


class PaymentsApiTests(APITestCase):
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

    def test_admin_can_create_and_list_subscription_payment(self):
        self.authenticate()
        subscription = Subscription.objects.select_related("customer").get()

        create_response = self.client.post(
            "/api/v1/payments/admin/payments/",
            {
                "reference": "PAY-TEST-001",
                "customer_id": subscription.customer_id,
                "subscription_id": subscription.id,
                "amount_cents": 44900,
                "currency": "BRL",
                "status": "pending",
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )
        list_response = self.client.get(
            "/api/v1/payments/admin/payments/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(create_response.status_code, 201, create_response.data)
        self.assertEqual(create_response.data["subscription_id"], subscription.id)
        self.assertEqual(create_response.data["customer_name"], subscription.customer.name)
        self.assertEqual(list_response.status_code, 200, list_response.data)
        self.assertTrue(any(payment["reference"] == "PAY-TEST-001" for payment in list_response.data))

    def test_seed_payments_include_order_and_subscription_context(self):
        self.authenticate()

        response = self.client.get(
            "/api/v1/payments/admin/payments/",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 200, response.data)
        seeded_payment = next(
            payment for payment in response.data
            if payment["reference"] == "PAY-RP-2026-09-PRO"
        )
        self.assertEqual(seeded_payment["status"], "paid")
        self.assertIsNotNone(seeded_payment["order_id"])
        self.assertIsNotNone(seeded_payment["subscription_id"])
        self.assertEqual(seeded_payment["subscription_plan_name"], "Pro")

    def test_rejects_payment_when_subscription_does_not_match_order(self):
        self.authenticate()
        subscription = Subscription.objects.select_related("customer").get()
        order = Order.objects.exclude(customer=subscription.customer).first()

        response = self.client.post(
            "/api/v1/payments/admin/payments/",
            {
                "reference": "PAY-TEST-MISMATCH",
                "customer_id": subscription.customer_id,
                "subscription_id": subscription.id,
                "order_id": order.id,
                "amount_cents": 44900,
                "currency": "BRL",
                "status": "pending",
            },
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 400, response.data)
        self.assertEqual(response.data["code"], "payment_reference_not_found")

    def test_admin_can_mark_payment_as_paid(self):
        self.authenticate()
        subscription = Subscription.objects.select_related("organization", "customer").get()
        payment = Payment.objects.create(
            organization=subscription.organization,
            customer=subscription.customer,
            subscription=subscription,
            reference="PAY-TEST-002",
            amount_cents=44900,
        )

        response = self.client.patch(
            f"/api/v1/payments/admin/payments/{payment.id}/",
            {"status": "paid"},
            format="json",
            HTTP_X_ORGANIZATION_SLUG="royalprime",
        )

        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["status"], "paid")
        self.assertIsNotNone(response.data["paid_at"])
