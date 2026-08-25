import uuid
from django.db import models
from apps.core.models import Organization, Customer
from apps.subscriptions.models import Subscription

class PaymentMethod(models.Model):
    PROVIDER_CHOICES = (
        ("stripe", "Stripe"),
        ("asaas", "Asaas"),
        ("mercadopago", "Mercado Pago"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="payment_methods")
    provider = models.CharField(max_length=30, choices=PROVIDER_CHOICES, default="asaas")
    token_id = models.CharField(max_length=255)
    card_last4 = models.CharField(max_length=4, blank=True, default="")
    card_brand = models.CharField(max_length=30, blank=True, default="")
    is_default = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.provider} - **** {self.card_last4} ({self.customer})"

class Invoice(models.Model):
    STATUS_CHOICES = (
        ("draft", "Rascunho"),
        ("open", "Aberta"),
        ("paid", "Paga"),
        ("uncollectible", "Infrutífera"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="invoices")
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name="invoices")
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="invoices")
    amount_cents = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open")
    due_date = models.DateTimeField()
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Invoice {self.id} - R$ {self.amount_cents / 100:.2f} ({self.status})"

class Transaction(models.Model):
    STATUS_CHOICES = (
        ("succeeded", "Sucesso"),
        ("failed", "Falhou"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="transactions")
    provider_transaction_id = models.CharField(max_length=255, blank=True, default="")
    amount_cents = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    error_code = models.CharField(max_length=100, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transaction {self.id} - {self.status} (R$ {self.amount_cents / 100:.2f})"
