from rest_framework import serializers

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    customer_id = serializers.IntegerField(source="customer.id", read_only=True)
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    subscription_id = serializers.IntegerField(read_only=True, allow_null=True)
    subscription_plan_name = serializers.CharField(source="subscription.plan.name", read_only=True, allow_null=True)
    order_id = serializers.IntegerField(read_only=True, allow_null=True)
    order_code = serializers.CharField(source="order.code", read_only=True, allow_null=True)

    class Meta:
        model = Payment
        fields = (
            "id",
            "reference",
            "customer_id",
            "customer_name",
            "subscription_id",
            "subscription_plan_name",
            "order_id",
            "order_code",
            "status",
            "currency",
            "amount_cents",
            "due_at",
            "paid_at",
            "notes",
            "metadata",
            "created_at",
            "updated_at",
        )


class PaymentCreateSerializer(serializers.Serializer):
    reference = serializers.CharField(max_length=120)
    customer_id = serializers.IntegerField()
    subscription_id = serializers.IntegerField(required=False, allow_null=True)
    order_id = serializers.IntegerField(required=False, allow_null=True)
    status = serializers.ChoiceField(choices=Payment.Status.choices, required=False, default=Payment.Status.PENDING)
    amount_cents = serializers.IntegerField(min_value=0)
    currency = serializers.CharField(max_length=3, required=False, default="BRL")
    due_at = serializers.DateTimeField(required=False, allow_null=True)
    paid_at = serializers.DateTimeField(required=False, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True, default="")
    metadata = serializers.DictField(required=False, default=dict)


class PaymentUpdateSerializer(serializers.Serializer):
    reference = serializers.CharField(max_length=120, required=False)
    status = serializers.ChoiceField(choices=Payment.Status.choices, required=False)
    amount_cents = serializers.IntegerField(min_value=0, required=False)
    currency = serializers.CharField(max_length=3, required=False)
    due_at = serializers.DateTimeField(required=False, allow_null=True)
    paid_at = serializers.DateTimeField(required=False, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    metadata = serializers.DictField(required=False)

