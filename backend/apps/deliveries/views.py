from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.permissions import require_organization_permission
from apps.core.tenant import get_request_organization
from apps.customers.models import Customer
from apps.orders.models import Order

from .selectors import (
    deliveries_for_customer,
    deliveries_for_organization,
    delivery_detail,
    delivery_statuses_for_organization,
)
from .serializers import (
    DeliveryConfirmSerializer,
    DeliveryCreateSerializer,
    DeliverySerializer,
    DeliveryStatusSerializer,
    DeliveryStatusTransitionSerializer,
)
from .services import DeliveryValidationError, confirm_delivery, create_delivery_for_order, transition_delivery_status


@api_view(["GET"])
def delivery_config(request):
    organization = get_request_organization(request)
    return Response({"statuses": DeliveryStatusSerializer(delivery_statuses_for_organization(organization), many=True).data})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_deliveries(request):
    organization = get_request_organization(request)
    customer = Customer.objects.filter(organization=organization, user=request.user).first()
    if customer is None:
        return Response([])
    return Response(DeliverySerializer(deliveries_for_customer(organization, customer), many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_delivery_detail(request, delivery_id):
    organization = get_request_organization(request)
    customer = Customer.objects.filter(organization=organization, user=request.user).first()
    if customer is None:
        return Response({"code": "customer_not_found"}, status=status.HTTP_404_NOT_FOUND)
    delivery = delivery_detail(delivery_id, organization)
    if delivery.customer_id != customer.id:
        return Response({"code": "delivery_not_found"}, status=status.HTTP_404_NOT_FOUND)
    return Response(DeliverySerializer(delivery).data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def admin_deliveries(request):
    organization = get_request_organization(request)
    if request.method == "GET":
        require_organization_permission(request.user, organization, "deliveries.read")
        return Response(DeliverySerializer(deliveries_for_organization(organization), many=True).data)

    require_organization_permission(request.user, organization, "deliveries.manage")
    serializer = DeliveryCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    try:
        order = Order.objects.get(organization=organization, id=data["order_id"])
        delivery = create_delivery_for_order(
            organization=organization,
            order=order,
            code_sequence_key=data["code_sequence_key"],
            confirmation_code=data["confirmation_code"],
            notes=data["notes"],
            actor=request.user,
        )
    except ObjectDoesNotExist:
        return Response({"code": "delivery_reference_not_found"}, status=status.HTTP_400_BAD_REQUEST)
    except DeliveryValidationError as error:
        return Response({"code": error.code, "detail": error.detail}, status=status.HTTP_400_BAD_REQUEST)
    return Response(DeliverySerializer(delivery).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_delivery_detail(request, delivery_id):
    organization = get_request_organization(request)
    require_organization_permission(request.user, organization, "deliveries.read")
    return Response(DeliverySerializer(delivery_detail(delivery_id, organization)).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_delivery_transition(request, delivery_id):
    organization = get_request_organization(request)
    require_organization_permission(request.user, organization, "deliveries.manage")
    serializer = DeliveryStatusTransitionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    delivery = delivery_detail(delivery_id, organization)
    try:
        delivery = transition_delivery_status(
            organization=organization,
            delivery=delivery,
            to_status_key=serializer.validated_data["status_key"],
            note=serializer.validated_data["note"],
            actor=request.user,
        )
    except ObjectDoesNotExist:
        return Response({"code": "delivery_status_not_found"}, status=status.HTTP_400_BAD_REQUEST)
    except DeliveryValidationError as error:
        return Response({"code": error.code, "detail": error.detail}, status=status.HTTP_400_BAD_REQUEST)
    return Response(DeliverySerializer(delivery_detail(delivery.id, organization)).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_delivery_confirm(request, delivery_id):
    organization = get_request_organization(request)
    require_organization_permission(request.user, organization, "deliveries.manage")
    serializer = DeliveryConfirmSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    delivery = delivery_detail(delivery_id, organization)
    try:
        confirm_delivery(
            organization=organization,
            delivery=delivery,
            actor=request.user,
            **serializer.validated_data,
        )
    except DeliveryValidationError as error:
        return Response({"code": error.code, "detail": error.detail}, status=status.HTTP_400_BAD_REQUEST)
    return Response(DeliverySerializer(delivery_detail(delivery.id, organization)).data)
