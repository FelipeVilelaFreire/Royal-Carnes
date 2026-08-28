from django.conf import settings
from django.db import models
from django.db.models import Q

from apps.core.models import OrganizationScopedModel, TimestampedModel


class InventoryItem(OrganizationScopedModel, TimestampedModel):
    class Status(models.TextChoices):
        AVAILABLE = "available", "Available"
        LIMITED = "limited", "Limited"
        UNAVAILABLE = "unavailable", "Unavailable"
        DISABLED = "disabled", "Disabled"

    product = models.ForeignKey(
        "catalog.Product",
        on_delete=models.PROTECT,
        related_name="inventory_items",
    )
    variant = models.ForeignKey(
        "catalog.ProductVariant",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="inventory_items",
    )
    measurement_unit = models.ForeignKey(
        "catalog.MeasurementUnit",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="inventory_items",
    )
    available_quantity = models.DecimalField(max_digits=12, decimal_places=3, default=0)
    reserved_quantity = models.DecimalField(max_digits=12, decimal_places=3, default=0)
    low_stock_threshold = models.DecimalField(max_digits=12, decimal_places=3, default=0)
    status = models.CharField(max_length=24, choices=Status.choices, default=Status.AVAILABLE)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["product__name", "variant__name"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "product"],
                condition=Q(variant__isnull=True),
                name="inventory_item_unique_product_without_variant",
            ),
            models.UniqueConstraint(
                fields=["organization", "product", "variant"],
                condition=Q(variant__isnull=False),
                name="inventory_item_unique_product_variant",
            )
        ]
        indexes = [
            models.Index(fields=["organization", "status"]),
            models.Index(fields=["organization", "product"]),
            models.Index(fields=["organization", "variant"]),
        ]

    @property
    def sellable_quantity(self):
        return self.available_quantity - self.reserved_quantity

    def __str__(self) -> str:
        label = self.variant.name if self.variant else self.product.name
        return f"{label}: {self.available_quantity}"


class InventoryMovement(OrganizationScopedModel, TimestampedModel):
    class MovementType(models.TextChoices):
        MANUAL_ADJUSTMENT = "manualAdjustment", "Manual adjustment"
        STOCK_IN = "stockIn", "Stock in"
        STOCK_OUT = "stockOut", "Stock out"
        RESERVATION = "reservation", "Reservation"
        RELEASE_RESERVATION = "releaseReservation", "Release reservation"

    inventory_item = models.ForeignKey(
        InventoryItem,
        on_delete=models.CASCADE,
        related_name="movements",
    )
    movement_type = models.CharField(max_length=32, choices=MovementType.choices)
    quantity_delta = models.DecimalField(max_digits=12, decimal_places=3)
    reserved_delta = models.DecimalField(max_digits=12, decimal_places=3, default=0)
    reason = models.CharField(max_length=160, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="inventory_movements",
    )

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["organization", "inventory_item", "created_at"]),
            models.Index(fields=["organization", "movement_type"]),
        ]

    def __str__(self) -> str:
        return f"{self.movement_type}: {self.quantity_delta}"


class StockReservation(OrganizationScopedModel, TimestampedModel):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        RELEASED = "released", "Released"
        CONSUMED = "consumed", "Consumed"
        CANCELLED = "cancelled", "Cancelled"

    inventory_item = models.ForeignKey(
        InventoryItem,
        on_delete=models.CASCADE,
        related_name="reservations",
    )
    quantity = models.DecimalField(max_digits=12, decimal_places=3)
    status = models.CharField(max_length=24, choices=Status.choices, default=Status.ACTIVE)
    source_type = models.CharField(max_length=80, blank=True)
    source_key = models.CharField(max_length=120, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["organization", "inventory_item", "status"]),
            models.Index(fields=["organization", "source_type", "source_key"]),
        ]

    def __str__(self) -> str:
        return f"{self.inventory_item_id}:{self.quantity}:{self.status}"
