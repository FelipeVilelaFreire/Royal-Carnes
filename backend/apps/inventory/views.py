from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.permissions import require_organization_permission
from apps.catalog.models import MeasurementUnit, Product, ProductVariant
from apps.core.tenant import get_request_organization

from .selectors import inventory_item_detail, inventory_items_for_organization, inventory_movements_for_item
from .serializers import (
    InventoryAdjustmentSerializer,
    InventoryItemSerializer,
    InventoryItemUpsertSerializer,
    InventoryMovementSerializer,
)
from .services import InventoryValidationError, adjust_inventory_item, upsert_inventory_item


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def admin_inventory_items(request):
    organization = get_request_organization(request)
    if request.method == "GET":
        require_organization_permission(request.user, organization, "inventory.read")
        queryset = inventory_items_for_organization(organization)
        return Response(InventoryItemSerializer(queryset, many=True).data)

    require_organization_permission(request.user, organization, "inventory.manage")
    serializer = InventoryItemUpsertSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    try:
        product = Product.objects.get(organization=organization, key=data["product_key"])
        variant = None
        if data.get("variant_sku"):
            variant = ProductVariant.objects.select_related("measurement_unit").get(
                organization=organization,
                sku=data["variant_sku"],
            )
        measurement_unit = None
        if data.get("measurement_unit_key"):
            measurement_unit = MeasurementUnit.objects.get(
                organization=organization,
                key=data["measurement_unit_key"],
            )
        item = upsert_inventory_item(
            organization=organization,
            product=product,
            variant=variant,
            measurement_unit=measurement_unit,
            available_quantity=data["available_quantity"],
            reserved_quantity=data["reserved_quantity"],
            low_stock_threshold=data["low_stock_threshold"],
            status=data["status"],
            notes=data["notes"],
        )
    except ObjectDoesNotExist:
        return Response({"code": "inventory_reference_not_found"}, status=status.HTTP_400_BAD_REQUEST)
    except InventoryValidationError as error:
        return Response({"code": error.code, "detail": error.detail}, status=status.HTTP_400_BAD_REQUEST)
    return Response(InventoryItemSerializer(item).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_inventory_item(request, item_id):
    organization = get_request_organization(request)
    require_organization_permission(request.user, organization, "inventory.read")
    item = inventory_item_detail(item_id, organization)
    return Response(InventoryItemSerializer(item).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_inventory_adjust(request, item_id):
    organization = get_request_organization(request)
    require_organization_permission(request.user, organization, "inventory.manage")
    serializer = InventoryAdjustmentSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    item = inventory_item_detail(item_id, organization)
    try:
        adjusted_item = adjust_inventory_item(
            organization=organization,
            item=item,
            actor=request.user,
            **serializer.validated_data,
        )
    except InventoryValidationError as error:
        return Response({"code": error.code, "detail": error.detail}, status=status.HTTP_400_BAD_REQUEST)
    return Response(InventoryItemSerializer(adjusted_item).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_inventory_movements(request, item_id):
    organization = get_request_organization(request)
    require_organization_permission(request.user, organization, "inventory.read")
    item = inventory_item_detail(item_id, organization)
    queryset = inventory_movements_for_item(organization, item)
    return Response(InventoryMovementSerializer(queryset, many=True).data)
