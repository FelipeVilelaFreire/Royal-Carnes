from django.conf import settings
from django.db import models

from apps.core.models import (
    ActorTrackedModel,
    OrganizationScopedModel,
    SoftDeleteModel,
    TimestampedModel,
)


class Customer(
    OrganizationScopedModel,
    TimestampedModel,
    SoftDeleteModel,
    ActorTrackedModel,
):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        PAUSED = "paused", "Paused"
        BLOCKED = "blocked", "Blocked"
        ARCHIVED = "archived", "Archived"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="customer_profiles",
    )
    name = models.CharField(max_length=180)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=32, blank=True)
    document = models.CharField(max_length=40, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    member_since = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ["name"]
        indexes = [
            models.Index(fields=["organization", "status"]),
            models.Index(fields=["organization", "email"]),
            models.Index(fields=["organization", "phone"]),
        ]

    def __str__(self) -> str:
        return self.name


class CustomerProfile(TimestampedModel):
    customer = models.OneToOneField(
        Customer,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    birth_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    preferences = models.JSONField(default=dict, blank=True)
    notification_settings = models.JSONField(default=dict, blank=True)

    def __str__(self) -> str:
        return f"Profile: {self.customer.name}"


class Address(
    OrganizationScopedModel,
    TimestampedModel,
    SoftDeleteModel,
):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="addresses")
    label = models.CharField(max_length=80, blank=True)
    recipient_name = models.CharField(max_length=180, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    street = models.CharField(max_length=180)
    number = models.CharField(max_length=40, blank=True)
    complement = models.CharField(max_length=120, blank=True)
    district = models.CharField(max_length=120, blank=True)
    city = models.CharField(max_length=120)
    state = models.CharField(max_length=40)
    country = models.CharField(max_length=2, default="BR")
    is_default = models.BooleanField(default=False)
    delivery_instructions = models.TextField(blank=True)

    class Meta:
        ordering = ["-is_default", "city", "street"]
        indexes = [
            models.Index(fields=["organization", "customer"]),
            models.Index(fields=["organization", "city", "state"]),
            models.Index(fields=["customer", "is_default"]),
        ]

    def __str__(self) -> str:
        return f"{self.street}, {self.number} - {self.city}/{self.state}"


class CustomerNote(TimestampedModel):
    organization = models.ForeignKey(
        "organizations.Organization",
        on_delete=models.CASCADE,
        related_name="customer_notes",
    )
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="notes")
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="customer_notes",
    )
    body = models.TextField()
    is_internal = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["organization", "customer"]),
            models.Index(fields=["author"]),
        ]

    def __str__(self) -> str:
        return f"Note: {self.customer.name}"


class PaymentMethodRef(
    OrganizationScopedModel,
    TimestampedModel,
    SoftDeleteModel,
):
    class MethodType(models.TextChoices):
        PIX = "pix", "Pix"
        CARD = "card", "Card"
        CASH_ON_DELIVERY = "cashOnDelivery", "Cash on delivery"
        MANUAL = "manual", "Manual"

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="payment_method_refs",
    )
    method_type = models.CharField(max_length=32, choices=MethodType.choices)
    label = models.CharField(max_length=120, blank=True)
    provider = models.CharField(max_length=80, blank=True)
    provider_reference = models.CharField(max_length=180, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    is_default = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=["organization", "customer"]),
            models.Index(fields=["customer", "is_default"]),
        ]

    def __str__(self) -> str:
        return self.label or self.method_type
