import uuid
from django.db import models
from apps.core.models import Organization, Customer
from apps.plans.models import Plan

class Subscription(models.Model):
    STATUS_CHOICES = (
        ("active", "Ativa"),
        ("paused", "Pausada"),
        ("past_due", "Atrasada"),
        ("canceled", "Cancelada"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="subscriptions")
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="subscriptions")
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT, related_name="subscriptions")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    current_period_start = models.DateTimeField()
    current_period_end = models.DateTimeField()
    cancel_at_period_end = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Subscription {self.id} - {self.customer} ({self.status})"

class PauseLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name="pause_logs")
    paused_at = models.DateTimeField(auto_now_add=True)
    resumes_at = models.DateTimeField(null=True, blank=True)
    reason = models.TextField(blank=True, default="")

    def __str__(self):
        return f"PauseLog for {self.subscription_id} at {self.paused_at}"
