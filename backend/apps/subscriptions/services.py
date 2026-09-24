from decimal import Decimal

from django.db import transaction
from django.db.models import Sum

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
    accent_color: str = "#FFC665",
    status: str = Plan.Status.ACTIVE,
    billing_interval: str = Plan.BillingInterval.MONTH,
    trial_days: int = 0,
    delivery_min_business_days: int = 3,
    delivery_max_business_days: int = 8,
    sort_order: int = 0,
) -> Plan:
    plan, _created = Plan.objects.update_or_create(
        organization=organization,
        key=key,
        defaults={
            "name": name,
            "description": description,
            "accent_color": accent_color,
            "status": status,
            "billing_interval": billing_interval,
            "trial_days": trial_days,
            "delivery_min_business_days": delivery_min_business_days,
            "delivery_max_business_days": delivery_max_business_days,
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
    legacy_keys: list[str] | None = None,
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
    defaults = {
        "target_type": target_type,
        "quantity": quantity,
        "measurement_unit": measurement_unit,
        "constraints": constraints or {},
        "sort_order": sort_order,
        **target_defaults,
    }
    entitlement = PlanEntitlement.objects.filter(
        organization=organization,
        plan=plan,
        key=key,
    ).first()
    if entitlement is None and legacy_keys:
        entitlement = PlanEntitlement.objects.filter(
            organization=organization,
            plan=plan,
            key__in=legacy_keys,
        ).order_by("id").first()
    if entitlement is None:
        return PlanEntitlement.objects.create(
            organization=organization,
            plan=plan,
            key=key,
            **defaults,
        )

    entitlement.key = key
    for field, value in defaults.items():
        setattr(entitlement, field, value)
    entitlement.save(update_fields=["key", *defaults.keys(), "updated_at"])
    return entitlement


def capacity_key_for(entitlement: PlanEntitlement) -> str:
    return str((entitlement.constraints or {}).get("capacityKey") or entitlement.key)


def capacity_allocation_mode(entitlement: PlanEntitlement) -> str:
    """Return the explicit allocation mode, preserving legacy plans by default."""
    mode = (entitlement.constraints or {}).get("allocationMode")
    return mode if mode in {"standalone", "withinParent"} else "legacy"


def capacity_parent_key_for(entitlement: PlanEntitlement) -> str | None:
    parent_key = (entitlement.constraints or {}).get("parentCapacityKey")
    return str(parent_key) if parent_key else None


def validate_plan_capacity_hierarchy(*, plan: Plan) -> None:
    """Validate explicit plan relationships without assuming a catalog taxonomy.

    A capacity can be a root (standalone) or consume an explicitly declared
    parent capacity.  Catalog categories only define which products are
    eligible; the plan itself owns this allocation tree.
    """
    entitlements = list(plan.entitlements.all())
    by_capacity_key = {capacity_key_for(entitlement): entitlement for entitlement in entitlements}
    for entitlement in entitlements:
        if capacity_allocation_mode(entitlement) != "withinParent":
            continue
        parent_key = capacity_parent_key_for(entitlement)
        if not parent_key or parent_key not in by_capacity_key:
            raise EntitlementValidationError("capacity_parent_not_found", "Capacity parent was not found")
        if parent_key == capacity_key_for(entitlement):
            raise EntitlementValidationError("capacity_hierarchy_cycle", "Capacity cannot be its own parent")

    for entitlement in entitlements:
        visited: set[str] = set()
        current = entitlement
        while capacity_allocation_mode(current) == "withinParent":
            current_key = capacity_key_for(current)
            if current_key in visited:
                raise EntitlementValidationError("capacity_hierarchy_cycle", "Capacity hierarchy contains a cycle")
            visited.add(current_key)
            parent_key = capacity_parent_key_for(current)
            if not parent_key:
                break
            current = by_capacity_key[parent_key]


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


CYCLE_CAPACITY_STATUSES = [
    SubscriptionCycleItem.Status.PENDING,
    SubscriptionCycleItem.Status.SELECTED,
    SubscriptionCycleItem.Status.RESERVED,
    SubscriptionCycleItem.Status.FULFILLED,
]


def category_is_same_or_descendant(category: Category, ancestor: Category) -> bool:
    """Return whether a catalog category belongs to a capacity category."""
    current = category
    while current is not None:
        if current.id == ancestor.id:
            return True
        current = current.parent
    return False


def product_matches_entitlement(product: Product, variant: ProductVariant | None, entitlement: PlanEntitlement) -> bool:
    if entitlement.target_type == PlanEntitlement.TargetType.PRODUCT:
        return entitlement.product_id == product.id
    if entitlement.target_type == PlanEntitlement.TargetType.VARIANT:
        return variant is not None and entitlement.variant_id == variant.id
    if entitlement.target_type == PlanEntitlement.TargetType.CATEGORY:
        return any(
            category_is_same_or_descendant(category_link.category, entitlement.category)
            for category_link in product.category_links.select_related(
                "category__parent__parent__parent__parent"
            )
        )
    if entitlement.target_type == PlanEntitlement.TargetType.COLLECTION:
        return product.collection_links.filter(collection=entitlement.collection).exists()
    return False


def matching_entitlement_targets(*, cycle: SubscriptionCycle, product: Product, variant: ProductVariant | None) -> list[PlanEntitlement]:
    """Return every target that includes a product, before plan allocation rules."""
    return [
        entitlement
        for entitlement in cycle.subscription.plan.entitlements.select_related(
            "collection",
            "category__parent__parent__parent__parent",
            "product",
            "variant",
            "measurement_unit",
        )
        if product_matches_entitlement(product, variant, entitlement)
    ]


def entitlement_target_priority(entitlement: PlanEntitlement) -> tuple[int, int, int, str]:
    target_priority = {
        PlanEntitlement.TargetType.VARIANT: 0,
        PlanEntitlement.TargetType.PRODUCT: 1,
        PlanEntitlement.TargetType.CATEGORY: 2,
        PlanEntitlement.TargetType.COLLECTION: 3,
    }
    current = entitlement.category if entitlement.target_type == PlanEntitlement.TargetType.CATEGORY else None
    category_depth = 0
    while current is not None:
        category_depth += 1
        current = current.parent
    return (
        target_priority[entitlement.target_type],
        -category_depth,
        entitlement.sort_order,
        entitlement.key,
    )


def matching_cycle_entitlements(*, cycle: SubscriptionCycle, product: Product, variant: ProductVariant | None) -> list[PlanEntitlement]:
    """Return the actual capacities consumed by a selection.

    Legacy plans retain category-derived consumption. Explicit plans instead
    follow the configured capacity parent chain, so a target may deliberately
    stay standalone even when it belongs to a catalog child category.
    """
    matches = matching_entitlement_targets(cycle=cycle, product=product, variant=variant)
    if not matches:
        return []
    owner = min(matches, key=entitlement_target_priority)
    if capacity_allocation_mode(owner) == "legacy":
        return matches

    all_entitlements = list(cycle.subscription.plan.entitlements.all())
    by_capacity_key = {capacity_key_for(entitlement): entitlement for entitlement in all_entitlements}
    capacities = []
    current = owner
    visited: set[str] = set()
    while current is not None:
        current_key = capacity_key_for(current)
        if current_key in visited:
            break
        visited.add(current_key)
        capacities.append(current)
        if capacity_allocation_mode(current) != "withinParent":
            break
        current = by_capacity_key.get(capacity_parent_key_for(current) or "")
    return capacities


def cycle_capacity_used_quantity(*, cycle: SubscriptionCycle, entitlement: PlanEntitlement) -> Decimal:
    """Calculate real usage against a capacity target, independent of owner."""
    used_quantity = Decimal("0")
    items = cycle.items.filter(status__in=CYCLE_CAPACITY_STATUSES).select_related("product", "variant")
    for item in items:
        if item.product and entitlement.id in {
            capacity.id
            for capacity in matching_cycle_entitlements(cycle=cycle, product=item.product, variant=item.variant)
        }:
            used_quantity += item.quantity
    return used_quantity


def validate_entitlement_measurement_unit(
    *,
    entitlement: PlanEntitlement,
    measurement_unit: MeasurementUnit | None,
) -> None:
    if entitlement.measurement_unit_id and measurement_unit and entitlement.measurement_unit_id != measurement_unit.id:
        raise EntitlementValidationError("unit_mismatch", "Measurement unit does not match entitlement")
    if entitlement.measurement_unit_id and measurement_unit is None:
        raise EntitlementValidationError("unit_required", "Measurement unit is required")


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
    matching_entitlements = matching_cycle_entitlements(
        cycle=cycle,
        product=product,
        variant=variant,
    )
    if entitlement not in matching_entitlements:
        raise EntitlementValidationError("target_mismatch", "Product does not match entitlement target")
    for capacity in matching_entitlements:
        validate_entitlement_measurement_unit(
            entitlement=capacity,
            measurement_unit=measurement_unit,
        )
        constraints = capacity.constraints or {}
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

        if cycle_capacity_used_quantity(cycle=cycle, entitlement=capacity) + quantity > capacity.quantity:
            raise EntitlementValidationError("quantity_exceeded", "Entitlement quantity exceeded")

        max_quantity = constraints.get("maxQuantity")
        if max_quantity is not None and quantity > Decimal(str(max_quantity)):
            raise EntitlementValidationError("max_quantity_exceeded", "Item quantity exceeds maxQuantity")

    constraints = entitlement.constraints or {}

    for item_limit in constraints.get("itemLimits", []):
        if not isinstance(item_limit, dict):
            continue
        target_type = item_limit.get("targetType", "product")
        target_key = item_limit.get("targetKey")
        matches_target = (
            target_type == "product" and target_key == product.key
        ) or (
            target_type == "variant" and target_key == variant.sku
        )
        if matches_target and item_limit.get("maxQuantity") is not None:
            used_for_target = cycle.items.filter(
                entitlement=entitlement,
                product=product,
                variant=variant,
            ).exclude(status=SubscriptionCycleItem.Status.CANCELLED).aggregate(total=Sum("quantity"))["total"] or Decimal("0")
            if used_for_target + quantity > Decimal(str(item_limit["maxQuantity"])):
                raise EntitlementValidationError("item_limit_exceeded", "Item quantity exceeds item limit")

    max_selections = constraints.get("maxSelections")
    if max_selections is not None:
        current_selections = (
            cycle.items.filter(entitlement=entitlement)
            .exclude(status=SubscriptionCycleItem.Status.CANCELLED)
            .count()
        )
        if current_selections + 1 > int(max_selections):
            raise EntitlementValidationError("max_selections_exceeded", "Entitlement selections exceeded")


def resolve_cycle_entitlement(
    *,
    cycle: SubscriptionCycle,
    product: Product,
    variant: ProductVariant | None,
) -> PlanEntitlement:
    """Resolve the entitlement that owns a product in this subscription cycle.

    A plan can intentionally expose overlapping targets.  In that case the
    narrowest target wins so a variant/product allowance is never silently
    consumed from a broader category/collection allowance.
    """
    matches = matching_entitlement_targets(cycle=cycle, product=product, variant=variant)
    if not matches:
        raise EntitlementValidationError("product_not_in_plan", "Product is not included in the subscription plan")
    return min(matches, key=entitlement_target_priority)


@transaction.atomic
def reserve_cycle_order_items(*, organization, cycle: SubscriptionCycle, items: list[dict]) -> None:
    """Validate and reserve all subscription order items as one cycle mutation.

    The order API calls this service instead of trusting quantities calculated
    by a client.  The cycle row is locked so concurrent order requests cannot
    both spend the same remaining entitlement balance.
    """
    locked_cycle = SubscriptionCycle.objects.select_for_update().select_related("subscription__plan").get(
        organization=organization,
        id=cycle.id,
    )
    if locked_cycle.status != SubscriptionCycle.Status.OPEN:
        raise EntitlementValidationError("subscription_cycle_not_open", "Subscription cycle is not open for selection")

    prepared: list[tuple[PlanEntitlement, dict, list[PlanEntitlement]]] = []
    requested_by_capacity: dict[int, Decimal] = {}
    capacities_by_id: dict[int, PlanEntitlement] = {}
    requested_selection_keys: dict[int, set[tuple[int, int | None]]] = {}

    for item in items:
        product = item["product"]
        variant = item.get("variant")
        quantity = Decimal(str(item["quantity"]))
        entitlement = resolve_cycle_entitlement(cycle=locked_cycle, product=product, variant=variant)
        measurement_unit = variant.measurement_unit if variant else None
        validate_cycle_item_selection(
            organization=organization,
            cycle=locked_cycle,
            entitlement=entitlement,
            product=product,
            variant=variant,
            quantity=quantity,
            measurement_unit=measurement_unit,
        )
        capacities = matching_cycle_entitlements(cycle=locked_cycle, product=product, variant=variant)
        prepared.append((entitlement, item, capacities))
        for capacity in capacities:
            capacities_by_id[capacity.id] = capacity
            requested_by_capacity[capacity.id] = requested_by_capacity.get(capacity.id, Decimal("0")) + quantity
            requested_selection_keys.setdefault(capacity.id, set()).add((product.id, variant.id if variant else None))

    for capacity_id, requested_quantity in requested_by_capacity.items():
        entitlement = capacities_by_id[capacity_id]
        if cycle_capacity_used_quantity(cycle=locked_cycle, entitlement=entitlement) + requested_quantity > entitlement.quantity:
            raise EntitlementValidationError("quantity_exceeded", "Entitlement quantity exceeded")

        max_selections = (entitlement.constraints or {}).get("maxSelections")
        if max_selections is not None:
            current_selection_keys = {
                (item.product_id, item.variant_id)
                for item in locked_cycle.items.exclude(status=SubscriptionCycleItem.Status.CANCELLED).select_related("product", "variant")
                if item.product and entitlement.id in {
                    capacity.id
                    for capacity in matching_cycle_entitlements(cycle=locked_cycle, product=item.product, variant=item.variant)
                }
            }
            next_selection_count = len(current_selection_keys | requested_selection_keys[capacity_id])
            if next_selection_count > int(max_selections):
                raise EntitlementValidationError("max_selections_exceeded", "Entitlement selections exceeded")

    for entitlement, item, _capacities in prepared:
        product = item["product"]
        variant = item.get("variant")
        quantity = Decimal(str(item["quantity"]))
        existing = locked_cycle.items.select_for_update().filter(
            entitlement=entitlement,
            product=product,
            variant=variant,
        ).first()
        if existing is None:
            SubscriptionCycleItem.objects.create(
                organization=organization,
                cycle=locked_cycle,
                entitlement=entitlement,
                product=product,
                variant=variant,
                quantity=quantity,
                measurement_unit=variant.measurement_unit if variant else None,
                status=SubscriptionCycleItem.Status.RESERVED,
            )
            continue
        existing.quantity += quantity
        existing.measurement_unit = variant.measurement_unit if variant else existing.measurement_unit
        existing.status = SubscriptionCycleItem.Status.RESERVED
        existing.save(update_fields=["quantity", "measurement_unit", "status", "updated_at"])
