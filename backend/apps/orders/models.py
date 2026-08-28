from django.conf import settings
from django.db import models

from apps.core.models import OrganizationScopedModel, TimestampedModel


class OrderKindDefinition(OrganizationScopedModel, TimestampedModel):
    key = models.SlugField(max_length=80)
    label = models.CharField(max_length=120)
    commercial_mode = models.ForeignKey(
        "catalog.CommercialMode",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="order_kinds",
    )
    code_sequence_key = models.SlugField(max_length=80, default="orders")
    requires_inventory = models.BooleanField(default=True)
    creates_delivery = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["sort_order", "label"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "key"],
                name="orders_kind_unique_key",
            )
        ]

    def __str__(self) -> str:
        return self.label


class OrderStatusDefinition(OrganizationScopedModel, TimestampedModel):
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
                name="orders_status_unique_key",
            )
        ]
        indexes = [
            models.Index(fields=["organization", "is_initial"]),
            models.Index(fields=["organization", "sort_order"]),
        ]

    def __str__(self) -> str:
        return self.label


class Order(OrganizationScopedModel, TimestampedModel):
    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.PROTECT,
        related_name="orders",
    )
    address = models.ForeignKey(
        "customers.Address",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="orders",
    )
    subscription = models.ForeignKey(
        "subscriptions.Subscription",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="orders",
    )
    subscription_cycle = models.ForeignKey(
        "subscriptions.SubscriptionCycle",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="orders",
    )
    code = models.CharField(max_length=80)
    kind_key = models.SlugField(max_length=80)
    status_key = models.SlugField(max_length=80)
    currency = models.CharField(max_length=3, default="BRL")
    subtotal_cents = models.PositiveIntegerField(default=0)
    discount_cents = models.PositiveIntegerField(default=0)
    freight_cents = models.PositiveIntegerField(default=0)
    total_cents = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "code"],
                name="orders_order_unique_code",
            )
        ]
        indexes = [
            models.Index(fields=["organization", "customer", "status_key"]),
            models.Index(fields=["organization", "kind_key", "status_key"]),
            models.Index(fields=["organization", "created_at"]),
        ]

    def __str__(self) -> str:
        return self.code


class OrderItem(OrganizationScopedModel, TimestampedModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(
        "catalog.Product",
        on_delete=models.PROTECT,
        related_name="order_items",
    )
    variant = models.ForeignKey(
        "catalog.ProductVariant",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="order_items",
    )
    measurement_unit = models.ForeignKey(
        "catalog.MeasurementUnit",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="order_items",
    )
    name_snapshot = models.CharField(max_length=220)
    quantity = models.DecimalField(max_digits=10, decimal_places=3)
    unit_price_cents = models.PositiveIntegerField()
    total_cents = models.PositiveIntegerField()
    weight_grams = models.PositiveIntegerField(null=True, blank=True)
    source_type = models.CharField(max_length=80, blank=True)
    source_key = models.CharField(max_length=120, blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["id"]
        indexes = [
            models.Index(fields=["organization", "order"]),
            models.Index(fields=["organization", "product"]),
            models.Index(fields=["organization", "variant"]),
        ]

    def __str__(self) -> str:
        return f"{self.order.code}:{self.name_snapshot}"


class OrderStatusHistory(OrganizationScopedModel, TimestampedModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="status_history")
    from_status_key = models.SlugField(max_length=80, blank=True)
    to_status_key = models.SlugField(max_length=80)
    note = models.TextField(blank=True)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="order_status_changes",
    )

    class Meta:
        ordering = ["created_at", "id"]
        indexes = [
            models.Index(fields=["organization", "order", "created_at"]),
            models.Index(fields=["organization", "to_status_key"]),
        ]

    def __str__(self) -> str:
        return f"{self.order.code}:{self.to_status_key}"
