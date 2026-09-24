from calendar import monthrange
from datetime import datetime, timezone as datetime_timezone
from decimal import Decimal, ROUND_HALF_UP
from uuid import uuid4
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from django.db import transaction
from django.utils import timezone

from apps.catalog.models import Product, ProductVariant
from apps.orders.services import create_order, resolve_product_price
from apps.scheduling.models import ScheduleOccurrence
from apps.scheduling.services import execute_occurrence

from .models import BoxCycle, BoxSubscription, BoxTemplate, BoxTemplateItem


class BoxValidationError(ValueError):
    def __init__(self, code, detail):
        self.code, self.detail = code, detail
        super().__init__(detail)


def next_monthly_delivery_at(*, organization, monthly_day: int, at: datetime | None = None) -> datetime:
    """Resolve the next promised local delivery date for a Royal Box."""
    if not 1 <= monthly_day <= 31:
        raise BoxValidationError("box_monthly_day_invalid", "Monthly day must be between 1 and 31")
    try:
        timezone_value = ZoneInfo(organization.timezone)
    except ZoneInfoNotFoundError as error:
        raise BoxValidationError("box_delivery_timezone_invalid", "Organization timezone is invalid") from error
    instant = at or timezone.now()
    local_now = timezone.localtime(instant, timezone_value)
    year, month = local_now.year, local_now.month
    candidate = local_now.replace(
        day=min(monthly_day, monthrange(year, month)[1]),
        hour=0,
        minute=0,
        second=0,
        microsecond=0,
    )
    if candidate.date() <= local_now.date():
        year, month = (year + 1, 1) if month == 12 else (year, month + 1)
        candidate = candidate.replace(year=year, month=month, day=min(monthly_day, monthrange(year, month)[1]))
    return candidate.astimezone(datetime_timezone.utc)


@transaction.atomic
def create_box_subscription(*, organization, customer, template, address, monthly_day, starts_at, timezone_name="", order_creation_policy=BoxSubscription.OrderCreationPolicy.PAYMENT_CONFIRMED):
    if not 1 <= monthly_day <= 31:
        raise BoxValidationError("box_monthly_day_invalid", "Monthly day must be between 1 and 31")
    if address is None:
        raise BoxValidationError("box_delivery_address_required", "Box subscription requires a delivery address")
    if any(item.organization_id != organization.id for item in (customer, template, address)) or address.customer_id != customer.id:
        raise BoxValidationError("box_organization_mismatch", "Box customer, template and address must share organization")
    from apps.scheduling.models import Schedule

    schedule = Schedule.objects.create(
        organization=organization,
        key=f"box-subscription-{customer.id}-{template.id}",
        name=template.name,
        timezone=timezone_name,
        recurrence_rule={"frequency": "monthly", "dayOfMonth": monthly_day, "hour": 0, "minute": 0},
        starts_at=starts_at,
        effect_key="royal_box.prepare",
    )
    return BoxSubscription.objects.create(
        organization=organization, customer=customer, template=template,
        default_delivery_address=address, schedule=schedule,
        order_creation_policy=order_creation_policy,
    )


@transaction.atomic
def create_checkout_royal_box_order(*, organization, customer, address, monthly_day, items, actor=None):
    """Persist a customer-composed Royal Box, its first cycle, and its first order."""
    if not items:
        raise BoxValidationError("box_items_required", "Royal Box requires at least one item")

    template = BoxTemplate.objects.create(
        organization=organization,
        key=f"royal-box-{customer.id}-{uuid4().hex[:20]}",
        name="Royal Box",
    )
    for sort_order, item in enumerate(items):
        product = Product.objects.get(organization=organization, key=item["product_key"])
        variant = None
        if item.get("variant_sku"):
            variant = ProductVariant.objects.get(organization=organization, sku=item["variant_sku"])
            if variant.product_id != product.id:
                raise BoxValidationError("box_variant_product_mismatch", "Box variant must belong to product")
        quantity = Decimal(str(item["quantity"]))
        if quantity <= 0:
            raise BoxValidationError("box_item_quantity_invalid", "Box item quantity must be greater than zero")
        BoxTemplateItem.objects.create(
            organization=organization,
            template=template,
            product=product,
            variant=variant,
            quantity=quantity,
            sort_order=sort_order,
        )

    started_at = timezone.now()
    scheduled_for = next_monthly_delivery_at(
        organization=organization,
        monthly_day=monthly_day,
        at=started_at,
    )
    subscription = create_box_subscription(
        organization=organization,
        customer=customer,
        template=template,
        address=address,
        monthly_day=monthly_day,
        starts_at=scheduled_for,
        order_creation_policy=BoxSubscription.OrderCreationPolicy.IMMEDIATE,
    )
    occurrence = ScheduleOccurrence.objects.create(
        organization=organization,
        schedule=subscription.schedule,
        occurrence_key=f"initial-{subscription.id}",
        scheduled_for=scheduled_for,
        snapshot={
            "effectKey": subscription.schedule.effect_key,
            "recurrenceRule": subscription.schedule.recurrence_rule,
            "timezone": subscription.schedule.timezone or organization.timezone,
        },
    )
    execute_occurrence(occurrence=occurrence)
    return BoxCycle.objects.select_related("order").get(schedule_occurrence=occurrence).order


def _address_snapshot(address):
    return {"recipient": address.recipient_name, "street": address.street, "number": address.number, "city": address.city, "postalCode": address.postal_code}


@transaction.atomic
def prepare_box_cycle(*, occurrence: ScheduleOccurrence) -> BoxCycle:
    subscription = BoxSubscription.objects.select_for_update().select_related("template", "customer", "default_delivery_address", "organization").get(schedule=occurrence.schedule)
    if subscription.status != BoxSubscription.Status.ACTIVE:
        raise BoxValidationError("box_subscription_not_active", "Box subscription is not active")
    existing = BoxCycle.objects.select_for_update().filter(schedule_occurrence=occurrence).first()
    if existing:
        return existing
    snapshot = []
    total_cents = 0
    items = subscription.template.items.select_related("product", "variant").order_by("sort_order", "id")
    for item in items:
        price = resolve_product_price(organization=subscription.organization, product=item.product, variant=item.variant, commercial_mode=None)
        line_total = int((Decimal(price.amount_cents) * item.quantity).to_integral_value(rounding=ROUND_HALF_UP))
        snapshot.append({"productKey": item.product.key, "variantSku": item.variant.sku if item.variant else None, "quantity": str(item.quantity), "unitPriceCents": price.amount_cents, "totalCents": line_total})
        total_cents += line_total
    if not snapshot:
        raise BoxValidationError("box_template_empty", "Box template requires at least one item")
    status = BoxCycle.Status.PREPARED if subscription.order_creation_policy == BoxSubscription.OrderCreationPolicy.IMMEDIATE else BoxCycle.Status.AWAITING_PAYMENT
    cycle = BoxCycle.objects.create(
        organization=subscription.organization, subscription=subscription, schedule_occurrence=occurrence,
        cycle_key=occurrence.occurrence_key, scheduled_for=occurrence.scheduled_for, status=status,
        currency=subscription.organization.currency, total_cents=total_cents, items_snapshot=snapshot,
        address_snapshot=_address_snapshot(subscription.default_delivery_address),
    )
    if subscription.order_creation_policy == BoxSubscription.OrderCreationPolicy.IMMEDIATE:
        create_order_for_box_cycle(cycle=cycle)
    return cycle


@transaction.atomic
def create_order_for_box_cycle(*, cycle: BoxCycle, actor=None):
    locked = BoxCycle.objects.select_for_update().select_related("subscription__customer", "subscription__default_delivery_address", "subscription__schedule", "organization").get(pk=cycle.pk)
    if hasattr(locked, "order"):
        return locked.order
    if locked.status not in {BoxCycle.Status.PREPARED, BoxCycle.Status.AWAITING_PAYMENT}:
        raise BoxValidationError("box_cycle_not_orderable", "Box cycle is not eligible for order creation")
    items = [{"product_key": item["productKey"], "variant_sku": item.get("variantSku"), "quantity": item["quantity"], "source_type": "box_cycle", "source_key": locked.cycle_key} for item in locked.items_snapshot]
    price_overrides = {
        (item["productKey"], item.get("variantSku")): item["unitPriceCents"]
        for item in locked.items_snapshot
    }
    order = create_order(organization=locked.organization, customer=locked.subscription.customer, address=locked.subscription.default_delivery_address, box_cycle=locked, kind_key="royal-box", items=items, actor=actor, unit_price_overrides=price_overrides)
    locked.status = BoxCycle.Status.ORDER_CREATED
    locked.save(update_fields=["status", "updated_at"])
    return order


@transaction.atomic
def create_order_for_paid_box_payment(*, payment, actor=None):
    """Gateway/manual payment adapter: paid payment metadata names the BoxCycle."""
    if payment.status != "paid":
        raise BoxValidationError("box_payment_not_paid", "Box order requires a paid payment")
    cycle_id = (payment.metadata or {}).get("boxCycleId")
    if not cycle_id:
        raise BoxValidationError("box_payment_cycle_required", "Payment must reference a box cycle")
    cycle = BoxCycle.objects.select_for_update().get(organization=payment.organization, id=cycle_id)
    if cycle.subscription.customer_id != payment.customer_id:
        raise BoxValidationError("box_payment_customer_mismatch", "Payment customer does not match box cycle")
    return create_order_for_box_cycle(cycle=cycle, actor=actor)
