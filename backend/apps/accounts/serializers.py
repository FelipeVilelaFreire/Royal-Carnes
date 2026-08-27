from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.customers.models import Customer
from apps.organizations.serializers import OrganizationSerializer

from .selectors import user_memberships, user_permission_keys
from .models import OrganizationMember, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "name", "phone", "is_active", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class OrganizationMemberSerializer(serializers.ModelSerializer):
    organization_slug = serializers.CharField(source="organization.slug", read_only=True)
    organization = OrganizationSerializer(read_only=True)
    role_key = serializers.CharField(source="role.key", read_only=True)

    class Meta:
        model = OrganizationMember
        fields = ("id", "organization", "organization_slug", "role_key", "status")


class CurrentUserSerializer(serializers.Serializer):
    user = UserSerializer()
    memberships = OrganizationMemberSerializer(many=True)
    permissions = serializers.DictField(child=serializers.ListField(child=serializers.CharField()))


class RoyalPrimeTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD

    def validate(self, attrs):
        data = super().validate(attrs)
        memberships = user_memberships(self.user)
        permissions_by_org = {
            membership.organization.slug: sorted(user_permission_keys(self.user, membership.organization))
            for membership in memberships
        }
        data["user"] = UserSerializer(self.user).data
        data["memberships"] = OrganizationMemberSerializer(memberships, many=True).data
        data["permissions"] = permissions_by_org
        return data


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    name = serializers.CharField(max_length=180)
    phone = serializers.CharField(max_length=32, required=False, allow_blank=True)


class UserCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8, required=False, allow_blank=True)
    name = serializers.CharField(max_length=180, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=32, required=False, allow_blank=True)
    roles = serializers.ListField(
        child=serializers.CharField(max_length=80),
        allow_empty=False,
    )


class UserListSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()
    customer_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "email", "name", "phone", "is_active", "roles", "customer_id")

    def get_roles(self, user):
        organization = self.context["organization"]
        return [
            membership.role.key
            for membership in user.organization_memberships.filter(
                organization=organization,
                status=OrganizationMember.Status.ACTIVE,
            ).select_related("role")
        ]

    def get_customer_id(self, user):
        organization = self.context["organization"]
        customer = Customer.objects.filter(organization=organization, user=user).first()
        return customer.id if customer else None
