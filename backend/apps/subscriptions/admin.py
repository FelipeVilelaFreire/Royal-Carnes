from django.contrib import admin

from .models import (
    Plan,
    PlanEntitlement,
    PlanPrice,
    Subscription,
    SubscriptionCycle,
    SubscriptionCycleItem,
)


class PlanPriceInline(admin.TabularInline):
    model = PlanPrice
    extra = 0


class PlanEntitlementInline(admin.TabularInline):
    model = PlanEntitlement
    extra = 0


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ("name", "key", "organization", "status", "billing_interval", "sort_order")
    list_filter = ("organization", "status", "billing_interval")
    search_fields = ("name", "key")
    inlines = [PlanPriceInline, PlanEntitlementInline]


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ("customer", "plan", "organization", "status", "started_at")
    list_filter = ("organization", "status", "plan")
    search_fields = ("customer__name", "customer__email", "plan__key")


admin.site.register(PlanPrice)
admin.site.register(PlanEntitlement)
admin.site.register(SubscriptionCycle)
admin.site.register(SubscriptionCycleItem)
