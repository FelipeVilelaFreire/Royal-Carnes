from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.permissions import require_organization_permission
from apps.core.tenant import get_request_organization
from apps.customers.models import Address, Customer
from apps.subscriptions.models import Subscription, SubscriptionCycle

from .models import OrderKindDefinition
from .selectors import (
    order_detail,
    order_kinds_for_organization,
    order_statuses_for_organization,
    orders_for_customer,
    orders_for_organization,
)
from .serializers import (
    AdminOrderCreateSerializer,
    OrderCreateSerializer,
    OrderKindSerializer,
    OrderSerializer,
    OrderStatusSerializer,
    OrderStatusTransitionSerializer,
)
from .services import OrderValidationError, create_order, transition_order_status


def _resolve_order_refs(organization, customer, data):
    address = None
    if data.get("address_id"):
        address = Address.objects.get(
            organization=organization,
            customer=customer,
            id=data["address_id"],
        )
    subscription = None
    if data.get("subscription_id"):
        subscription = Subscription.objects.get(
            organization=organization,
            customer=customer,
            id=data["subscription_id"],
        )
    subscription_cycle = None
    if data.get("subscription_cycle_id"):
        subscription_cycle = SubscriptionCycle.objects.get(
            organization=organization,
            subscription=subscription,
            id=data["subscription_cycle_id"],
        )
    return address, subscription, subscription_cycle


@api_view(["GET"])
def order_config(request):
    organization = get_request_organization(request)
    return Response(
        {
            "kinds": OrderKindSerializer(order_kinds_for_organization(organization), many=True).data,
            "statuses": OrderStatusSerializer(order_statuses_for_organization(organization), many=True).data,
        }
    )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def my_orders(request):
    organization = get_request_organization(request)
    customer = Customer.objects.filter(organization=organization, user=request.user).first()
    if customer is None:
        if request.method == "GET":
            return Response([])
        return Response({"code": "customer_not_found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response(OrderSerializer(orders_for_customer(organization, customer), many=True).data)

    serializer = OrderCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    try:
        address, subscription, subscription_cycle = _resolve_order_refs(organization, customer, data)
        order = create_order(
            organization=organization,
            customer=customer,
            address=address,
            subscription=subscription,
            subscription_cycle=subscription_cycle,
            kind_key=data["kind_key"],
            items=data["items"],
            notes=data["notes"],
            actor=request.user,
        )
    except ObjectDoesNotExist:
        return Response({"code": "order_reference_not_found"}, status=status.HTTP_400_BAD_REQUEST)
    except OrderValidationError as error:
        return Response({"code": error.code, "detail": error.detail}, status=status.HTTP_400_BAD_REQUEST)
    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_order_detail(request, order_id):
    organization = get_request_organization(request)
    customer = Customer.objects.filter(organization=organization, user=request.user).first()
    if customer is None:
        return Response({"code": "customer_not_found"}, status=status.HTTP_404_NOT_FOUND)
    order = order_detail(order_id, organization)
    if order.customer_id != customer.id:
        return Response({"code": "order_not_found"}, status=status.HTTP_404_NOT_FOUND)
    return Response(OrderSerializer(order).data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def admin_orders(request):
    organization = get_request_organization(request)
    if request.method == "GET":
        require_organization_permission(request.user, organization, "orders.read")
        return Response(OrderSerializer(orders_for_organization(organization), many=True).data)

    require_organization_permission(request.user, organization, "orders.manage")
    serializer = AdminOrderCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    try:
        customer = Customer.objects.get(organization=organization, id=data["customer_id"])
        address, subscription, subscription_cycle = _resolve_order_refs(organization, customer, data)
        order = create_order(
            organization=organization,
            customer=customer,
            address=address,
            subscription=subscription,
            subscription_cycle=subscription_cycle,
            kind_key=data["kind_key"],
            items=data["items"],
            notes=data["notes"],
            actor=request.user,
        )
    except ObjectDoesNotExist:
        return Response({"code": "order_reference_not_found"}, status=status.HTTP_400_BAD_REQUEST)
    except OrderValidationError as error:
        return Response({"code": error.code, "detail": error.detail}, status=status.HTTP_400_BAD_REQUEST)
    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_order_detail(request, order_id):
    organization = get_request_organization(request)
    require_organization_permission(request.user, organization, "orders.read")
    return Response(OrderSerializer(order_detail(order_id, organization)).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_order_transition(request, order_id):
    organization = get_request_organization(request)
    require_organization_permission(request.user, organization, "orders.manage")
    serializer = OrderStatusTransitionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    order = order_detail(order_id, organization)
    try:
        order = transition_order_status(
            organization=organization,
            order=order,
            to_status_key=serializer.validated_data["status_key"],
            note=serializer.validated_data["note"],
            actor=request.user,
        )
    except ObjectDoesNotExist:
        return Response({"code": "order_status_not_found"}, status=status.HTTP_400_BAD_REQUEST)
    except OrderValidationError as error:
        return Response({"code": error.code, "detail": error.detail}, status=status.HTTP_400_BAD_REQUEST)
    return Response(OrderSerializer(order_detail(order.id, organization)).data)
