from apps.billing.models import Invoice, PaymentMethod, Transaction

def list_invoices_by_organization(organization_id: str):
    return Invoice.objects.filter(organization_id=organization_id).order_by("-created_at")

def list_invoices_by_customer(customer_id: str):
    return Invoice.objects.filter(customer_id=customer_id).order_by("-created_at")

def list_payment_methods_by_customer(customer_id: str):
    return PaymentMethod.objects.filter(customer_id=customer_id).order_by("-created_at")
