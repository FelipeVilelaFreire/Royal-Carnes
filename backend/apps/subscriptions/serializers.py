from rest_framework import serializers

from .models import Plan, PlanEntitlement, PlanPrice, Subscription, SubscriptionCycle, SubscriptionCycleItem


class PlanPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanPrice
        fields = (
            "id",
            "currency",
            "amount_cents",
            "billing_interval",
            "billing_interval_count",
            "price_type",
        )


class PlanEntitlementSerializer(serializers.ModelSerializer):
    target_key = serializers.SerializerMethodField()
    target_name = serializers.SerializerMethodField()
    measurement_unit_key = serializers.CharField(source="measurement_unit.key", read_only=True, allow_null=True)
    measurement_unit_symbol = serializers.CharField(source="measurement_unit.symbol", read_only=True, allow_null=True)

    class Meta:
        model = PlanEntitlement
        fields = (
            "id",
            "key",
            "target_type",
            "target_key",
            "target_name",
            "quantity",
            "measurement_unit_key",
            "measurement_unit_symbol",
            "constraints",
            "sort_order",
        )

    def get_target_key(self, entitlement):
        target = self._target(entitlement)
        return getattr(target, "key", getattr(target, "sku", None))

    def get_target_name(self, entitlement):
        target = self._target(entitlement)
        return getattr(target, "name", None)

    def _target(self, entitlement):
        return {
            PlanEntitlement.TargetType.COLLECTION: entitlement.collection,
            PlanEntitlement.TargetType.CATEGORY: entitlement.category,
            PlanEntitlement.TargetType.PRODUCT: entitlement.product,
            PlanEntitlement.TargetType.VARIANT: entitlement.variant,
        }.get(entitlement.target_type)


class PlanSerializer(serializers.ModelSerializer):
    prices = PlanPriceSerializer(many=True, read_only=True)
    entitlements = PlanEntitlementSerializer(many=True, read_only=True)

    class Meta:
        model = Plan
        fields = (
            "id",
            "key",
            "name",
            "description",
            "status",
            "billing_interval",
            "trial_days",
            "sort_order",
            "prices",
            "entitlements",
        )


class PlanCreateSerializer(serializers.Serializer):
    key = serializers.SlugField(max_length=100)
    name = serializers.CharField(max_length=160)
    description = serializers.CharField(required=False, allow_blank=True, default="")
    billing_interval = serializers.ChoiceField(
        choices=Plan.BillingInterval.choices,
        required=False,
        default=Plan.BillingInterval.MONTH,
    )
    price_cents = serializers.IntegerField(min_value=0, required=False)
    entitlements = serializers.ListField(child=serializers.DictField(), required=False, default=list)


class SubscriptionCycleItemSerializer(serializers.ModelSerializer):
    entitlement_key = serializers.CharField(source="entitlement.key", read_only=True)
    product_key = serializers.CharField(source="product.key", read_only=True, allow_null=True)
    variant_sku = serializers.CharField(source="variant.sku", read_only=True, allow_null=True)
    measurement_unit_key = serializers.CharField(source="measurement_unit.key", read_only=True, allow_null=True)

    class Meta:
        model = SubscriptionCycleItem
        fields = (
            "id",
            "entitlement_key",
            "product_key",
            "variant_sku",
            "quantity",
            "measurement_unit_key",
            "status",
        )


class SubscriptionCycleSerializer(serializers.ModelSerializer):
    items = SubscriptionCycleItemSerializer(many=True, read_only=True)

    class Meta:
        model = SubscriptionCycle
        fields = (
            "id",
            "cycle_number",
            "status",
            "starts_at",
            "ends_at",
            "closed_at",
            "items",
        )


class SubscriptionSerializer(serializers.ModelSerializer):
    customer_id = serializers.IntegerField(source="customer.id", read_only=True)
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    plan = PlanSerializer(read_only=True)
    cycles = SubscriptionCycleSerializer(many=True, read_only=True)

    class Meta:
        model = Subscription
        fields = (
            "id",
            "customer_id",
            "customer_name",
            "plan",
            "status",
            "started_at",
            "ended_at",
            "current_cycle_starts_at",
            "current_cycle_ends_at",
            "cancelled_at",
            "cancel_reason",
            "cycles",
        )


class SubscriptionCreateSerializer(serializers.Serializer):
    customer_id = serializers.IntegerField()
    plan_key = serializers.SlugField(max_length=100)
    status = serializers.ChoiceField(
        choices=Subscription.Status.choices,
        required=False,
        default=Subscription.Status.ACTIVE,
    )
    started_at = serializers.DateTimeField(required=False, allow_null=True)


class SubscriptionCycleItemCreateSerializer(serializers.Serializer):
    entitlement_key = serializers.SlugField(max_length=120)
    product_key = serializers.SlugField(max_length=120, required=False)
    variant_sku = serializers.CharField(max_length=80, required=False, allow_blank=True)
    quantity = serializers.DecimalField(max_digits=10, decimal_places=3)
    measurement_unit_key = serializers.SlugField(max_length=50, required=False)
