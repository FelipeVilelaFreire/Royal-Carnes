from rest_framework import serializers

from .models import Delivery, DeliveryConfirmation, DeliveryPackage, DeliveryPromisePolicy, DeliveryStatusDefinition, DeliveryStatusHistory
from .services import delivery_promise_status


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


class DeliveryPromisePolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryPromisePolicy
        fields = (
            "id",
            "key",
            "name",
            "min_business_days",
            "max_business_days",
            "approaching_business_days",
            "order_kind_keys",
            "subscription_plan_keys",
            "is_default",
            "is_active",
            "sort_order",
        )


class DeliveryPromisePolicyWriteSerializer(serializers.Serializer):
    key = serializers.SlugField(max_length=80)
    name = serializers.CharField(max_length=120)
    min_business_days = serializers.IntegerField(min_value=1)
    max_business_days = serializers.IntegerField(min_value=1)
    approaching_business_days = serializers.IntegerField(min_value=0, required=False, default=2)
    order_kind_keys = serializers.ListField(child=serializers.SlugField(max_length=80), required=False, default=list)
    subscription_plan_keys = serializers.ListField(child=serializers.SlugField(max_length=100), required=False, default=list)
    is_default = serializers.BooleanField(required=False, default=False)
    is_active = serializers.BooleanField(required=False, default=True)
    sort_order = serializers.IntegerField(min_value=0, required=False, default=0)

    def validate(self, attrs):
        if attrs["min_business_days"] > attrs["max_business_days"]:
            raise serializers.ValidationError({"max_business_days": "Must be greater than or equal to min_business_days."})
        if attrs["approaching_business_days"] > attrs["max_business_days"]:
            raise serializers.ValidationError({"approaching_business_days": "Must not exceed max_business_days."})
        return attrs


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
    delivery_promise_status = serializers.SerializerMethodField()

    def get_delivery_promise_status(self, delivery):
        return delivery_promise_status(delivery)

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
            "promised_delivery_starts_on",
            "promised_delivery_by_on",
            "delivery_promise_snapshot",
            "delivery_promise_status",
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
