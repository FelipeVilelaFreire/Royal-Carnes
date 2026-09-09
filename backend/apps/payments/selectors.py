from django.shortcuts import get_object_or_404

from .models import Payment


def payments_for_organization(organization):
    return (
        Payment.objects.filter(organization=organization)
        .select_related("customer", "subscription", "subscription__plan", "order")
    )


def payment_detail(payment_id, organization):
    return get_object_or_404(payments_for_organization(organization), id=payment_id)

