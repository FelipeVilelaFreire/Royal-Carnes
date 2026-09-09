from uuid import uuid4

from django.conf import settings
from django.core.files.storage import default_storage
from django.utils.text import get_valid_filename
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.accounts.permissions import require_organization_permission
from apps.core.tenant import get_request_organization

from .selectors import (
    active_categories_for_organization,
    admin_categories_for_organization,
    active_collections_for_organization,
    active_commercial_modes_for_organization,
    active_measurement_units_for_organization,
    admin_collections_for_organization,
    admin_products_for_organization,
    category_detail,
    product_detail,
    public_products_for_organization,
)
from .serializers import (
    CategorySerializer,
    CategoryCreateSerializer,
    CategoryUpdateSerializer,
    CollectionSerializer,
    CommercialModeSerializer,
    MeasurementUnitSerializer,
    ProductCreateSerializer,
    ProductSerializer,
    ProductUpdateSerializer,
)
from .services import CatalogValidationError, create_admin_product, create_category, update_admin_product, update_category


def build_media_url(request, saved_path):
    return request.build_absolute_uri(f"{settings.MEDIA_URL.rstrip('/')}/{saved_path}")


@api_view(["GET"])
@permission_classes([AllowAny])
def collections(request):
    organization = get_request_organization(request)
    queryset = active_collections_for_organization(organization)
    return Response(CollectionSerializer(queryset, many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_collections(request):
    organization = get_request_organization(request)
    require_organization_permission(request.user, organization, "products.manage")
    queryset = admin_collections_for_organization(organization)
    return Response(CollectionSerializer(queryset, many=True).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_media_upload(request):
    organization = get_request_organization(request)
    require_organization_permission(request.user, organization, "products.manage")
    uploaded_file = request.FILES.get("file")
    if not uploaded_file:
        return Response({"code": "media_file_required", "detail": "Media file is required"}, status=status.HTTP_400_BAD_REQUEST)
    if uploaded_file.content_type and not uploaded_file.content_type.startswith("image/"):
        return Response({"code": "media_file_type_invalid", "detail": "Only image files are accepted"}, status=status.HTTP_400_BAD_REQUEST)

    safe_name = get_valid_filename(uploaded_file.name)
    saved_path = default_storage.save(f"catalog/uploads/{uuid4()}-{safe_name}", uploaded_file)
    return Response({"url": build_media_url(request, saved_path)}, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([AllowAny])
def commercial_modes(request):
    organization = get_request_organization(request)
    queryset = active_commercial_modes_for_organization(organization)
    return Response(CommercialModeSerializer(queryset, many=True).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def categories(request):
    organization = get_request_organization(request)
    queryset = active_categories_for_organization(organization)
    return Response(CategorySerializer(queryset, many=True).data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def admin_categories(request):
    organization = get_request_organization(request)
    require_organization_permission(request.user, organization, "products.manage")
    if request.method == "POST":
        serializer = CategoryCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            category_obj = create_category(organization=organization, **serializer.validated_data)
        except CatalogValidationError as error:
            return Response({"code": error.code, "detail": error.detail}, status=status.HTTP_400_BAD_REQUEST)
        return Response(CategorySerializer(category_obj).data, status=status.HTTP_201_CREATED)

    queryset = admin_categories_for_organization(organization)
    return Response(CategorySerializer(queryset, many=True).data)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_category(request, category_id):
    organization = get_request_organization(request)
    require_organization_permission(request.user, organization, "products.manage")
    category_obj = category_detail(category_id, organization)

    if request.method == "GET":
        return Response(CategorySerializer(category_obj).data)

    serializer = CategoryUpdateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    category_obj = update_category(category=category_obj, **serializer.validated_data)
    return Response(CategorySerializer(category_obj).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def measurement_units(request):
    organization = get_request_organization(request)
    queryset = active_measurement_units_for_organization(organization)
    return Response(MeasurementUnitSerializer(queryset, many=True).data)


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
    try:
        product_obj = create_admin_product(
            organization=organization,
            **serializer.validated_data,
        )
    except CatalogValidationError as error:
        return Response({"code": error.code, "detail": error.detail}, status=status.HTTP_400_BAD_REQUEST)
    return Response(ProductSerializer(product_obj).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def admin_product(request, product_id):
    organization = get_request_organization(request)
    require_organization_permission(request.user, organization, "products.manage")
    product_obj = product_detail(product_id, organization)

    if request.method == "GET":
        return Response(ProductSerializer(product_obj).data)

    serializer = ProductUpdateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    try:
        product_obj = update_admin_product(
            organization=organization,
            product=product_obj,
            **serializer.validated_data,
        )
    except CatalogValidationError as error:
        return Response({"code": error.code, "detail": error.detail}, status=status.HTTP_400_BAD_REQUEST)
    return Response(ProductSerializer(product_detail(product_obj.id, organization)).data)
    category_detail,
