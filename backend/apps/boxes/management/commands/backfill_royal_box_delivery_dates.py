from django.core.management.base import BaseCommand
from django.db import transaction
from apps.deliveries.models import Delivery
from apps.deliveries.services import delivery_promise_for_order

from ...models import BoxCycle
from ...services import next_monthly_delivery_at


class Command(BaseCommand):
    help = "Align existing Royal Box cycles and delivery promises with their recurring delivery day."

    def add_arguments(self, parser):
        parser.add_argument("--apply", action="store_true", help="Persist the calculated dates. Default is dry-run.")

    @transaction.atomic
    def handle(self, *args, **options):
        apply_changes = options["apply"]
        updated = 0
        cycles = BoxCycle.objects.select_related(
            "organization", "subscription__schedule", "schedule_occurrence", "order"
        ).filter(order__isnull=False)

        for cycle in cycles:
            rule = cycle.subscription.schedule.recurrence_rule or {}
            day = rule.get("dayOfMonth")
            if not isinstance(day, int) or not 1 <= day <= 31:
                self.stdout.write(self.style.WARNING(f"Skipping cycle {cycle.id}: missing recurring delivery day."))
                continue
            target_at = next_monthly_delivery_at(
                organization=cycle.organization,
                monthly_day=day,
                at=cycle.order.created_at,
            )
            delivery = Delivery.objects.filter(order=cycle.order).first()
            changed = cycle.scheduled_for != target_at
            self.stdout.write(f"{cycle.order.code}: {cycle.scheduled_for.isoformat()} -> {target_at.isoformat()}")
            if not apply_changes:
                continue
            cycle.scheduled_for = target_at
            cycle.save(update_fields=["scheduled_for", "updated_at"])
            cycle.schedule_occurrence.scheduled_for = target_at
            cycle.schedule_occurrence.save(update_fields=["scheduled_for", "updated_at"])
            if delivery:
                promise = delivery_promise_for_order(organization=cycle.organization, order=cycle.order)
                delivery.promised_delivery_starts_on = promise.get("startsOn")
                delivery.promised_delivery_by_on = promise.get("byOn")
                delivery.delivery_promise_snapshot = {key: value for key, value in promise.items() if key not in {"startsOn", "byOn"}}
                delivery.save(update_fields=["promised_delivery_starts_on", "promised_delivery_by_on", "delivery_promise_snapshot", "updated_at"])
            updated += int(changed)
        if not apply_changes:
            transaction.set_rollback(True)
        self.stdout.write(self.style.SUCCESS(f"Royal Box delivery dates {'updated' if apply_changes else 'previewed'}: {updated if apply_changes else cycles.count()}."))
