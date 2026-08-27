from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.accounts.permissions import require_organization_permission
from apps.core.tenant import get_request_organization

from .selectors import (
    active_collections_for_organization,
    active_commercial_modes_for_organization,
    admin_products_for_organization,
    product_detail,
    public_products_for_organization,
)
from .serializers import (
    CollectionSerializer,
    CommercialModeSerializer,
    ProductCreateSerializer,
    ProductSerializer,
)
from .services import create_admin_product


@api_view(["GET"])
@permission_classes([AllowAny])
def collections(request):
    organization = get_request_organization(request)
    queryset = active_collections_for_organization(organization)
    return Response(CollectionSerializer(queryset, many=True).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def commercial_modes(request):
    organization = get_request_organization(request)
    queryset = active_commercial_modes_for_organization(organization)
    return Response(CommercialModeSerializer(queryset, many=True).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def products(request):
    organization = get_request_organization(request)
    queryset = public_products_for_organization(organization)
    return Response(ProductSerializer(queryset, many=True).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def product(request, product_id):
    organization = get_request_organization(request)
    return Response(ProductSerializer(product_detail(product_id, organization)).data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def admin_products(request):
    organization = get_request_organization(request)
    require_organization_permission(request.user, organization, "products.manage")
    if request.method == "GET":
        queryset = admin_products_for_organization(organization)
        return Response(ProductSerializer(queryset, many=True).data)

    serializer = ProductCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    product_obj = create_admin_product(
        organization=organization,
        **serializer.validated_data,
    )
    return Response(ProductSerializer(product_obj).data, status=status.HTTP_201_CREATED)
