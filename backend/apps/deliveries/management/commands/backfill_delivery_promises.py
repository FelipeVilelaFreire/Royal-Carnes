from django.core.management.base import BaseCommand, CommandError

from apps.deliveries.models import Delivery
from apps.deliveries.services import delivery_promise_for_order
from apps.organizations.models import Organization


class Command(BaseCommand):
    help = "Preview or backfill missing delivery promises from active DeliveryPromisePolicy records."

    def add_arguments(self, parser):
        parser.add_argument("--organization-slug", required=True)
        parser.add_argument("--execute", action="store_true", help="Persist the calculated promises.")

    def handle(self, *args, **options):
        organization = Organization.objects.filter(slug=options["organization_slug"]).first()
        if organization is None:
            raise CommandError("organization_not_found")

        deliveries = Delivery.objects.filter(
            organization=organization,
            promised_delivery_by_on__isnull=True,
        ).select_related("order__subscription__plan", "order__box_cycle")
        updated = 0
        skipped = 0
        for delivery in deliveries:
            promise = delivery_promise_for_order(organization=organization, order=delivery.order)
            if not promise:
                skipped += 1
                continue
            updated += 1
            if not options["execute"]:
                continue
            delivery.promised_delivery_starts_on = promise["startsOn"]
            delivery.promised_delivery_by_on = promise["byOn"]
            delivery.delivery_promise_snapshot = {
                key: value
                for key, value in promise.items()
                if key not in {"startsOn", "byOn"}
            }
            delivery.save(update_fields=[
                "promised_delivery_starts_on",
                "promised_delivery_by_on",
                "delivery_promise_snapshot",
                "updated_at",
            ])

        mode = "applied" if options["execute"] else "preview"
        self.stdout.write(self.style.SUCCESS(
            f"delivery promise backfill {mode}: eligible={updated} skipped_without_policy={skipped}",
        ))
