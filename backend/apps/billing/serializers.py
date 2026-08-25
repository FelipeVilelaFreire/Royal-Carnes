from rest_framework import serializers
from apps.billing.models import PaymentMethod, Invoice, Transaction

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ["id", "customer_id", "provider", "card_last4", "card_brand", "is_default", "created_at"]

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ["id", "invoice_id", "provider_transaction_id", "amount_cents", "status", "error_code", "created_at"]

class InvoiceSerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = [
            "id",
            "organization_id",
            "subscription_id",
            "customer_id",
            "amount_cents",
            "status",
            "due_date",
            "paid_at",
            "transactions",
            "created_at",
        ]
