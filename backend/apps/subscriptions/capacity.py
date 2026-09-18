from decimal import Decimal

from .models import SubscriptionCycleItem


USAGE_STATUSES = {
    SubscriptionCycleItem.Status.SELECTED,
    SubscriptionCycleItem.Status.RESERVED,
    SubscriptionCycleItem.Status.FULFILLED,
}


def build_cycle_capacity(cycle):
    """Return the plan allowances and real usage for one subscription cycle."""
    entitlements = cycle.subscription.plan.entitlements.all()
    items_by_entitlement = {}
    for item in cycle.items.all():
        if item.status not in USAGE_STATUSES:
            continue
        items_by_entitlement.setdefault(item.entitlement_id, []).append(item)

    capacity = []
    for entitlement in entitlements:
        constraints = entitlement.constraints or {}
        items = items_by_entitlement.get(entitlement.id, [])
        target = next(
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
        capacity.append(
            {
                "key": str(constraints.get("capacityKey") or entitlement.key),
                "label": str(constraints.get("capacityLabel") or getattr(target, "name", entitlement.key)),
                "selection_label": constraints.get("selectionLabel"),
                "used_quantity": str(sum((item.quantity for item in items), Decimal("0"))),
                "limit_quantity": str(entitlement.quantity),
                "measurement_unit_key": getattr(entitlement.measurement_unit, "key", None),
                "measurement_unit_symbol": getattr(entitlement.measurement_unit, "symbol", None),
                "used_selections": len(items),
                "limit_selections": constraints.get("maxSelections"),
                "item_limits": constraints.get("itemLimits", {}),
            }
        )
    return capacity
