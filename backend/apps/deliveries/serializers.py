from rest_framework import serializers
from apps.deliveries.models import Shipment, ShipmentItem, DispatchBatch

class ShipmentItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShipmentItem
        fields = ["id", "product_name", "quantity"]

class ShipmentSerializer(serializers.ModelSerializer):
    items = ShipmentItemSerializer(many=True, read_only=True)

    class Meta:
        model = Shipment
        fields = [
            "id",
            "organization_id",
            "subscription_id",
            "customer_id",
            "batch_id",
            "status",
            "scheduled_date",
            "tracking_code",
            "shipping_address",
            "items",
            "created_at",
        ]

class DispatchBatchSerializer(serializers.ModelSerializer):
    shipments = ShipmentSerializer(many=True, read_only=True)

    class Meta:
        model = DispatchBatch
        fields = ["id", "organization_id", "batch_date", "status", "notes", "shipments", "created_at"]
