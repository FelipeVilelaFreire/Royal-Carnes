import uuid
from django.db import models
from apps.core.models import Organization

class Plan(models.Model):
    FREQUENCY_CHOICES = (
        ("monthly", "Mensal"),
        ("annual", "Anual"),
    )
    FULFILLMENT_CHOICES = (
        ("physical_delivery", "Physical Delivery"),
        ("digital_access", "Digital Access"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="plans")
    key = models.CharField(max_length=100)
    name = models.CharField(max_length=255)
    billing_frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default="monthly")
    price_cents = models.PositiveIntegerField(default=0)
    fulfillment_type = models.CharField(max_length=30, choices=FULFILLMENT_CHOICES, default="physical_delivery")
    metadata = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.key}) - R$ {self.price_cents / 100:.2f}"
