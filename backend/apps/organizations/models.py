from django.db import models

from apps.core.models import SoftDeleteModel, TimestampedModel


class Organization(TimestampedModel, SoftDeleteModel):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        SUSPENDED = "suspended", "Suspended"
        ARCHIVED = "archived", "Archived"

    slug = models.SlugField(max_length=80, unique=True)
    name = models.CharField(max_length=160)
    business_name = models.CharField(max_length=180, blank=True)
    legal_name = models.CharField(max_length=180, blank=True)
    document = models.CharField(max_length=40, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    default_locale = models.CharField(max_length=16, default="pt-BR")
    timezone = models.CharField(max_length=64, default="America/Sao_Paulo")
    currency = models.CharField(max_length=3, default="BRL")

    class Meta:
        ordering = ["name"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self) -> str:
        return self.name


class OrganizationSettings(TimestampedModel):
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="settings",
    )
    key = models.CharField(max_length=120)
    value = models.JSONField(default=dict, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "key"],
                name="organization_settings_unique_key",
            )
        ]
        indexes = [
            models.Index(fields=["organization", "key"]),
        ]

    def __str__(self) -> str:
        return f"{self.organization.slug}:{self.key}"


class OrganizationDomain(TimestampedModel):
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="domains",
    )
    domain = models.CharField(max_length=255, unique=True)
    is_primary = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=["domain"]),
            models.Index(fields=["organization", "is_primary"]),
        ]

    def __str__(self) -> str:
        return self.domain


class OrganizationFeatureFlag(TimestampedModel):
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="feature_flags",
    )
    key = models.CharField(max_length=120)
    enabled = models.BooleanField(default=False)
    config = models.JSONField(default=dict, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "key"],
                name="organization_feature_flag_unique_key",
            )
        ]
        indexes = [
            models.Index(fields=["organization", "enabled"]),
        ]

    def __str__(self) -> str:
        return f"{self.organization.slug}:{self.key}"
