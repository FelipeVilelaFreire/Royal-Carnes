from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.core.errors import error_response
from apps.core.tenant import get_request_organization
from apps.customers.services import upsert_customer

from .models import OrganizationMember, User
from .permissions import require_organization_permission
from .selectors import user_memberships
from .serializers import (
    OrganizationMemberSerializer,
    RegisterSerializer,
    RoyalPrimeTokenObtainPairSerializer,
    UserCreateSerializer,
    UserListSerializer,
    UserSerializer,
)
from .services import upsert_user_with_roles


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = RoyalPrimeTokenObtainPairSerializer


class RefreshView(TokenRefreshView):
    permission_classes = [AllowAny]


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    memberships = user_memberships(request.user)
    permissions_by_org = {}
    for membership in memberships:
        permission_keys = {
            role_permission.permission.key
            for role_permission in membership.role.role_permissions.all()
        }
        permissions_by_org.setdefault(membership.organization.slug, set()).update(permission_keys)
    return Response(
        {
            "user": UserSerializer(request.user).data,
            "memberships": OrganizationMemberSerializer(memberships, many=True).data,
            "permissions": {
                organization_slug: sorted(permission_keys)
                for organization_slug, permission_keys in permissions_by_org.items()
            },
        }
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    if User.objects.filter(email=serializer.validated_data["email"]).exists():
        return error_response("email_already_registered", status_code=status.HTTP_400_BAD_REQUEST)
    organization = get_request_organization(request)
    user = upsert_user_with_roles(
        organization=organization,
        email=serializer.validated_data["email"],
        password=serializer.validated_data["password"],
        name=serializer.validated_data["name"],
        phone=serializer.validated_data.get("phone", ""),
        roles=["customer"],
    )
    upsert_customer(
        organization=organization,
        key="",
        name=user.name or user.email,
        email=user.email,
        phone=user.phone,
        user=user,
    )
    return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(_request):
    return Response({"status": "ok"})


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def users(request):
    organization = get_request_organization(request)
    if request.method == "GET":
        require_organization_permission(request.user, organization, "settings.manage")
        queryset = (
            User.objects.filter(organization_memberships__organization=organization)
            .prefetch_related("organization_memberships__role")
            .distinct()
            .order_by("email")
        )
        return Response(
            UserListSerializer(
                queryset,
                many=True,
                context={"organization": organization},
            ).data
        )

    require_organization_permission(request.user, organization, "settings.manage")
    serializer = UserCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = upsert_user_with_roles(
        organization=organization,
        email=serializer.validated_data["email"],
        password=serializer.validated_data.get("password") or None,
        name=serializer.validated_data.get("name", ""),
        phone=serializer.validated_data.get("phone", ""),
        roles=serializer.validated_data["roles"],
    )
    if "customer" in serializer.validated_data["roles"]:
        upsert_customer(
            organization=organization,
            name=user.name or user.email,
            email=user.email,
            phone=user.phone,
            user=user,
        )
    return Response(
        UserListSerializer(user, context={"organization": organization}).data,
        status=status.HTTP_201_CREATED,
    )
