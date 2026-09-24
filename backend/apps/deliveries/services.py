from datetime import date, timedelta

from django.db import transaction
from django.utils import timezone

from apps.core.code_sequences import generate_code
from apps.customers.models import Address
from .models import (
    Delivery,
    DeliveryConfirmation,
    DeliveryPromisePolicy,
    DeliveryStatusDefinition,
    DeliveryStatusHistory,
)


class DeliveryValidationError(ValueError):
    def __init__(self, code: str, detail: str):
        self.code = code
        self.detail = detail
        super().__init__(detail)


def synchronize_delivery_status_from_order(*, organization, order, actor=None, note: str = "") -> Delivery | None:
    """Reflect the Order workflow in its logistics record without a second workflow."""
    delivery = Delivery.objects.filter(organization=organization, order=order).first()
    if delivery is None or delivery.status_key == order.status_key:
        return delivery

    DeliveryStatusDefinition.objects.get(organization=organization, key=order.status_key)
    previous = delivery.status_key
    delivery.status_key = order.status_key
    delivery.save(update_fields=["status_key", "updated_at"])
    DeliveryStatusHistory.objects.create(
        organization=organization,
        delivery=delivery,
        from_status_key=previous,
        to_status_key=order.status_key,
        actor=actor,
        note=note or f"Order status: {order.status_key}",
    )
    return delivery


@transaction.atomic
def upsert_delivery_status(
    *,
    organization,
    key: str,
    label: str,
    sort_order: int = 0,
    is_initial: bool = False,
    is_terminal: bool = False,
    is_public: bool = True,
    allowed_next_keys: list[str] | None = None,
    effects: dict | None = None,
    metadata: dict | None = None,
) -> DeliveryStatusDefinition:
    status, _created = DeliveryStatusDefinition.objects.update_or_create(
        organization=organization,
        key=key,
        defaults={
            "label": label,
            "sort_order": sort_order,
            "is_initial": is_initial,
            "is_terminal": is_terminal,
            "is_public": is_public,
            "allowed_next_keys": allowed_next_keys or [],
            "effects": effects or {},
            "metadata": metadata or {},
        },
    )
    return status


@transaction.atomic
def upsert_delivery_promise_policy(
    *,
    organization,
    key: str,
    name: str,
    min_business_days: int,
    max_business_days: int,
    approaching_business_days: int = 2,
    order_kind_keys: list[str] | None = None,
    subscription_plan_keys: list[str] | None = None,
    is_default: bool = False,
    is_active: bool = True,
    sort_order: int = 0,
) -> DeliveryPromisePolicy:
    if min_business_days < 1 or max_business_days < min_business_days:
        raise DeliveryValidationError("delivery_promise_range_invalid", "Delivery promise business days are invalid")
    if approaching_business_days > max_business_days:
        raise DeliveryValidationError("delivery_promise_alert_invalid", "Delivery promise alert must not exceed its deadline")
    if is_default and not is_active:
        raise DeliveryValidationError("delivery_promise_default_inactive", "Default delivery promise must be active")
    if is_default:
        DeliveryPromisePolicy.objects.filter(organization=organization, is_default=True).exclude(key=key).update(is_default=False)
    policy, _created = DeliveryPromisePolicy.objects.update_or_create(
        organization=organization,
        key=key,
        defaults={
            "name": name,
            "min_business_days": min_business_days,
            "max_business_days": max_business_days,
            "approaching_business_days": approaching_business_days,
            "order_kind_keys": order_kind_keys or [],
            "subscription_plan_keys": subscription_plan_keys or [],
            "is_default": is_default,
            "is_active": is_active,
            "sort_order": sort_order,
        },
    )
    return policy


def initial_delivery_status(organization) -> DeliveryStatusDefinition:
    status = DeliveryStatusDefinition.objects.filter(organization=organization, is_initial=True).order_by("sort_order").first()
    if status is None:
        raise DeliveryValidationError("delivery_initial_status_not_configured", "Delivery initial status is not configured")
    return status


def address_snapshot(address: Address | None) -> dict:
    if address is None:
        return {}
    return {
        "label": address.label,
        "recipientName": address.recipient_name,
        "postalCode": address.postal_code,
        "street": address.street,
        "number": address.number,
        "complement": address.complement,
        "district": address.district,
        "city": address.city,
        "state": address.state,
        "country": address.country,
        "deliveryInstructions": address.delivery_instructions,
    }


def add_business_days(anchor_on: date, business_days: int) -> date:
    result = anchor_on
    remaining = business_days
    while remaining:
        result += timedelta(days=1)
        if result.weekday() < 5:
            remaining -= 1
    return result


def subtract_business_days(anchor_on: date, business_days: int) -> date:
    result = anchor_on
    remaining = business_days
    while remaining:
        result -= timedelta(days=1)
        if result.weekday() < 5:
            remaining -= 1
    return result


def count_business_days_between(start_on: date, end_on: date) -> int:
    if start_on >= end_on:
        return 0
    total = 0
    cursor = start_on
    while cursor < end_on:
        cursor += timedelta(days=1)
        if cursor.weekday() < 5:
            total += 1
    return total


def delivery_promise_status(delivery: Delivery, reference_on: date | None = None) -> dict:
    status = DeliveryStatusDefinition.objects.filter(
        organization=delivery.organization,
        key=delivery.status_key,
    ).only("metadata").first()
    outcome = ((status.metadata if status else {}) or {}).get("deliveryPromiseOutcome")
    if outcome == "fulfilled":
        return {"state": "fulfilled", "remainingBusinessDays": None}
    if outcome == "closed":
        return {"state": "closed", "remainingBusinessDays": None}
    if delivery.promised_delivery_by_on is None:
        return {"state": "untracked", "remainingBusinessDays": None}
    today = reference_on or timezone.localdate()
    deadline = delivery.promised_delivery_by_on
    if deadline < today:
        return {
            "state": "overdue",
            "remainingBusinessDays": -count_business_days_between(deadline, today),
        }
    remaining = count_business_days_between(today, deadline)
    if remaining == 0:
        return {"state": "due_today", "remainingBusinessDays": 0}
    approaching_days = int((delivery.delivery_promise_snapshot or {}).get("approachingBusinessDays", 0))
    if approaching_days > 0 and remaining <= approaching_days:
        return {"state": "approaching", "remainingBusinessDays": remaining}
    return {"state": "on_track", "remainingBusinessDays": remaining}


def resolve_delivery_promise_policy(*, organization, order) -> DeliveryPromisePolicy | None:
    policies = list(
        DeliveryPromisePolicy.objects.filter(organization=organization, is_active=True).order_by("sort_order", "id")
    )
    plan_key = order.subscription.plan.key if order.subscription_id else None
    if plan_key:
        plan_policy = next((policy for policy in policies if plan_key in (policy.subscription_plan_keys or [])), None)
        if plan_policy:
            return plan_policy
    for policy in policies:
        if order.kind_key in (policy.order_kind_keys or []):
            return policy
    return next((policy for policy in policies if policy.is_default), None)


def delivery_promise_for_order(*, organization, order) -> dict:
    policy = resolve_delivery_promise_policy(organization=organization, order=order)
    if policy is None:
        return {}
    if order.box_cycle_id and order.box_cycle.scheduled_for:
        target_on = timezone.localdate(order.box_cycle.scheduled_for)
        return {
            "minBusinessDays": policy.min_business_days,
            "maxBusinessDays": policy.max_business_days,
            "approachingBusinessDays": policy.approaching_business_days,
            "anchorOn": target_on.isoformat(),
            "source": "royal_box_recurring_delivery_day",
            "policyId": policy.id,
            "policyKey": policy.key,
            "kindKey": order.kind_key,
            "preparationStartsOn": subtract_business_days(target_on, policy.max_business_days).isoformat(),
            "preparationEndsOn": subtract_business_days(target_on, policy.min_business_days).isoformat(),
            "startsOn": target_on,
            "byOn": target_on,
        }
    anchor_on = timezone.localdate(order.created_at)
    return {
        "minBusinessDays": policy.min_business_days,
        "maxBusinessDays": policy.max_business_days,
        "approachingBusinessDays": policy.approaching_business_days,
        "anchorOn": anchor_on.isoformat(),
        "source": "delivery_promise_policy",
        "policyId": policy.id,
        "policyKey": policy.key,
        "kindKey": order.kind_key,
        "startsOn": add_business_days(anchor_on, policy.min_business_days),
        "byOn": add_business_days(anchor_on, policy.max_business_days),
    }


@transaction.atomic
def create_delivery_for_order(
    *,
    organization,
    order,
    code_sequence_key: str = "deliveries",
    confirmation_code: str = "",
    notes: str = "",
    actor=None,
) -> Delivery:
    if order.organization_id != organization.id:
        raise DeliveryValidationError("order_organization_mismatch", "Order must belong to organization")
    if Delivery.objects.filter(organization=organization, order=order).exists():
        raise DeliveryValidationError("delivery_already_exists", "Delivery already exists for order")
    try:
        status = DeliveryStatusDefinition.objects.get(organization=organization, key=order.status_key)
    except DeliveryStatusDefinition.DoesNotExist as error:
        raise DeliveryValidationError("delivery_status_not_configured", "Delivery status must mirror the order status") from error
    promise = delivery_promise_for_order(organization=organization, order=order)
    delivery = Delivery.objects.create(
        organization=organization,
        order=order,
        customer=order.customer,
        address=order.address,
        code=generate_code(organization=organization, key=code_sequence_key),
        status_key=status.key,
        confirmation_code=confirmation_code,
        promised_delivery_starts_on=promise.get("startsOn"),
        promised_delivery_by_on=promise.get("byOn"),
        delivery_promise_snapshot={key: value for key, value in promise.items() if key not in {"startsOn", "byOn"}},
        address_snapshot=address_snapshot(order.address),
        notes=notes,
    )
    DeliveryStatusHistory.objects.create(
        organization=organization,
        delivery=delivery,
        to_status_key=status.key,
        actor=actor,
        note="Delivery created",
    )
    return delivery


@transaction.atomic
def transition_delivery_status(*, organization, delivery: Delivery, to_status_key: str, actor=None, note: str = "") -> Delivery:
    raise DeliveryValidationError(
        "delivery_status_is_derived",
        "Delivery status is derived from its order and cannot be changed directly",
    )


@transaction.atomic
def confirm_delivery(
    *,
    organization,
    delivery: Delivery,
    confirmation_type: str = "manual",
    confirmed_by: str = "",
    note: str = "",
    actor=None,
) -> DeliveryConfirmation:
    if delivery.organization_id != organization.id:
        raise DeliveryValidationError("organization_mismatch", "Delivery must belong to organization")
    confirmation, _created = DeliveryConfirmation.objects.update_or_create(
        organization=organization,
        delivery=delivery,
        defaults={
            "confirmation_type": confirmation_type,
            "confirmed_by": confirmed_by,
            "note": note,
            "actor": actor,
        },
    )
    return confirmation
