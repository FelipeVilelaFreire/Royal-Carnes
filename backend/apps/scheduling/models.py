from django.db import models

from apps.core.models import OrganizationScopedModel, TimestampedModel


class Schedule(OrganizationScopedModel, TimestampedModel):
    """A tenant-owned temporal rule; the consumer domain owns its effect."""

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        PAUSED = "paused", "Paused"
        CANCELLED = "cancelled", "Cancelled"

    key = models.SlugField(max_length=100)
    name = models.CharField(max_length=160)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    # Blank deliberately means: inherit the organization's configured timezone.
    timezone = models.CharField(max_length=64, blank=True)
    recurrence_rule = models.JSONField(default=dict)
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField(null=True, blank=True)
    cutoff_minutes = models.PositiveIntegerField(default=0)
    effect_key = models.SlugField(max_length=120)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["key"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "key"],
                name="scheduling_schedule_unique_key",
            )
        ]
        indexes = [
            models.Index(fields=["organization", "status"]),
            models.Index(fields=["organization", "effect_key", "status"]),
        ]

    def __str__(self) -> str:
        return f"{self.organization_id}:{self.key}"


class ScheduleOccurrence(OrganizationScopedModel, TimestampedModel):
    """A deterministic, auditable materialization of one Schedule occurrence."""

    class Status(models.TextChoices):
        PLANNED = "planned", "Planned"
        RUNNING = "running", "Running"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"
        SKIPPED = "skipped", "Skipped"
        CANCELLED = "cancelled", "Cancelled"

    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name="occurrences")
    occurrence_key = models.CharField(max_length=120)
    scheduled_for = models.DateTimeField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PLANNED)
    snapshot = models.JSONField(default=dict, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    failed_at = models.DateTimeField(null=True, blank=True)
    execution_error = models.TextField(blank=True)

    class Meta:
        ordering = ["scheduled_for", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "schedule", "occurrence_key"],
                name="scheduling_occurrence_unique_key",
            )
        ]
        indexes = [
            models.Index(fields=["organization", "schedule", "scheduled_for"]),
            models.Index(fields=["organization", "status", "scheduled_for"]),
        ]

    def __str__(self) -> str:
        return f"{self.schedule_id}:{self.occurrence_key}"
