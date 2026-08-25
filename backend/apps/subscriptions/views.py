from rest_framework.views import APIView
from rest_framework.response import Response
from apps.core.selectors import get_organization_by_slug
from apps.subscriptions.selectors import list_subscriptions_by_organization
from apps.subscriptions.serializers import SubscriptionSerializer

class SubscriptionListView(APIView):
    def get(self, request):
        org = get_organization_by_slug("primecut-club")
        if not org:
            return Response({"subscriptions": []})
        subs = list_subscriptions_by_organization(str(org.id))
        serializer = SubscriptionSerializer(subs, many=True)
        return Response({"subscriptions": serializer.data})
