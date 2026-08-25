from rest_framework.views import APIView
from rest_framework.response import Response
from apps.core.selectors import get_organization_by_slug
from apps.billing.selectors import list_invoices_by_organization
from apps.billing.serializers import InvoiceSerializer

class InvoiceListView(APIView):
    def get(self, request):
        org = get_organization_by_slug("primecut-club")
        if not org:
            return Response({"invoices": []})
        invoices = list_invoices_by_organization(str(org.id))
        serializer = InvoiceSerializer(invoices, many=True)
        return Response({"invoices": serializer.data})
