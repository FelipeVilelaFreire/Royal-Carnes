from django.shortcuts import get_object_or_404

from .models import Delivery, DeliveryPromisePolicy, DeliveryStatusDefinition


def delivery_statuses_for_organization(organization):
    return DeliveryStatusDefinition.objects.filter(organization=organization)


def delivery_promise_policies_for_organization(organization):
    return DeliveryPromisePolicy.objects.filter(organization=organization)


def delivery_promise_policy_detail(policy_id, organization):
    return get_object_or_404(delivery_promise_policies_for_organization(organization), id=policy_id)


def deliveries_for_customer(organization, customer):
    return (
        Delivery.objects.filter(organization=organization, customer=customer)
        .select_related("order", "customer", "address")
        .prefetch_related("packages", "status_history")
    )


def deliveries_for_organization(organization):
    return (
        Delivery.objects.filter(organization=organization)
        .select_related("order", "customer", "address")
        .prefetch_related("packages", "status_history")
    )


def delivery_detail(delivery_id, organization):
    return get_object_or_404(
        deliveries_for_organization(organization),
        id=delivery_id,
    )
