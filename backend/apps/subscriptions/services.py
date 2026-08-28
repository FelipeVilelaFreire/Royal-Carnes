from decimal import Decimal

from django.db import transaction

from apps.catalog.models import (
    CatalogAvailability,
    Category,
    Collection,
    CommercialMode,
    MeasurementUnit,
    Product,
    ProductVariant,
)
from apps.customers.models import Customer

from .models import Plan, PlanEntitlement, PlanPrice, Subscription, SubscriptionCycle, SubscriptionCycleItem


class EntitlementValidationError(ValueError):
    def __init__(self, code: str, detail: str):
        self.code = code
        self.detail = detail
        super().__init__(detail)


@transaction.atomic
def upsert_plan(
    *,
    organization,
    key: str,
    name: str,
    description: str = "",
    status: str = Plan.Status.ACTIVE,
    billing_interval: str = Plan.BillingInterval.MONTH,
    trial_days: int = 0,
    sort_order: int = 0,
) -> Plan:
    plan, _created = Plan.objects.update_or_create(
        organization=organization,
        key=key,
        defaults={
            "name": name,
            "description": description,
            "status": status,
            "billing_interval": billing_interval,
            "trial_days": trial_days,
            "sort_order": sort_order,
        },
    )
    return plan


@transaction.atomic
def set_plan_price(
    *,
    organization,
    plan: Plan,
    amount_cents: int,
    currency: str,
    billing_interval: str,
    billing_interval_count: int = 1,
    price_type: str = PlanPrice.PriceType.RECURRING,
) -> PlanPrice:
    price, _created = PlanPrice.objects.update_or_create(
        organization=organization,
        plan=plan,
        billing_interval=billing_interval,
        billing_interval_count=billing_interval_count,
        price_type=price_type,
        currency=currency,
        defaults={"amount_cents": amount_cents},
    )
    return price


def resolve_entitlement_target(*, organization, target_type: str, target_key: str):
    if target_type == PlanEntitlement.TargetType.COLLECTION:
        return {"collection": Collection.objects.get(organization=organization, key=target_key)}
    if target_type == PlanEntitlement.TargetType.CATEGORY:
        return {"category": Category.objects.get(organization=organization, key=target_key)}
    if target_type == PlanEntitlement.TargetType.PRODUCT:
        return {"product": Product.objects.get(organization=organization, key=target_key)}
    if target_type == PlanEntitlement.TargetType.VARIANT:
        return {"variant": ProductVariant.objects.get(organization=organization, sku=target_key)}
    raise EntitlementValidationError("invalid_target_type", f"Invalid target type: {target_type}")


@transaction.atomic
def upsert_plan_entitlement(
    *,
    organization,
    plan: Plan,
    key: str,
    target_type: str,
    target_key: str,
    quantity,
    measurement_unit_key: str | None = None,
    constraints: dict | None = None,
    sort_order: int = 0,
) -> PlanEntitlement:
    target_defaults = {
        "collection": None,
        "category": None,
        "product": None,
        "variant": None,
    }
    target_defaults.update(
        resolve_entitlement_target(
            organization=organization,
            target_type=target_type,
            target_key=target_key,
        )
    )
    measurement_unit = None
    if measurement_unit_key:
        measurement_unit = MeasurementUnit.objects.get(
            organization=organization,
            key=measurement_unit_key,
        )
    entitlement, _created = PlanEntitlement.objects.update_or_create(
        organization=organization,
        plan=plan,
        key=key,
        defaults={
            "target_type": target_type,
            "quantity": quantity,
            "measurement_unit": measurement_unit,
            "constraints": constraints or {},
            "sort_order": sort_order,
            **target_defaults,
        },
    )
    return entitlement


@transaction.atomic
def upsert_subscription(
    *,
    organization,
    customer: Customer,
    plan: Plan,
    status: str,
    started_at,
    current_cycle_starts_at=None,
    current_cycle_ends_at=None,
) -> Subscription:
    subscription, _created = Subscription.objects.update_or_create(
        organization=organization,
        customer=customer,
        plan=plan,
        defaults={
            "status": status,
            "started_at": started_at,
            "current_cycle_starts_at": current_cycle_starts_at,
            "current_cycle_ends_at": current_cycle_ends_at,
        },
    )
    return subscription


@transaction.atomic
def upsert_subscription_cycle(
    *,
    organization,
    subscription: Subscription,
    cycle_number: int,
    starts_at,
    ends_at,
    status: str = SubscriptionCycle.Status.OPEN,
) -> SubscriptionCycle:
    cycle, _created = SubscriptionCycle.objects.update_or_create(
        organization=organization,
        subscription=subscription,
        cycle_number=cycle_number,
        defaults={
            "starts_at": starts_at,
            "ends_at": ends_at,
            "status": status,
        },
    )
    return cycle


@transaction.atomic
def upsert_subscription_cycle_item(
    *,
    organization,
    cycle: SubscriptionCycle,
    entitlement: PlanEntitlement,
    quantity,
    measurement_unit: MeasurementUnit | None = None,
    product: Product | None = None,
    variant: ProductVariant | None = None,
    status: str = SubscriptionCycleItem.Status.PENDING,
) -> SubscriptionCycleItem:
    item, _created = SubscriptionCycleItem.objects.update_or_create(
        organization=organization,
        cycle=cycle,
        entitlement=entitlement,
        product=product,
        variant=variant,
        defaults={
            "quantity": quantity,
            "measurement_unit": measurement_unit,
            "status": status,
        },
    )
    return item


def product_matches_entitlement(product: Product, variant: ProductVariant | None, entitlement: PlanEntitlement) -> bool:
    if entitlement.target_type == PlanEntitlement.TargetType.PRODUCT:
        return entitlement.product_id == product.id
    if entitlement.target_type == PlanEntitlement.TargetType.VARIANT:
        return variant is not None and entitlement.variant_id == variant.id
    if entitlement.target_type == PlanEntitlement.TargetType.CATEGORY:
        return product.category_links.filter(category=entitlement.category).exists()
    if entitlement.target_type == PlanEntitlement.TargetType.COLLECTION:
        return product.collection_links.filter(collection=entitlement.collection).exists()
    return False


def validate_cycle_item_selection(
    *,
    organization,
    cycle: SubscriptionCycle,
    entitlement: PlanEntitlement,
    product: Product,
    variant: ProductVariant | None,
    quantity,
    measurement_unit: MeasurementUnit | None,
) -> None:
    quantity = Decimal(str(quantity))
    if entitlement.organization_id != organization.id or cycle.organization_id != organization.id:
        raise EntitlementValidationError("organization_mismatch", "Entitlement and cycle must belong to organization")
    if entitlement.plan_id != cycle.subscription.plan_id:
        raise EntitlementValidationError("plan_mismatch", "Entitlement does not belong to subscription plan")
    if variant is not None and variant.product_id != product.id:
        raise EntitlementValidationError("variant_product_mismatch", "Variant does not belong to product")
    if not product_matches_entitlement(product, variant, entitlement):
        raise EntitlementValidationError("target_mismatch", "Product does not match entitlement target")
    if entitlement.measurement_unit_id and measurement_unit and entitlement.measurement_unit_id != measurement_unit.id:
        raise EntitlementValidationError("unit_mismatch", "Measurement unit does not match entitlement")
    if entitlement.measurement_unit_id and measurement_unit is None:
        raise EntitlementValidationError("unit_required", "Measurement unit is required")

    constraints = entitlement.constraints or {}
    if constraints.get("requiresAvailability"):
        commercial_mode_keys = constraints.get("allowedCommercialModes") or []
        available = CatalogAvailability.objects.filter(
            organization=organization,
            product=product,
            is_available=True,
        )
        if commercial_mode_keys:
            available = available.filter(commercial_mode__key__in=commercial_mode_keys)
        if not available.exists():
            raise EntitlementValidationError("unavailable", "Product is unavailable for entitlement")

    allowed_attributes = constraints.get("allowedAttributes") or {}
    if allowed_attributes and variant:
        for attribute_key, allowed_values in allowed_attributes.items():
            if variant.attributes.get(attribute_key) not in allowed_values:
                raise EntitlementValidationError("attribute_not_allowed", f"Attribute not allowed: {attribute_key}")

    used_quantity = sum(
        item.quantity
        for item in cycle.items.filter(
            entitlement=entitlement,
            status__in=[
                SubscriptionCycleItem.Status.PENDING,
                SubscriptionCycleItem.Status.SELECTED,
                SubscriptionCycleItem.Status.RESERVED,
                SubscriptionCycleItem.Status.FULFILLED,
            ],
        )
    )
    if used_quantity + quantity > entitlement.quantity:
        raise EntitlementValidationError("quantity_exceeded", "Entitlement quantity exceeded")

    max_quantity = constraints.get("maxQuantity")
    if max_quantity is not None and quantity > Decimal(str(max_quantity)):
        raise EntitlementValidationError("max_quantity_exceeded", "Item quantity exceeds maxQuantity")

    max_selections = constraints.get("maxSelections")
    if max_selections is not None:
        current_selections = (
            cycle.items.filter(entitlement=entitlement)
            .exclude(status=SubscriptionCycleItem.Status.CANCELLED)
            .count()
        )
        if current_selections + 1 > int(max_selections):
            raise EntitlementValidationError("max_selections_exceeded", "Entitlement selections exceeded")
