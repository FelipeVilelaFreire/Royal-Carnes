from rest_framework.views import APIView
from rest_framework.response import Response
from apps.core.selectors import get_organization_by_slug
from apps.deliveries.selectors import list_shipments_by_organization
from apps.deliveries.serializers import ShipmentSerializer

class ShipmentListView(APIView):
    def get(self, request):
        org = get_organization_by_slug("primecut-club")
        if not org:
            return Response({"shipments": []})
        shipments = list_shipments_by_organization(str(org.id))
        serializer = ShipmentSerializer(shipments, many=True)
        return Response({"shipments": serializer.data})
