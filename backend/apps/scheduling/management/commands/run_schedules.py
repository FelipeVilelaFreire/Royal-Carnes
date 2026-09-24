from datetime import datetime

from django.core.management.base import BaseCommand, CommandError

from apps.scheduling.services import ScheduleValidationError, execute_occurrence, run_due_schedules


class Command(BaseCommand):
    help = "Materialize due schedule occurrences without executing domain effects."

    def add_arguments(self, parser):
        parser.add_argument("--at", required=True, help="ISO-8601 instant with UTC offset")
        parser.add_argument("--execute", action="store_true", help="Execute registered domain effects after preparation")

    def handle(self, *args, **options):
        try:
            instant = datetime.fromisoformat(options["at"].replace("Z", "+00:00"))
            occurrences = run_due_schedules(at=instant)
            executed = 0
            if options["execute"]:
                for occurrence in occurrences:
                    if occurrence.status == "planned":
                        execute_occurrence(occurrence=occurrence)
                        executed += 1
        except (ValueError, ScheduleValidationError) as error:
            raise CommandError(str(error)) from error
        self.stdout.write(self.style.SUCCESS(f"prepared={len(occurrences)} executed={executed}"))
