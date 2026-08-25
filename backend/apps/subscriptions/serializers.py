from rest_framework import serializers
from apps.subscriptions.models import Subscription, PauseLog
from apps.plans.serializers import PlanSerializer
from apps.core.serializers import CustomerSerializer

class PauseLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PauseLog
        fields = ["id", "paused_at", "resumes_at", "reason"]

class SubscriptionSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    plan = PlanSerializer(read_only=True)
    pause_logs = PauseLogSerializer(many=True, read_only=True)

    class Meta:
        model = Subscription
        fields = [
            "id",
            "organization_id",
            "customer",
            "plan",
            "status",
            "current_period_start",
            "current_period_end",
            "cancel_at_period_end",
            "pause_logs",
            "created_at",
        ]
