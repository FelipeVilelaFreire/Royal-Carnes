from django.db import models

from apps.core.models import OrganizationScopedModel, TimestampedModel


class Payment(OrganizationScopedModel, TimestampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        FAILED = "failed", "Failed"
        CANCELLED = "cancelled", "Cancelled"
        REFUNDED = "refunded", "Refunded"

    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.PROTECT,
        related_name="payments",
    )
    subscription = models.ForeignKey(
        "subscriptions.Subscription",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="payments",
    )
    order = models.ForeignKey(
        "orders.Order",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="payments",
    )
    reference = models.CharField(max_length=120)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    currency = models.CharField(max_length=3, default="BRL")
    amount_cents = models.PositiveIntegerField()
    due_at = models.DateTimeField(null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-due_at", "-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "reference"],
                name="payments_payment_unique_reference",
            )
        ]
        indexes = [
            models.Index(fields=["organization", "customer", "status"]),
            models.Index(fields=["organization", "subscription", "status"]),
            models.Index(fields=["organization", "status", "due_at"]),
        ]

    def __str__(self) -> str:
        return self.reference

