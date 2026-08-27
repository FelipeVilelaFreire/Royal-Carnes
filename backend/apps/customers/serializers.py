from rest_framework import serializers

from .models import Address, Customer


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


class CustomerSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, read_only=True)

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
            "addresses",
        )
        read_only_fields = ("id", "status", "member_since", "addresses")


class CustomerCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=180)
    email = serializers.EmailField(required=False, allow_blank=True)
    phone = serializers.CharField(max_length=32, required=False, allow_blank=True)
    document = serializers.CharField(max_length=40, required=False, allow_blank=True)
