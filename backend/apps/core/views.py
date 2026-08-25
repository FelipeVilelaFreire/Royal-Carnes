from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.core.selectors import list_customers_by_organization, get_organization_by_slug
from apps.core.serializers import CustomerSerializer, OrganizationSerializer

class CustomerListView(APIView):
    def get(self, request):
        org = get_organization_by_slug("primecut-club")
        if not org:
            return Response({"customers": []})
        customers = list_customers_by_organization(str(org.id))
        serializer = CustomerSerializer(customers, many=True)
        return Response({"customers": serializer.data})
