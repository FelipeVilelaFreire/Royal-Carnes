from rest_framework import serializers
from apps.plans.models import Plan

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = [
            "id",
            "organization_id",
            "key",
            "name",
            "billing_frequency",
            "price_cents",
            "fulfillment_type",
            "metadata",
            "is_active",
            "created_at",
        ]
