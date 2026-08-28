from django.contrib import admin

from .models import Order, OrderItem, OrderKindDefinition, OrderStatusDefinition, OrderStatusHistory


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


class OrderStatusHistoryInline(admin.TabularInline):
    model = OrderStatusHistory
    extra = 0
    readonly_fields = ("created_at",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("code", "customer", "kind_key", "status_key", "total_cents", "created_at")
    list_filter = ("organization", "kind_key", "status_key")
    search_fields = ("code", "customer__name", "customer__email")
    inlines = [OrderItemInline, OrderStatusHistoryInline]


@admin.register(OrderKindDefinition)
class OrderKindDefinitionAdmin(admin.ModelAdmin):
    list_display = ("key", "label", "organization", "is_active", "sort_order")
    list_filter = ("organization", "is_active")


@admin.register(OrderStatusDefinition)
class OrderStatusDefinitionAdmin(admin.ModelAdmin):
    list_display = ("key", "label", "organization", "is_initial", "is_terminal", "sort_order")
    list_filter = ("organization", "is_initial", "is_terminal")
