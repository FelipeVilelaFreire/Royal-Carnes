from decimal import Decimal

from .models import SubscriptionCycleItem
from .services import (
    capacity_allocation_mode,
    capacity_parent_key_for,
    cycle_capacity_used_quantity,
    matching_cycle_entitlements,
)


def entitlement_target(entitlement):
    return next(
        (
            value
            for value in (
                entitlement.collection,
                entitlement.category,
                entitlement.product,
                entitlement.variant,
            )
            if value is not None
        ),
        None,
    )


def build_cycle_capacity(cycle):
    """Return the plan allowances and real usage for one subscription cycle."""
    entitlements = cycle.subscription.plan.entitlements.all()
    capacity = []
    for entitlement in entitlements:
        constraints = entitlement.constraints or {}
        target = entitlement_target(entitlement)
        used_quantity = cycle_capacity_used_quantity(cycle=cycle, entitlement=entitlement)
        capacity.append(
            {
                "key": str(constraints.get("capacityKey") or entitlement.key),
                "label": str(constraints.get("capacityLabel") or getattr(target, "name", entitlement.key)),
                "selection_label": constraints.get("selectionLabel"),
                "target_type": entitlement.target_type,
                "target_key": getattr(target, "key", getattr(target, "sku", None)),
                "parent_key": getattr(getattr(target, "parent", None), "key", None),
                "allocation_mode": capacity_allocation_mode(entitlement),
                "parent_capacity_key": capacity_parent_key_for(entitlement),
                "used_quantity": str(used_quantity),
                "limit_quantity": str(entitlement.quantity),
                "remaining_quantity": str(max(entitlement.quantity - used_quantity, Decimal("0"))),
                "measurement_unit_key": getattr(entitlement.measurement_unit, "key", None),
                "measurement_unit_symbol": getattr(entitlement.measurement_unit, "symbol", None),
                "used_selections": sum(
                    1
                    for item in cycle.items.exclude(status=SubscriptionCycleItem.Status.CANCELLED).select_related("product", "variant")
                    if item.product and entitlement.id in {
                        capacity.id
                        for capacity in matching_cycle_entitlements(cycle=cycle, product=item.product, variant=item.variant)
                    }
                ),
                "limit_selections": constraints.get("maxSelections"),
                "item_limits": constraints.get("itemLimits", {}),
            }
        )
    return capacity
