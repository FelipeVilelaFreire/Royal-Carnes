from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.permissions import require_organization_permission
from apps.core.tenant import get_request_organization

from .models import Address, Customer, CustomerProfile
from .selectors import customer_detail, customers_for_organization
from .serializers import AddressSerializer, CurrentCustomerUpdateSerializer, CustomerAddressCreateSerializer, CustomerCreateSerializer, CustomerSerializer, CustomerUpdateSerializer
from .services import create_customer_from_input, update_customer_from_input


def _current_customer(request, organization):
    return Customer.objects.prefetch_related("addresses").filter(
        organization=organization,
        user=request.user,
    ).first()


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def current_customer(request):
    organization = get_request_organization(request)
    customer_obj = _current_customer(request, organization)
    if customer_obj is None:
        return Response({"code": "customer_not_found"}, status=status.HTTP_404_NOT_FOUND)
    CustomerProfile.objects.get_or_create(customer=customer_obj)
    if request.method == "GET":
        customer_obj = _current_customer(request, organization)
        return Response(CustomerSerializer(customer_obj).data)
    serializer = CurrentCustomerUpdateSerializer(data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    for field in ("name", "email", "phone", "document"):
        if field in data:
            setattr(customer_obj, field, data[field])
    customer_obj.save()
    if any(field in data for field in ("birth_date", "preferences", "notification_settings")):
        profile, _ = CustomerProfile.objects.get_or_create(customer=customer_obj)
        for field in ("birth_date", "preferences", "notification_settings"):
            if field in data:
                setattr(profile, field, data[field])
        profile.save()
    customer_obj = _current_customer(request, organization)
    return Response(CustomerSerializer(customer_obj).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def customer_addresses(request):
    organization = get_request_organization(request)
    customer_obj = _current_customer(request, organization)
    if customer_obj is None:
        return Response({"code": "customer_not_found"}, status=status.HTTP_404_NOT_FOUND)
    serializer = CustomerAddressCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    if data["is_default"]:
        Address.objects.filter(organization=organization, customer=customer_obj).update(is_default=False)
    address = Address.objects.create(organization=organization, customer=customer_obj, **data)
    return Response(AddressSerializer(address).data, status=status.HTTP_201_CREATED)


@api_view(["PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def customer_address(request, address_id):
    organization = get_request_organization(request)
    customer_obj = _current_customer(request, organization)
    if customer_obj is None:
        return Response({"code": "customer_not_found"}, status=status.HTTP_404_NOT_FOUND)
    address = Address.objects.filter(organization=organization, customer=customer_obj, id=address_id).first()
    if address is None:
        return Response({"code": "address_not_found"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == "DELETE":
        address.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    serializer = CustomerAddressCreateSerializer(data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    if data.get("is_default"):
        Address.objects.filter(organization=organization, customer=customer_obj).exclude(id=address.id).update(is_default=False)
    for field, value in data.items():
        setattr(address, field, value)
    address.save()
    return Response(AddressSerializer(address).data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def customers(request):
    organization = get_request_organization(request)
    if request.method == "GET":
        require_organization_permission(request.user, organization, "customers.read")
        customers = customers_for_organization(organization)
        return Response(CustomerSerializer(customers, many=True).data)

    require_organization_permission(request.user, organization, "customers.manage")
    serializer = CustomerCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    customer = create_customer_from_input(
        organization=organization,
        **serializer.validated_data,
    )
    return Response(CustomerSerializer(customer).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def customer(request, customer_id):
    organization = get_request_organization(request)
    customer_obj = customer_detail(customer_id, organization)
    if request.method == "GET":
        require_organization_permission(request.user, organization, "customers.read")
        return Response(CustomerSerializer(customer_obj).data)

    require_organization_permission(request.user, organization, "customers.manage")
    serializer = CustomerUpdateSerializer(data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    customer_obj = update_customer_from_input(
        customer=customer_obj,
        data=serializer.validated_data,
    )
    return Response(CustomerSerializer(customer_obj).data)
