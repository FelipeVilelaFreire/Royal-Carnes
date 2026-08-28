from rest_framework import serializers

from .models import Order, OrderItem, OrderKindDefinition, OrderStatusDefinition, OrderStatusHistory


class OrderKindSerializer(serializers.ModelSerializer):
    commercial_mode_key = serializers.CharField(source="commercial_mode.key", read_only=True, allow_null=True)

    class Meta:
        model = OrderKindDefinition
        fields = (
            "id",
            "key",
            "label",
            "commercial_mode_key",
            "code_sequence_key",
            "requires_inventory",
            "creates_delivery",
            "is_active",
            "sort_order",
            "metadata",
        )


class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatusDefinition
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


class OrderItemSerializer(serializers.ModelSerializer):
    product_key = serializers.CharField(source="product.key", read_only=True)
    variant_sku = serializers.CharField(source="variant.sku", read_only=True, allow_null=True)
    measurement_unit_key = serializers.CharField(source="measurement_unit.key", read_only=True, allow_null=True)

    class Meta:
        model = OrderItem
        fields = (
            "id",
            "product_key",
            "variant_sku",
            "measurement_unit_key",
            "name_snapshot",
            "quantity",
            "unit_price_cents",
            "total_cents",
            "weight_grams",
            "source_type",
            "source_key",
            "metadata",
        )


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, allow_null=True)

    class Meta:
        model = OrderStatusHistory
        fields = (
            "id",
            "from_status_key",
            "to_status_key",
            "note",
            "actor_email",
            "created_at",
        )


class OrderSerializer(serializers.ModelSerializer):
    customer_id = serializers.IntegerField(source="customer.id", read_only=True)
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    address_id = serializers.IntegerField(source="address.id", read_only=True, allow_null=True)
    items = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "code",
            "kind_key",
            "status_key",
            "customer_id",
            "customer_name",
            "address_id",
            "subscription_id",
            "subscription_cycle_id",
            "currency",
            "subtotal_cents",
            "discount_cents",
            "freight_cents",
            "total_cents",
            "notes",
            "metadata",
            "items",
            "status_history",
            "created_at",
            "updated_at",
        )


class OrderItemCreateSerializer(serializers.Serializer):
    product_key = serializers.SlugField(max_length=120)
    variant_sku = serializers.CharField(max_length=80, required=False, allow_blank=True)
    quantity = serializers.DecimalField(max_digits=10, decimal_places=3)
    source_type = serializers.CharField(max_length=80, required=False, allow_blank=True, default="")
    source_key = serializers.CharField(max_length=120, required=False, allow_blank=True, default="")
    metadata = serializers.DictField(required=False, default=dict)


class OrderCreateSerializer(serializers.Serializer):
    kind_key = serializers.SlugField(max_length=80)
    address_id = serializers.IntegerField(required=False, allow_null=True)
    subscription_id = serializers.IntegerField(required=False, allow_null=True)
    subscription_cycle_id = serializers.IntegerField(required=False, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True, default="")
    items = serializers.ListField(child=OrderItemCreateSerializer(), allow_empty=False)


class AdminOrderCreateSerializer(OrderCreateSerializer):
    customer_id = serializers.IntegerField()


class OrderStatusTransitionSerializer(serializers.Serializer):
    status_key = serializers.SlugField(max_length=80)
    note = serializers.CharField(required=False, allow_blank=True, default="")
