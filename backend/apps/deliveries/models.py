from django.conf import settings
from django.db import models

from apps.core.models import OrganizationScopedModel, TimestampedModel


class DeliveryStatusDefinition(OrganizationScopedModel, TimestampedModel):
    key = models.SlugField(max_length=80)
    label = models.CharField(max_length=120)
    sort_order = models.PositiveIntegerField(default=0)
    is_initial = models.BooleanField(default=False)
    is_terminal = models.BooleanField(default=False)
    is_public = models.BooleanField(default=True)
    allowed_next_keys = models.JSONField(default=list, blank=True)
    effects = models.JSONField(default=dict, blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["sort_order", "label"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "key"],
                name="deliveries_status_unique_key",
            )
        ]
        indexes = [
            models.Index(fields=["organization", "is_initial"]),
            models.Index(fields=["organization", "sort_order"]),
        ]

    def __str__(self) -> str:
        return self.label


class Delivery(OrganizationScopedModel, TimestampedModel):
    order = models.OneToOneField(
        "orders.Order",
        on_delete=models.PROTECT,
        related_name="deliveries",
    )
    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.PROTECT,
        related_name="deliveries",
    )
    address = models.ForeignKey(
        "customers.Address",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="deliveries",
    )
    code = models.CharField(max_length=80)
    status_key = models.SlugField(max_length=80)
    confirmation_code = models.CharField(max_length=40, blank=True)
    address_snapshot = models.JSONField(default=dict, blank=True)
    notes = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "code"],
                name="deliveries_delivery_unique_code",
            ),
            models.UniqueConstraint(
                fields=["organization", "order"],
                name="deliveries_delivery_unique_order",
            )
        ]
        indexes = [
            models.Index(fields=["organization", "order"]),
            models.Index(fields=["organization", "customer", "status_key"]),
            models.Index(fields=["organization", "status_key"]),
        ]

    def __str__(self) -> str:
        return self.code


class DeliveryPackage(OrganizationScopedModel, TimestampedModel):
    delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE, related_name="packages")
    label = models.CharField(max_length=120, blank=True)
    package_type = models.CharField(max_length=80, blank=True)
    weight_grams = models.PositiveIntegerField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["id"]
        indexes = [
            models.Index(fields=["organization", "delivery"]),
        ]

    def __str__(self) -> str:
        return self.label or f"Package {self.id}"


class DeliveryStatusHistory(OrganizationScopedModel, TimestampedModel):
    delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE, related_name="status_history")
    from_status_key = models.SlugField(max_length=80, blank=True)
    to_status_key = models.SlugField(max_length=80)
    note = models.TextField(blank=True)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="delivery_status_changes",
    )

    class Meta:
        ordering = ["created_at", "id"]
        indexes = [
            models.Index(fields=["organization", "delivery", "created_at"]),
            models.Index(fields=["organization", "to_status_key"]),
        ]

    def __str__(self) -> str:
        return f"{self.delivery.code}:{self.to_status_key}"


class DeliveryConfirmation(OrganizationScopedModel, TimestampedModel):
    delivery = models.OneToOneField(Delivery, on_delete=models.CASCADE, related_name="confirmation")
    confirmation_type = models.CharField(max_length=80, default="manual")
    confirmed_by = models.CharField(max_length=160, blank=True)
    note = models.TextField(blank=True)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="delivery_confirmations",
    )

    class Meta:
        indexes = [
            models.Index(fields=["organization", "confirmation_type"]),
        ]

    def __str__(self) -> str:
        return f"{self.delivery.code}:{self.confirmation_type}"
