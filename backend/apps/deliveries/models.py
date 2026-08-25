import uuid
from django.db import models
from apps.core.models import Organization, Customer
from apps.subscriptions.models import Subscription

class DispatchBatch(models.Model):
    STATUS_CHOICES = (
        ("draft", "Rascunho"),
        ("processing", "Em Preparação"),
        ("dispatched", "Enviado"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="dispatch_batches")
    batch_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"DispatchBatch {self.batch_date} ({self.status})"

class Shipment(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pendente"),
        ("packing", "Em Embalagem"),
        ("shipped", "Enviado"),
        ("delivered", "Entregue"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="shipments")
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name="shipments")
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="shipments")
    batch = models.ForeignKey(DispatchBatch, on_delete=models.SET_NULL, null=True, blank=True, related_name="shipments")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    scheduled_date = models.DateField()
    tracking_code = models.CharField(max_length=100, blank=True, default="")
    shipping_address = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Shipment {self.id} - {self.customer} ({self.status})"

class ShipmentItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name="items")
    product_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity}x {self.product_name}"
