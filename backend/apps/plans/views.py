from rest_framework.views import APIView
from rest_framework.response import Response
from apps.core.selectors import get_organization_by_slug
from apps.plans.selectors import list_active_plans_by_organization
from apps.plans.serializers import PlanSerializer

class PlanListView(APIView):
    def get(self, request):
        org = get_organization_by_slug("primecut-club")
        if not org:
            return Response({"plans": []})
        plans = list_active_plans_by_organization(str(org.id))
        serializer = PlanSerializer(plans, many=True)
        return Response({"plans": serializer.data})
