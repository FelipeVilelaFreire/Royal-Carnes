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
    image_url = serializers.SerializerMethodField()
    image_alt = serializers.SerializerMethodField()

    def _primary_media(self, item):
        media = item.product.media.all()
        return next((entry for entry in media if entry.is_primary), None)

    def get_image_url(self, item):
        media = self._primary_media(item)
        return media.url if media else None

    def get_image_alt(self, item):
        media = self._primary_media(item)
        return media.alt if media else ""

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
            "image_url",
            "image_alt",
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
    address_label = serializers.SerializerMethodField()
    subscription_plan_key = serializers.CharField(source="subscription.plan.key", read_only=True, allow_null=True)
    subscription_plan_name = serializers.CharField(source="subscription.plan.name", read_only=True, allow_null=True)
    subscription_cycle_number = serializers.IntegerField(source="subscription_cycle.cycle_number", read_only=True, allow_null=True)
    subscription_cycle_status = serializers.CharField(source="subscription_cycle.status", read_only=True, allow_null=True)
    subscription_cycle_starts_at = serializers.DateTimeField(source="subscription_cycle.starts_at", read_only=True, allow_null=True)
    subscription_cycle_ends_at = serializers.DateTimeField(source="subscription_cycle.ends_at", read_only=True, allow_null=True)
    box_cycle_key = serializers.CharField(source="box_cycle.cycle_key", read_only=True, allow_null=True)
    box_cycle_scheduled_for = serializers.DateTimeField(source="box_cycle.scheduled_for", read_only=True, allow_null=True)
    box_cycle_status = serializers.CharField(source="box_cycle.status", read_only=True, allow_null=True)
    box_template_name = serializers.CharField(source="box_cycle.subscription.template.name", read_only=True, allow_null=True)
    box_order_creation_policy = serializers.CharField(source="box_cycle.subscription.order_creation_policy", read_only=True, allow_null=True)
    box_recurrence_day = serializers.SerializerMethodField()
    items = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)

    def get_address_label(self, order):
        if order.address is None:
            return ""
        return ", ".join(part for part in [order.address.street, order.address.number, order.address.city, order.address.state] if part)

    def get_box_recurrence_day(self, order):
        if order.box_cycle is None:
            return None
        day = (order.box_cycle.subscription.schedule.recurrence_rule or {}).get("dayOfMonth")
        return day if isinstance(day, int) else None

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
            "address_label",
            "subscription_id",
            "subscription_plan_key",
            "subscription_plan_name",
            "subscription_cycle_id",
            "subscription_cycle_number",
            "subscription_cycle_status",
            "subscription_cycle_starts_at",
            "subscription_cycle_ends_at",
            "box_cycle_id",
            "box_cycle_key",
            "box_cycle_scheduled_for",
            "box_cycle_status",
            "box_template_name",
            "box_order_creation_policy",
            "box_recurrence_day",
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


class RoyalBoxCheckoutSerializer(serializers.Serializer):
    address_id = serializers.IntegerField()
    recurrence_day = serializers.IntegerField(min_value=1, max_value=31)
    items = serializers.ListField(child=OrderItemCreateSerializer(), allow_empty=False)


class AdminOrderCreateSerializer(OrderCreateSerializer):
    customer_id = serializers.IntegerField()


class OrderItemsReplaceSerializer(serializers.Serializer):
    items = serializers.ListField(child=OrderItemCreateSerializer(), allow_empty=False)


class OrderStatusTransitionSerializer(serializers.Serializer):
    status_key = serializers.SlugField(max_length=80)
    note = serializers.CharField(required=False, allow_blank=True, default="")
