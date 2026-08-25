from django.contrib import admin
from apps.plans.models import Plan

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "key", "price_cents", "billing_frequency", "fulfillment_type", "is_active")
