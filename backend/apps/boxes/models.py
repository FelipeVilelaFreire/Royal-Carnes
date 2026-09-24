from django.db import models

from apps.core.models import OrganizationScopedModel, TimestampedModel


class BoxTemplate(OrganizationScopedModel, TimestampedModel):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        ARCHIVED = "archived", "Archived"

    key = models.SlugField(max_length=100)
    name = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["organization", "key"], name="boxes_template_unique_key")]


class BoxTemplateItem(OrganizationScopedModel, TimestampedModel):
    template = models.ForeignKey(BoxTemplate, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey("catalog.Product", on_delete=models.PROTECT, related_name="box_template_items")
    variant = models.ForeignKey("catalog.ProductVariant", null=True, blank=True, on_delete=models.PROTECT, related_name="box_template_items")
    quantity = models.DecimalField(max_digits=10, decimal_places=3)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]


class BoxSubscription(OrganizationScopedModel, TimestampedModel):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        PAUSED = "paused", "Paused"
        CANCELLED = "cancelled", "Cancelled"

    class OrderCreationPolicy(models.TextChoices):
        IMMEDIATE = "immediate", "Immediate"
        PAYMENT_CONFIRMED = "payment_confirmed", "Payment confirmed"

    customer = models.ForeignKey("customers.Customer", on_delete=models.PROTECT, related_name="box_subscriptions")
    template = models.ForeignKey(BoxTemplate, on_delete=models.PROTECT, related_name="subscriptions")
    default_delivery_address = models.ForeignKey("customers.Address", on_delete=models.PROTECT, related_name="box_subscriptions")
    schedule = models.OneToOneField("scheduling.Schedule", on_delete=models.PROTECT, related_name="box_subscription")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    order_creation_policy = models.CharField(max_length=24, choices=OrderCreationPolicy.choices, default=OrderCreationPolicy.PAYMENT_CONFIRMED)

    class Meta:
        indexes = [models.Index(fields=["organization", "customer", "status"])]


class BoxCycle(OrganizationScopedModel, TimestampedModel):
    class Status(models.TextChoices):
        PREPARED = "prepared", "Prepared"
        AWAITING_PAYMENT = "awaiting_payment", "Awaiting payment"
        ORDER_CREATED = "order_created", "Order created"
        FAILED = "failed", "Failed"
        SKIPPED = "skipped", "Skipped"
        CANCELLED = "cancelled", "Cancelled"

    subscription = models.ForeignKey(BoxSubscription, on_delete=models.CASCADE, related_name="cycles")
    schedule_occurrence = models.OneToOneField("scheduling.ScheduleOccurrence", on_delete=models.PROTECT, related_name="box_cycle")
    cycle_key = models.CharField(max_length=120)
    scheduled_for = models.DateTimeField()
    status = models.CharField(max_length=24, choices=Status.choices, default=Status.PREPARED)
    currency = models.CharField(max_length=3)
    total_cents = models.PositiveIntegerField(default=0)
    items_snapshot = models.JSONField(default=list)
    address_snapshot = models.JSONField(default=dict)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["organization", "subscription", "cycle_key"], name="boxes_cycle_unique_key")]
        indexes = [models.Index(fields=["organization", "status", "scheduled_for"])]
