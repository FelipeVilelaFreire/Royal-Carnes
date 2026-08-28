from django.contrib import admin

from .models import Delivery, DeliveryConfirmation, DeliveryPackage, DeliveryStatusDefinition, DeliveryStatusHistory


class DeliveryPackageInline(admin.TabularInline):
    model = DeliveryPackage
    extra = 0


class DeliveryStatusHistoryInline(admin.TabularInline):
    model = DeliveryStatusHistory
    extra = 0
    readonly_fields = ("created_at",)


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ("code", "order", "customer", "status_key", "created_at")
    list_filter = ("organization", "status_key")
    search_fields = ("code", "order__code", "customer__name")
    inlines = [DeliveryPackageInline, DeliveryStatusHistoryInline]


@admin.register(DeliveryStatusDefinition)
class DeliveryStatusDefinitionAdmin(admin.ModelAdmin):
    list_display = ("key", "label", "organization", "is_initial", "is_terminal", "sort_order")
    list_filter = ("organization", "is_initial", "is_terminal")


admin.site.register(DeliveryConfirmation)
