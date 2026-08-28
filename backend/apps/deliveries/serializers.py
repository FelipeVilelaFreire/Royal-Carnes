from rest_framework import serializers

from .models import Delivery, DeliveryConfirmation, DeliveryPackage, DeliveryStatusDefinition, DeliveryStatusHistory


class DeliveryStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryStatusDefinition
        fields = (
            "id",
            "key",
            "label",
            "sort_order",
            "is_initial",
            "is_terminal",
            "is_public",
            "allowed_next_keys",
            "effects",
            "metadata",
        )


class DeliveryPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryPackage
        fields = ("id", "label", "package_type", "weight_grams", "metadata")


class DeliveryStatusHistorySerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, allow_null=True)

    class Meta:
        model = DeliveryStatusHistory
        fields = ("id", "from_status_key", "to_status_key", "note", "actor_email", "created_at")


class DeliveryConfirmationSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, allow_null=True)

    class Meta:
        model = DeliveryConfirmation
        fields = ("id", "confirmation_type", "confirmed_by", "note", "actor_email", "created_at")


class DeliverySerializer(serializers.ModelSerializer):
    order_code = serializers.CharField(source="order.code", read_only=True)
    customer_id = serializers.IntegerField(source="customer.id", read_only=True)
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    address_id = serializers.IntegerField(source="address.id", read_only=True, allow_null=True)
    packages = DeliveryPackageSerializer(many=True, read_only=True)
    status_history = DeliveryStatusHistorySerializer(many=True, read_only=True)
    confirmation = DeliveryConfirmationSerializer(read_only=True)

    class Meta:
        model = Delivery
        fields = (
            "id",
            "code",
            "order_id",
            "order_code",
            "customer_id",
            "customer_name",
            "address_id",
            "status_key",
            "confirmation_code",
            "address_snapshot",
            "notes",
            "metadata",
            "packages",
            "status_history",
            "confirmation",
            "created_at",
            "updated_at",
        )


class DeliveryCreateSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    code_sequence_key = serializers.SlugField(max_length=80, required=False, default="deliveries")
    confirmation_code = serializers.CharField(max_length=40, required=False, allow_blank=True, default="")
    notes = serializers.CharField(required=False, allow_blank=True, default="")


class DeliveryStatusTransitionSerializer(serializers.Serializer):
    status_key = serializers.SlugField(max_length=80)
    note = serializers.CharField(required=False, allow_blank=True, default="")


class DeliveryConfirmSerializer(serializers.Serializer):
    confirmation_type = serializers.CharField(max_length=80, required=False, default="manual")
    confirmed_by = serializers.CharField(max_length=160, required=False, allow_blank=True, default="")
    note = serializers.CharField(required=False, allow_blank=True, default="")
