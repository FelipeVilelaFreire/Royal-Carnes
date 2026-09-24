from datetime import timedelta

from django.db import migrations
from django.utils import timezone


def add_business_days(anchor_on, business_days):
    result = anchor_on
    remaining = business_days
    while remaining:
        result += timedelta(days=1)
        if result.weekday() < 5:
            remaining -= 1
    return result


def backfill_delivery_promises(apps, schema_editor):
    Delivery = apps.get_model("deliveries", "Delivery")
    OrderKindDefinition = apps.get_model("orders", "OrderKindDefinition")
    kinds_by_organization = {
        (kind.organization_id, kind.key): kind
        for kind in OrderKindDefinition.objects.all().only("organization_id", "key", "metadata")
    }
    deliveries = Delivery.objects.select_related(
        "order__subscription__plan",
        "order__box_cycle",
    ).filter(promised_delivery_by_on__isnull=True)
    for delivery in deliveries:
        order = delivery.order
        kind = kinds_by_organization.get((order.organization_id, order.kind_key))
        policy = ((kind.metadata if kind else {}) or {}).get("deliveryPromise", {})
        source = "order_kind"
        if order.kind_key == "subscription-cycle" and order.subscription_id:
            plan = order.subscription.plan
            policy = {
                "minBusinessDays": plan.delivery_min_business_days,
                "maxBusinessDays": plan.delivery_max_business_days,
            }
            source = "subscription_plan"
        minimum = int(policy.get("minBusinessDays", 0))
        maximum = int(policy.get("maxBusinessDays", 0))
        if minimum < 1 or maximum < minimum:
            continue
        anchor = timezone.localtime(order.created_at).date()
        if order.box_cycle_id and order.box_cycle.scheduled_for:
            anchor = timezone.localtime(order.box_cycle.scheduled_for).date()
        delivery.promised_delivery_starts_on = add_business_days(anchor, minimum)
        delivery.promised_delivery_by_on = add_business_days(anchor, maximum)
        delivery.delivery_promise_snapshot = {
            "anchorOn": anchor.isoformat(),
            "kindKey": order.kind_key,
            "maxBusinessDays": maximum,
            "minBusinessDays": minimum,
            "source": source,
        }
        delivery.save(update_fields=[
            "delivery_promise_snapshot",
            "promised_delivery_by_on",
            "promised_delivery_starts_on",
        ])


class Migration(migrations.Migration):
    dependencies = [
        ("deliveries", "0005_delivery_promise"),
        ("orders", "0003_order_box_cycle"),
        ("subscriptions", "0004_plan_delivery_business_days"),
    ]

    operations = [migrations.RunPython(backfill_delivery_promises, migrations.RunPython.noop)]
