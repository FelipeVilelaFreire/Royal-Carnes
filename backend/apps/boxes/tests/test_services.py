from datetime import datetime
from zoneinfo import ZoneInfo

from django.test import TestCase

from apps.boxes.models import BoxCycle, BoxSubscription, BoxTemplate, BoxTemplateItem
from apps.boxes.services import create_box_subscription, create_order_for_box_cycle, next_monthly_delivery_at
from apps.catalog.models import Product, ProductVariant
from apps.core.seed_loader import BackendSeedApplier, BackendSeedLoader
from apps.customers.models import Address, Customer
from apps.orders.models import Order
from apps.orders.serializers import OrderSerializer
from apps.orders.services import OrderValidationError
from apps.scheduling.services import ensure_occurrence, execute_occurrence


class BoxSchedulingTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        BackendSeedApplier(BackendSeedLoader().load("royalprime")).apply()

    def make_subscription(self, policy=BoxSubscription.OrderCreationPolicy.PAYMENT_CONFIRMED, monthly_day=10):
        customer = Customer.objects.get(email="cliente@royalprime.local")
        organization = customer.organization
        template = BoxTemplate.objects.create(organization=organization, key=f"familia-{policy}", name="Familia")
        product = Product.objects.get(organization=organization, key="picanha")
        variant = ProductVariant.objects.get(organization=organization, sku="PICANHA-1KG")
        BoxTemplateItem.objects.create(organization=organization, template=template, product=product, variant=variant, quantity="1.000")
        address = Address.objects.create(
            organization=organization, customer=customer, recipient_name=customer.name,
            street="Rua do Churrasco", number="10", city="Sao Paulo", state="SP",
        )
        return create_box_subscription(organization=organization, customer=customer, template=template, address=address, monthly_day=monthly_day, starts_at=datetime.fromisoformat("2026-01-01T00:00:00+00:00"), timezone_name="Europe/Berlin", order_creation_policy=policy)

    def test_day_31_uses_the_last_day_of_the_month(self):
        subscription = self.make_subscription(monthly_day=31)

        occurrence = ensure_occurrence(schedule=subscription.schedule, at=datetime.fromisoformat("2026-02-28T09:30:00+01:00"))

        self.assertIsNotNone(occurrence)
        self.assertEqual(occurrence.scheduled_for.astimezone(ZoneInfo("Europe/Berlin")).date().isoformat(), "2026-02-28")
        self.assertEqual(subscription.schedule.recurrence_rule["dayOfMonth"], 31)

    def test_checkout_delivery_day_resolves_the_next_monthly_delivery(self):
        organization = Customer.objects.get(email="cliente@royalprime.local").organization

        delivery_at = next_monthly_delivery_at(
            organization=organization,
            monthly_day=21,
            at=datetime.fromisoformat("2026-09-23T12:00:00+00:00"),
        )

        self.assertEqual(delivery_at.astimezone(ZoneInfo(organization.timezone)).date().isoformat(), "2026-10-21")

    def test_payment_confirmed_box_prepares_once_then_creates_one_order(self):
        subscription = self.make_subscription()
        occurrence = ensure_occurrence(schedule=subscription.schedule, at=datetime.fromisoformat("2026-10-10T09:30:00+02:00"))
        execute_occurrence(occurrence=occurrence)
        execute_occurrence(occurrence=occurrence)
        cycle = BoxCycle.objects.get(subscription=subscription)
        self.assertEqual(cycle.status, BoxCycle.Status.AWAITING_PAYMENT)
        self.assertEqual(cycle.items_snapshot[0]["unitPriceCents"], 8990)
        order = create_order_for_box_cycle(cycle=cycle)
        self.assertEqual(order.box_cycle_id, cycle.id)
        self.assertEqual(create_order_for_box_cycle(cycle=cycle).id, order.id)
        self.assertEqual(Order.objects.filter(box_cycle=cycle).count(), 1)
        payload = OrderSerializer(order).data
        self.assertEqual(payload["box_cycle_id"], cycle.id)
        self.assertEqual(payload["box_cycle_key"], "2026-10")
        self.assertEqual(payload["box_cycle_status"], BoxCycle.Status.ORDER_CREATED)
        self.assertEqual(payload["box_recurrence_day"], 10)

    def test_immediate_policy_creates_order_when_schedule_effect_executes(self):
        subscription = self.make_subscription(BoxSubscription.OrderCreationPolicy.IMMEDIATE)
        occurrence = ensure_occurrence(schedule=subscription.schedule, at=datetime.fromisoformat("2026-10-10T09:30:00+02:00"))
        execute_occurrence(occurrence=occurrence)
        cycle = BoxCycle.objects.get(subscription=subscription)
        self.assertEqual(cycle.status, BoxCycle.Status.ORDER_CREATED)
        self.assertTrue(Order.objects.filter(box_cycle=cycle).exists())

    def test_box_cycle_without_monthly_day_cannot_create_order(self):
        subscription = self.make_subscription()
        occurrence = ensure_occurrence(schedule=subscription.schedule, at=datetime.fromisoformat("2026-10-10T09:30:00+02:00"))
        execute_occurrence(occurrence=occurrence)
        cycle = BoxCycle.objects.get(subscription=subscription)
        subscription.schedule.recurrence_rule = {"frequency": "monthly"}
        subscription.schedule.save(update_fields=["recurrence_rule", "updated_at"])

        with self.assertRaisesRegex(OrderValidationError, "monthly recurrence day"):
            create_order_for_box_cycle(cycle=cycle)

        self.assertFalse(Order.objects.filter(box_cycle=cycle).exists())
