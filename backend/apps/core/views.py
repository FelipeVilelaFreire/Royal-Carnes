from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.accounts.permissions import require_organization_permission
from apps.core.tenant import get_request_organization
from apps.deliveries.selectors import deliveries_for_organization, delivery_statuses_for_organization
from apps.deliveries.serializers import DeliverySerializer, DeliveryStatusSerializer
from apps.orders.selectors import (
    order_kinds_for_organization,
    order_statuses_for_organization,
    orders_for_organization,
)
from apps.orders.serializers import OrderKindSerializer, OrderSerializer, OrderStatusSerializer
from apps.subscriptions.selectors import subscriptions_for_organization
from apps.subscriptions.serializers import SubscriptionSerializer


@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(_request):
    return Response({"status": "ok", "service": "royalprime-api"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_dashboard_summary(request):
    organization = get_request_organization(request)
    require_organization_permission(request.user, organization, "orders.read")
    require_organization_permission(request.user, organization, "deliveries.read")
    require_organization_permission(request.user, organization, "subscriptions.read")

    return Response(
        {
            "order_config": {
                "kinds": OrderKindSerializer(
                    order_kinds_for_organization(organization),
                    many=True,
                ).data,
                "statuses": OrderStatusSerializer(
                    order_statuses_for_organization(organization),
                    many=True,
                ).data,
            },
            "orders": OrderSerializer(
                orders_for_organization(organization),
                many=True,
            ).data,
            "delivery_config": {
                "statuses": DeliveryStatusSerializer(
                    delivery_statuses_for_organization(organization),
                    many=True,
                ).data,
            },
            "deliveries": DeliverySerializer(
                deliveries_for_organization(organization),
                many=True,
            ).data,
            "subscriptions": SubscriptionSerializer(
                subscriptions_for_organization(organization),
                many=True,
            ).data,
        }
    )
