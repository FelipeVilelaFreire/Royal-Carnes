from datetime import datetime
from io import StringIO

from django.core.management import call_command
from django.test import TestCase

from apps.core.seed_loader import BackendSeedApplier, BackendSeedLoader
from apps.organizations.models import Organization
from apps.scheduling.models import Schedule, ScheduleOccurrence
from apps.scheduling.services import (
    ScheduleValidationError,
    ensure_occurrence,
    execute_occurrence,
    register_schedule_handler,
    run_due_schedules,
)


class SchedulingServicesTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        BackendSeedApplier(BackendSeedLoader().load("royalprime")).apply()

    def create_schedule(self, **overrides):
        organization = Organization.objects.get(slug="royalprime")
        values = {
            "organization": organization,
            "key": "monthly-cycle",
            "name": "Monthly cycle",
            "timezone": "Europe/Berlin",
            "recurrence_rule": {"frequency": "monthly", "dayOfMonth": 10, "hour": 9, "minute": 0},
            "starts_at": datetime.fromisoformat("2026-01-01T00:00:00+00:00"),
            "effect_key": "test.record",
        }
        values.update(overrides)
        return Schedule.objects.create(**values)

    def test_monthly_schedule_materializes_once_across_reexecution(self):
        schedule = self.create_schedule()
        instant = datetime.fromisoformat("2026-10-10T09:30:00+02:00")

        first = ensure_occurrence(schedule=schedule, at=instant)
        second = ensure_occurrence(schedule=schedule, at=instant)

        self.assertIsNotNone(first)
        self.assertEqual(first.id, second.id)
        self.assertEqual(first.occurrence_key, "2026-10")
        self.assertEqual(ScheduleOccurrence.objects.filter(schedule=schedule).count(), 1)

    def test_schedule_uses_organization_timezone_when_not_overridden(self):
        organization = Organization.objects.get(slug="royalprime")
        organization.timezone = "America/Sao_Paulo"
        organization.save(update_fields=["timezone", "updated_at"])
        schedule = self.create_schedule(timezone="", recurrence_rule={"frequency": "monthly", "dayOfMonth": 10, "hour": 9, "minute": 0})

        before_local_time = run_due_schedules(at=datetime.fromisoformat("2026-10-10T11:59:00+00:00"))
        at_local_time = run_due_schedules(at=datetime.fromisoformat("2026-10-10T12:00:00+00:00"))

        self.assertEqual(before_local_time, [])
        self.assertEqual(len(at_local_time), 1)
        self.assertEqual(at_local_time[0].schedule_id, schedule.id)

    def test_command_is_deterministic_and_only_prepares_occurrences(self):
        schedule = self.create_schedule()
        output = StringIO()

        call_command("run_schedules", "--at", "2026-10-10T07:30:00+00:00", stdout=output)
        call_command("run_schedules", "--at", "2026-10-10T07:30:00+00:00", stdout=output)

        self.assertIn("prepared=1", output.getvalue())
        self.assertEqual(ScheduleOccurrence.objects.filter(schedule=schedule).count(), 1)
        self.assertEqual(ScheduleOccurrence.objects.get(schedule=schedule).status, ScheduleOccurrence.Status.PLANNED)

    def test_occurrence_executes_only_registered_domain_adapter_once(self):
        schedule = self.create_schedule(effect_key="test.execute")
        occurrence = ensure_occurrence(schedule=schedule, at=datetime.fromisoformat("2026-10-10T09:30:00+02:00"))
        calls = []
        register_schedule_handler("test.execute", lambda item: calls.append(item.id))

        execute_occurrence(occurrence=occurrence)
        execute_occurrence(occurrence=occurrence)

        occurrence.refresh_from_db()
        self.assertEqual(calls, [occurrence.id])
        self.assertEqual(occurrence.status, ScheduleOccurrence.Status.COMPLETED)

    def test_unknown_effect_cannot_be_executed(self):
        schedule = self.create_schedule(effect_key="unknown.effect")
        occurrence = ensure_occurrence(schedule=schedule, at=datetime.fromisoformat("2026-10-10T09:30:00+02:00"))

        with self.assertRaises(ScheduleValidationError) as error:
            execute_occurrence(occurrence=occurrence)

        self.assertEqual(error.exception.code, "schedule_effect_not_registered")
