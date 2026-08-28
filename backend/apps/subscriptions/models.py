from django.db import models
from django.db.models import Q

from apps.core.models import OrganizationScopedModel, SoftDeleteModel, TimestampedModel


class Plan(OrganizationScopedModel, TimestampedModel, SoftDeleteModel):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        DRAFT = "draft", "Draft"
        ARCHIVED = "archived", "Archived"

    class BillingInterval(models.TextChoices):
        DAY = "day", "Day"
        WEEK = "week", "Week"
        MONTH = "month", "Month"
        YEAR = "year", "Year"

    key = models.SlugField(max_length=100)
    name = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    billing_interval = models.CharField(
        max_length=20,
        choices=BillingInterval.choices,
        default=BillingInterval.MONTH,
    )
    trial_days = models.PositiveIntegerField(default=0)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "name"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "key"],
                name="subscriptions_plan_unique_key",
            )
        ]
        indexes = [
            models.Index(fields=["organization", "status"]),
            models.Index(fields=["organization", "sort_order"]),
        ]

    def __str__(self) -> str:
        return self.name


class PlanPrice(OrganizationScopedModel, TimestampedModel):
    class PriceType(models.TextChoices):
        RECURRING = "recurring", "Recurring"
        TRIAL = "trial", "Trial"
        MANUAL = "manual", "Manual"

    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name="prices")
    currency = models.CharField(max_length=3, default="BRL")
    amount_cents = models.PositiveIntegerField()
    billing_interval = models.CharField(
        max_length=20,
        choices=Plan.BillingInterval.choices,
        default=Plan.BillingInterval.MONTH,
    )
    billing_interval_count = models.PositiveIntegerField(default=1)
    price_type = models.CharField(
        max_length=24,
        choices=PriceType.choices,
        default=PriceType.RECURRING,
    )
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["amount_cents"]
        indexes = [
            models.Index(fields=["organization", "plan"]),
            models.Index(fields=["organization", "currency"]),
        ]


class PlanEntitlement(OrganizationScopedModel, TimestampedModel):
    class TargetType(models.TextChoices):
        COLLECTION = "collection", "Collection"
        CATEGORY = "category", "Category"
        PRODUCT = "product", "Product"
        VARIANT = "variant", "Variant"

    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name="entitlements")
    key = models.SlugField(max_length=120)
    target_type = models.CharField(max_length=24, choices=TargetType.choices)
    collection = models.ForeignKey(
        "catalog.Collection",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="plan_entitlements",
    )
    category = models.ForeignKey(
        "catalog.Category",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="plan_entitlements",
    )
    product = models.ForeignKey(
        "catalog.Product",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="plan_entitlements",
    )
    variant = models.ForeignKey(
        "catalog.ProductVariant",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="plan_entitlements",
    )
    quantity = models.DecimalField(max_digits=10, decimal_places=3)
    measurement_unit = models.ForeignKey(
        "catalog.MeasurementUnit",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="plan_entitlements",
    )
    constraints = models.JSONField(default=dict, blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "key"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "plan", "key"],
                name="subscriptions_entitlement_unique_key",
            ),
            models.CheckConstraint(
                name="subscriptions_entitlement_target_matches_type",
                check=(
                    Q(
                        target_type="collection",
                        collection__isnull=False,
                        category__isnull=True,
                        product__isnull=True,
                        variant__isnull=True,
                    )
                    | Q(
                        target_type="category",
                        collection__isnull=True,
                        category__isnull=False,
                        product__isnull=True,
                        variant__isnull=True,
                    )
                    | Q(
                        target_type="product",
                        collection__isnull=True,
                        category__isnull=True,
                        product__isnull=False,
                        variant__isnull=True,
                    )
                    | Q(
                        target_type="variant",
                        collection__isnull=True,
                        category__isnull=True,
                        product__isnull=True,
                        variant__isnull=False,
                    )
                ),
            ),
        ]
        indexes = [
            models.Index(fields=["organization", "plan", "target_type"]),
            models.Index(fields=["organization", "target_type"]),
        ]

    def __str__(self) -> str:
        return f"{self.plan.key}:{self.key}"


class Subscription(OrganizationScopedModel, TimestampedModel, SoftDeleteModel):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        PAUSED = "paused", "Paused"
        CANCELLED = "cancelled", "Cancelled"
        PAST_DUE = "past_due", "Past due"

    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.PROTECT,
        related_name="subscriptions",
    )
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT, related_name="subscriptions")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    started_at = models.DateTimeField()
    ended_at = models.DateTimeField(null=True, blank=True)
    current_cycle_starts_at = models.DateTimeField(null=True, blank=True)
    current_cycle_ends_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancel_reason = models.TextField(blank=True)

    class Meta:
        ordering = ["-started_at"]
        indexes = [
            models.Index(fields=["organization", "customer", "status"]),
            models.Index(fields=["organization", "plan", "status"]),
        ]

    def __str__(self) -> str:
        return f"{self.customer_id}:{self.plan.key}:{self.status}"


class SubscriptionCycle(OrganizationScopedModel, TimestampedModel):
    class Status(models.TextChoices):
        OPEN = "open", "Open"
        LOCKED = "locked", "Locked"
        FULFILLED = "fulfilled", "Fulfilled"
        SKIPPED = "skipped", "Skipped"
        CANCELLED = "cancelled", "Cancelled"

    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.CASCADE,
        related_name="cycles",
    )
    cycle_number = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    closed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-starts_at", "-cycle_number"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "subscription", "cycle_number"],
                name="subscriptions_cycle_unique_number",
            )
        ]
        indexes = [
            models.Index(fields=["organization", "subscription", "status"]),
            models.Index(fields=["organization", "starts_at", "ends_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.subscription_id}:cycle-{self.cycle_number}"


class SubscriptionCycleItem(OrganizationScopedModel, TimestampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SELECTED = "selected", "Selected"
        RESERVED = "reserved", "Reserved"
        FULFILLED = "fulfilled", "Fulfilled"
        CANCELLED = "cancelled", "Cancelled"

    cycle = models.ForeignKey(
        SubscriptionCycle,
        on_delete=models.CASCADE,
        related_name="items",
    )
    entitlement = models.ForeignKey(
        PlanEntitlement,
        on_delete=models.PROTECT,
        related_name="cycle_items",
    )
    product = models.ForeignKey(
        "catalog.Product",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="subscription_cycle_items",
    )
    variant = models.ForeignKey(
        "catalog.ProductVariant",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="subscription_cycle_items",
    )
    quantity = models.DecimalField(max_digits=10, decimal_places=3)
    measurement_unit = models.ForeignKey(
        "catalog.MeasurementUnit",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="subscription_cycle_items",
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)

    class Meta:
        ordering = ["id"]
        indexes = [
            models.Index(fields=["organization", "cycle", "status"]),
            models.Index(fields=["organization", "entitlement"]),
        ]

    def __str__(self) -> str:
        return f"{self.cycle_id}:{self.entitlement.key}:{self.status}"
