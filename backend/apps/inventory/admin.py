from django.contrib import admin

from .models import InventoryItem, InventoryMovement, StockReservation


@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ("product", "variant", "organization", "available_quantity", "reserved_quantity", "status")
    list_filter = ("organization", "status")
    search_fields = ("product__name", "product__key", "variant__sku", "variant__name")


@admin.register(InventoryMovement)
class InventoryMovementAdmin(admin.ModelAdmin):
    list_display = ("inventory_item", "movement_type", "quantity_delta", "reserved_delta", "actor", "created_at")
    list_filter = ("organization", "movement_type")
    search_fields = ("inventory_item__product__name", "inventory_item__variant__sku", "reason")


admin.site.register(StockReservation)
