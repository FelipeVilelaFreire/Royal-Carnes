from django.contrib import admin
from apps.deliveries.models import DispatchBatch, Shipment, ShipmentItem

class ShipmentItemInline(admin.TabularInline):
    model = ShipmentItem
    extra = 1

@admin.register(DispatchBatch)
class DispatchBatchAdmin(admin.ModelAdmin):
    list_display = ("id", "batch_date", "status", "created_at")

@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "subscription", "status", "scheduled_date", "tracking_code")
    inlines = [ShipmentItemInline]
