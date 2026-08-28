from django.db import transaction

from apps.core.code_sequences import generate_code
from apps.customers.models import Address

from .models import Delivery, DeliveryConfirmation, DeliveryStatusDefinition, DeliveryStatusHistory


class DeliveryValidationError(ValueError):
    def __init__(self, code: str, detail: str):
        self.code = code
        self.detail = detail
        super().__init__(detail)


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
    status = initial_delivery_status(organization)
    delivery = Delivery.objects.create(
        organization=organization,
        order=order,
        customer=order.customer,
        address=order.address,
        code=generate_code(organization=organization, key=code_sequence_key),
        status_key=status.key,
        confirmation_code=confirmation_code,
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
    if delivery.organization_id != organization.id:
        raise DeliveryValidationError("organization_mismatch", "Delivery must belong to organization")
    current_status = DeliveryStatusDefinition.objects.get(organization=organization, key=delivery.status_key)
    next_status = DeliveryStatusDefinition.objects.get(organization=organization, key=to_status_key)
    if current_status.is_terminal:
        raise DeliveryValidationError("delivery_status_terminal", "Delivery status is terminal")
    allowed_next_keys = current_status.allowed_next_keys or []
    if allowed_next_keys and next_status.key not in allowed_next_keys:
        raise DeliveryValidationError("delivery_status_transition_not_allowed", "Delivery status transition is not allowed")
    previous = delivery.status_key
    delivery.status_key = next_status.key
    delivery.save(update_fields=["status_key", "updated_at"])
    DeliveryStatusHistory.objects.create(
        organization=organization,
        delivery=delivery,
        from_status_key=previous,
        to_status_key=next_status.key,
        actor=actor,
        note=note,
    )
    return delivery


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
    terminal_status = next(
        (
            status
            for status in DeliveryStatusDefinition.objects.filter(
                organization=organization,
                is_terminal=True,
            ).order_by("sort_order")
            if (status.effects or {}).get("confirmDelivery")
        ),
        None,
    )
    if terminal_status and delivery.status_key != terminal_status.key:
        transition_delivery_status(
            organization=organization,
            delivery=delivery,
            to_status_key=terminal_status.key,
            actor=actor,
            note=note or "Delivery confirmed",
        )
    return confirmation
