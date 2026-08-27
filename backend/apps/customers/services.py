from django.db import transaction

from .models import Customer


@transaction.atomic
def create_customer(*, organization, name: str, email: str = "", phone: str = "", user=None):
    return Customer.objects.create(
        organization=organization,
        user=user,
        name=name,
        email=email,
        phone=phone,
    )


@transaction.atomic
def upsert_customer(
    *,
    organization,
    key: str = "",
    name: str,
    email: str = "",
    phone: str = "",
    user=None,
) -> Customer:
    lookup = {"organization": organization, "email": email} if email else None
    if lookup:
        customer, _created = Customer.objects.update_or_create(
            **lookup,
            defaults={
                "user": user,
                "name": name,
                "phone": phone,
            },
        )
        return customer
    return Customer.objects.create(
        organization=organization,
        user=user,
        name=name,
        phone=phone,
    )


@transaction.atomic
def create_customer_from_input(
    *,
    organization,
    name: str,
    email: str = "",
    phone: str = "",
    document: str = "",
    user=None,
) -> Customer:
    return Customer.objects.create(
        organization=organization,
        user=user,
        name=name,
        email=email,
        phone=phone,
        document=document,
    )
