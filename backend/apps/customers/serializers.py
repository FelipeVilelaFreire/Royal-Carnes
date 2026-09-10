from rest_framework import serializers

from .models import Address, Customer, CustomerProfile, PaymentMethodRef


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = (
            "id",
            "label",
            "recipient_name",
            "postal_code",
            "street",
            "number",
            "complement",
            "district",
            "city",
            "state",
            "country",
            "is_default",
            "delivery_instructions",
        )


class CustomerAddressCreateSerializer(serializers.Serializer):
    label = serializers.CharField(max_length=80, required=False, allow_blank=True)
    recipient_name = serializers.CharField(max_length=180, required=False, allow_blank=True)
    postal_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    street = serializers.CharField(max_length=180)
    number = serializers.CharField(max_length=40, required=False, allow_blank=True)
    complement = serializers.CharField(max_length=120, required=False, allow_blank=True)
    district = serializers.CharField(max_length=120, required=False, allow_blank=True)
    city = serializers.CharField(max_length=120)
    state = serializers.CharField(max_length=40)
    country = serializers.CharField(max_length=2, required=False, default="BR")
    is_default = serializers.BooleanField(required=False, default=False)
    delivery_instructions = serializers.CharField(required=False, allow_blank=True, default="")


class CustomerSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, read_only=True)
    birth_date = serializers.DateField(source="profile.birth_date", read_only=True, allow_null=True)
    preferences = serializers.JSONField(source="profile.preferences", read_only=True)
    notification_settings = serializers.JSONField(source="profile.notification_settings", read_only=True)
    payment_methods = serializers.SerializerMethodField()

    def get_payment_methods(self, customer):
        methods = customer.payment_method_refs.filter(deleted_at__isnull=True)
        return [
            {
                "id": method.id,
                "method_type": method.method_type,
                "label": method.label,
                "provider": method.provider,
                "metadata": method.metadata,
                "is_default": method.is_default,
            }
            for method in methods
        ]

    class Meta:
        model = Customer
        fields = (
            "id",
            "name",
            "email",
            "phone",
            "document",
            "status",
            "member_since",
            "created_at",
            "updated_at",
            "addresses",
            "birth_date",
            "preferences",
            "notification_settings",
            "payment_methods",
        )
        read_only_fields = ("id", "status", "member_since", "created_at", "updated_at", "addresses")


class CustomerCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=180)
    email = serializers.EmailField(required=False, allow_blank=True)
    phone = serializers.CharField(max_length=32, required=False, allow_blank=True)
    document = serializers.CharField(max_length=40, required=False, allow_blank=True)


class CustomerUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=180, required=False)
    email = serializers.EmailField(required=False, allow_blank=True)
    phone = serializers.CharField(max_length=32, required=False, allow_blank=True)
    document = serializers.CharField(max_length=40, required=False, allow_blank=True)
    status = serializers.ChoiceField(choices=Customer.Status.choices, required=False)


class CurrentCustomerUpdateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=180, required=False)
    email = serializers.EmailField(required=False, allow_blank=True)
    phone = serializers.CharField(max_length=32, required=False, allow_blank=True)
    document = serializers.CharField(max_length=40, required=False, allow_blank=True)
    birth_date = serializers.DateField(required=False, allow_null=True)
    preferences = serializers.DictField(required=False)
    notification_settings = serializers.DictField(required=False)
