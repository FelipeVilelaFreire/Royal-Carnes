from .models import Customer


def customers_for_organization(organization):
    return Customer.objects.filter(organization=organization).select_related("user")


def customer_detail(customer_id, organization):
    return (
        Customer.objects.select_related("user", "profile")
        .prefetch_related("addresses", "payment_method_refs")
        .get(id=customer_id, organization=organization)
    )
