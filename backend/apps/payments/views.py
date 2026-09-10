from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.permissions import require_organization_permission
from apps.core.tenant import get_request_organization
from apps.customers.models import Customer
from apps.orders.models import Order
from apps.subscriptions.models import Subscription

from .models import Payment
from .selectors import payment_detail, payments_for_organization
from .serializers import PaymentCreateSerializer, PaymentSerializer, PaymentUpdateSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_payments(request):
    organization = get_request_organization(request)
    customer = Customer.objects.filter(organization=organization, user=request.user).first()
    if customer is None:
        return Response([], status=status.HTTP_200_OK)
    queryset = Payment.objects.filter(organization=organization, customer=customer).select_related("subscription__plan", "order")
    return Response(PaymentSerializer(queryset, many=True).data)


def _require_payments_access(request, organization):
    require_organization_permission(request.user, organization, "payments.markPaid")


def _resolve_payment_refs(organization, data):
    customer = Customer.objects.get(organization=organization, id=data["customer_id"])
    subscription = None
    if data.get("subscription_id"):
        subscription = Subscription.objects.get(
            organization=organization,
            customer=customer,
            id=data["subscription_id"],
        )
    order = None
    if data.get("order_id"):
        order = Order.objects.get(
            organization=organization,
            customer=customer,
            id=data["order_id"],
        )
    if subscription and order and order.subscription_id and order.subscription_id != subscription.id:
        raise ValueError("payment_subscription_order_mismatch")
    return customer, subscription, order


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def admin_payments(request):
    organization = get_request_organization(request)
    _require_payments_access(request, organization)

    if request.method == "GET":
        queryset = payments_for_organization(organization)
        return Response(PaymentSerializer(queryset, many=True).data)

    serializer = PaymentCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    try:
        customer, subscription, order = _resolve_payment_refs(organization, data)
    except ObjectDoesNotExist:
        return Response({"code": "payment_reference_not_found"}, status=status.HTTP_400_BAD_REQUEST)
    except ValueError as error:
        return Response({"code": str(error)}, status=status.HTTP_400_BAD_REQUEST)

    payment = Payment.objects.create(
        organization=organization,
        customer=customer,
        subscription=subscription,
        order=order,
        reference=data["reference"],
        status=data["status"],
        currency=data["currency"],
        amount_cents=data["amount_cents"],
        due_at=data.get("due_at"),
        paid_at=data.get("paid_at"),
        notes=data["notes"],
        metadata=data["metadata"],
    )
    if payment.status == Payment.Status.PAID and payment.paid_at is None:
        payment.paid_at = timezone.now()
        payment.save(update_fields=["paid_at", "updated_at"])
    return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_payment_detail(request, payment_id):
    organization = get_request_organization(request)
    _require_payments_access(request, organization)
    payment = payment_detail(payment_id, organization)

    if request.method == "GET":
        return Response(PaymentSerializer(payment).data)

    serializer = PaymentUpdateSerializer(data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    for field in ("reference", "status", "amount_cents", "currency", "due_at", "paid_at", "notes", "metadata"):
        if field in data:
            setattr(payment, field, data[field])
    if data.get("status") == Payment.Status.PAID and payment.paid_at is None:
        payment.paid_at = timezone.now()
    payment.save()
    return Response(PaymentSerializer(payment_detail(payment.id, organization)).data)
