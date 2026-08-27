from rest_framework import serializers

from .models import Organization


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = (
            "id",
            "slug",
            "name",
            "business_name",
            "status",
            "default_locale",
            "timezone",
            "currency",
        )
