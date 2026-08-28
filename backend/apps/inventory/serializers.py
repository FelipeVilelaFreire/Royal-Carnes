from rest_framework import serializers

from .models import InventoryItem, InventoryMovement


class InventoryMovementSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, allow_null=True)

    class Meta:
        model = InventoryMovement
        fields = (
            "id",
            "movement_type",
            "quantity_delta",
            "reserved_delta",
            "reason",
            "metadata",
            "actor_email",
            "created_at",
        )


class InventoryItemSerializer(serializers.ModelSerializer):
    product_key = serializers.CharField(source="product.key", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)
    variant_sku = serializers.CharField(source="variant.sku", read_only=True, allow_null=True)
    variant_name = serializers.CharField(source="variant.name", read_only=True, allow_null=True)
    measurement_unit_key = serializers.CharField(source="measurement_unit.key", read_only=True, allow_null=True)
    measurement_unit_symbol = serializers.CharField(source="measurement_unit.symbol", read_only=True, allow_null=True)
    sellable_quantity = serializers.DecimalField(max_digits=12, decimal_places=3, read_only=True)

    class Meta:
        model = InventoryItem
        fields = (
            "id",
            "product_key",
            "product_name",
            "variant_sku",
            "variant_name",
            "measurement_unit_key",
            "measurement_unit_symbol",
            "available_quantity",
            "reserved_quantity",
            "sellable_quantity",
            "low_stock_threshold",
            "status",
            "notes",
            "updated_at",
        )


class InventoryItemUpsertSerializer(serializers.Serializer):
    product_key = serializers.SlugField(max_length=120)
    variant_sku = serializers.CharField(max_length=80, required=False, allow_blank=True)
    measurement_unit_key = serializers.SlugField(max_length=50, required=False)
    available_quantity = serializers.DecimalField(max_digits=12, decimal_places=3, required=False, default=0)
    reserved_quantity = serializers.DecimalField(max_digits=12, decimal_places=3, required=False, default=0)
    low_stock_threshold = serializers.DecimalField(max_digits=12, decimal_places=3, required=False, default=0)
    status = serializers.ChoiceField(
        choices=InventoryItem.Status.choices,
        required=False,
        default=InventoryItem.Status.AVAILABLE,
    )
    notes = serializers.CharField(required=False, allow_blank=True, default="")


class InventoryAdjustmentSerializer(serializers.Serializer):
    quantity_delta = serializers.DecimalField(max_digits=12, decimal_places=3, required=False, default=0)
    reserved_delta = serializers.DecimalField(max_digits=12, decimal_places=3, required=False, default=0)
    movement_type = serializers.ChoiceField(
        choices=InventoryMovement.MovementType.choices,
        required=False,
        default=InventoryMovement.MovementType.MANUAL_ADJUSTMENT,
    )
    reason = serializers.CharField(required=False, allow_blank=True, default="")
    metadata = serializers.DictField(required=False, default=dict)
