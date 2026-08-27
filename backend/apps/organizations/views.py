from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import OrganizationSerializer
from .services import ensure_default_organization


@api_view(["GET"])
@permission_classes([AllowAny])
def default_organization(request):
    organization = ensure_default_organization()
    return Response(OrganizationSerializer(organization, context={"request": request}).data)
