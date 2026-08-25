from django.contrib import admin
from apps.billing.models import PaymentMethod, Invoice, Transaction

@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "provider", "card_last4", "card_brand", "is_default")

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "subscription", "amount_cents", "status", "due_date", "paid_at")

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("id", "invoice", "provider_transaction_id", "amount_cents", "status", "error_code")
