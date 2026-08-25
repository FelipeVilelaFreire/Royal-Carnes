from datetime import datetime
from django.utils import timezone
from apps.core.models import Organization, Customer
from apps.subscriptions.models import Subscription
from apps.billing.models import Invoice, Transaction, PaymentMethod

def create_invoice(
    organization: Organization,
    subscription: Subscription,
    customer: Customer,
    amount_cents: int,
    due_date: datetime | None = None
) -> Invoice:
    due = due_date or (timezone.now() + timezone.timedelta(days=3))
    return Invoice.objects.create(
        organization=organization,
        subscription=subscription,
        customer=customer,
        amount_cents=amount_cents,
        status="open",
        due_date=due
    )

def record_transaction(
    invoice: Invoice,
    amount_cents: int,
    status: str,
    provider_transaction_id: str = "",
    error_code: str = ""
) -> Transaction:
    transaction = Transaction.objects.create(
        invoice=invoice,
        provider_transaction_id=provider_transaction_id,
        amount_cents=amount_cents,
        status=status,
        error_code=error_code
    )
    if status == "succeeded":
        invoice.status = "paid"
        invoice.paid_at = timezone.now()
        invoice.save()
    return transaction
