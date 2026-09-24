from __future__ import annotations

from calendar import monthrange
from collections.abc import Callable
from datetime import datetime, timedelta, timezone as datetime_timezone
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from django.db import transaction
from django.utils import timezone

from .models import Schedule, ScheduleOccurrence


class ScheduleValidationError(ValueError):
    def __init__(self, code: str, detail: str):
        self.code = code
        self.detail = detail
        super().__init__(detail)


OccurrenceHandler = Callable[[ScheduleOccurrence], None]
_HANDLERS: dict[str, OccurrenceHandler] = {}


def register_schedule_handler(effect_key: str, handler: OccurrenceHandler) -> None:
    """Register an explicit domain adapter without coupling scheduling to it."""
    _HANDLERS[effect_key] = handler


def effective_timezone(schedule: Schedule) -> ZoneInfo:
    try:
        return ZoneInfo(schedule.timezone or schedule.organization.timezone)
    except ZoneInfoNotFoundError as error:
        raise ScheduleValidationError("schedule_timezone_invalid", "Schedule timezone is invalid") from error


def _as_utc(at: datetime | None) -> datetime:
    instant = at or timezone.now()
    if timezone.is_naive(instant):
        raise ScheduleValidationError("schedule_at_timezone_required", "Schedule execution time must include timezone")
    return instant.astimezone(datetime_timezone.utc)


def _rule_value(rule: dict, name: str, *, minimum: int, maximum: int) -> int:
    value = rule.get(name)
    if not isinstance(value, int) or not minimum <= value <= maximum:
        raise ScheduleValidationError("schedule_rule_invalid", f"Schedule rule requires {name}")
    return value


def due_occurrence(schedule: Schedule, *, at: datetime | None = None) -> tuple[str, datetime] | None:
    """Return this rule's current due occurrence, without creating it."""
    instant = _as_utc(at)
    local_now = instant.astimezone(effective_timezone(schedule))
    rule = schedule.recurrence_rule or {}
    frequency = rule.get("frequency")

    if frequency == "monthly":
        day = _rule_value(rule, "dayOfMonth", minimum=1, maximum=31)
        hour = _rule_value(rule, "hour", minimum=0, maximum=23)
        minute = _rule_value(rule, "minute", minimum=0, maximum=59)
        effective_day = min(day, monthrange(local_now.year, local_now.month)[1])
        candidate = local_now.replace(day=effective_day, hour=hour, minute=minute, second=0, microsecond=0)
        key = f"{candidate.year:04d}-{candidate.month:02d}"
    elif frequency == "weekly":
        weekday = _rule_value(rule, "weekday", minimum=0, maximum=6)
        hour = _rule_value(rule, "hour", minimum=0, maximum=23)
        minute = _rule_value(rule, "minute", minimum=0, maximum=59)
        candidate = local_now.replace(hour=hour, minute=minute, second=0, microsecond=0)
        candidate -= timedelta(days=(local_now.weekday() - weekday) % 7)
        key = candidate.date().isoformat()
    elif frequency == "once":
        candidate = schedule.starts_at.astimezone(effective_timezone(schedule))
        key = candidate.astimezone(datetime_timezone.utc).isoformat()
    else:
        raise ScheduleValidationError("schedule_frequency_invalid", "Schedule frequency is not supported")

    candidate_utc = candidate.astimezone(datetime_timezone.utc)
    if candidate_utc > instant or candidate_utc < schedule.starts_at.astimezone(datetime_timezone.utc):
        return None
    if schedule.ends_at is not None and candidate_utc > schedule.ends_at.astimezone(datetime_timezone.utc):
        return None
    return key, candidate_utc


@transaction.atomic
def ensure_occurrence(*, schedule: Schedule, at: datetime | None = None) -> ScheduleOccurrence | None:
    locked_schedule = Schedule.objects.select_for_update().select_related("organization").get(pk=schedule.pk)
    if locked_schedule.status != Schedule.Status.ACTIVE:
        return None
    due = due_occurrence(locked_schedule, at=at)
    if due is None:
        return None
    occurrence_key, scheduled_for = due
    occurrence, _created = ScheduleOccurrence.objects.get_or_create(
        organization=locked_schedule.organization,
        schedule=locked_schedule,
        occurrence_key=occurrence_key,
        defaults={
            "scheduled_for": scheduled_for,
            "snapshot": {
                "effectKey": locked_schedule.effect_key,
                "recurrenceRule": locked_schedule.recurrence_rule,
                "timezone": locked_schedule.timezone or locked_schedule.organization.timezone,
            },
        },
    )
    return occurrence


def run_due_schedules(*, at: datetime | None = None) -> list[ScheduleOccurrence]:
    instant = _as_utc(at)
    occurrences: list[ScheduleOccurrence] = []
    for schedule in Schedule.objects.filter(status=Schedule.Status.ACTIVE).select_related("organization"):
        occurrence = ensure_occurrence(schedule=schedule, at=instant)
        if occurrence is not None:
            occurrences.append(occurrence)
    return occurrences


@transaction.atomic
def execute_occurrence(*, occurrence: ScheduleOccurrence) -> ScheduleOccurrence:
    locked = ScheduleOccurrence.objects.select_for_update().select_related("schedule", "organization").get(pk=occurrence.pk)
    if locked.status == ScheduleOccurrence.Status.COMPLETED:
        return locked
    if locked.status not in {ScheduleOccurrence.Status.PLANNED, ScheduleOccurrence.Status.FAILED}:
        raise ScheduleValidationError("schedule_occurrence_not_executable", "Schedule occurrence is not executable")
    handler = _HANDLERS.get(locked.schedule.effect_key)
    if handler is None:
        raise ScheduleValidationError("schedule_effect_not_registered", "Schedule effect handler is not registered")
    locked.status = ScheduleOccurrence.Status.RUNNING
    locked.started_at = timezone.now()
    locked.execution_error = ""
    locked.save(update_fields=["status", "started_at", "execution_error", "updated_at"])
    try:
        handler(locked)
    except Exception as error:
        locked.status = ScheduleOccurrence.Status.FAILED
        locked.failed_at = timezone.now()
        locked.execution_error = str(error)
        locked.save(update_fields=["status", "failed_at", "execution_error", "updated_at"])
        raise
    locked.status = ScheduleOccurrence.Status.COMPLETED
    locked.completed_at = timezone.now()
    locked.save(update_fields=["status", "completed_at", "updated_at"])
    return locked


@transaction.atomic
def pause_schedule(*, schedule: Schedule) -> Schedule:
    schedule.status = Schedule.Status.PAUSED
    schedule.save(update_fields=["status", "updated_at"])
    return schedule


@transaction.atomic
def resume_schedule(*, schedule: Schedule) -> Schedule:
    schedule.status = Schedule.Status.ACTIVE
    schedule.save(update_fields=["status", "updated_at"])
    return schedule


@transaction.atomic
def cancel_future_occurrences(*, schedule: Schedule, at: datetime | None = None) -> int:
    instant = _as_utc(at)
    return ScheduleOccurrence.objects.filter(
        schedule=schedule,
        status=ScheduleOccurrence.Status.PLANNED,
        scheduled_for__gt=instant,
    ).update(status=ScheduleOccurrence.Status.CANCELLED)
