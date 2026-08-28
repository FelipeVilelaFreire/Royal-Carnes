from django.shortcuts import get_object_or_404

from .models import Order, OrderKindDefinition, OrderStatusDefinition


def order_statuses_for_organization(organization):
    return OrderStatusDefinition.objects.filter(organization=organization)


def order_kinds_for_organization(organization):
    return OrderKindDefinition.objects.filter(organization=organization, is_active=True)


def orders_for_customer(organization, customer):
    return (
        Order.objects.filter(organization=organization, customer=customer)
        .select_related("customer", "address")
        .prefetch_related("items", "status_history")
    )


def orders_for_organization(organization):
    return (
        Order.objects.filter(organization=organization)
        .select_related("customer", "address")
        .prefetch_related("items", "status_history")
    )


def order_detail(order_id, organization):
    return get_object_or_404(
        orders_for_organization(organization),
        id=order_id,
    )
