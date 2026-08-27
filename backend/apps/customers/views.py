from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.permissions import require_organization_permission
from apps.core.tenant import get_request_organization

from .selectors import customer_detail, customers_for_organization
from .serializers import CustomerCreateSerializer, CustomerSerializer
from .services import create_customer_from_input


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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def customer(request, customer_id):
    organization = get_request_organization(request)
    require_organization_permission(request.user, organization, "customers.read")
    customer_obj = customer_detail(customer_id, organization)
    return Response(CustomerSerializer(customer_obj).data)
