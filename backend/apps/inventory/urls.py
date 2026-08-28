from django.urls import path

from .views import (
    admin_inventory_adjust,
    admin_inventory_item,
    admin_inventory_items,
    admin_inventory_movements,
)

urlpatterns = [
    path("admin/items/", admin_inventory_items, name="inventory-admin-items"),
    path("admin/items/<int:item_id>/", admin_inventory_item, name="inventory-admin-item"),
    path("admin/items/<int:item_id>/adjust/", admin_inventory_adjust, name="inventory-admin-adjust"),
    path("admin/items/<int:item_id>/movements/", admin_inventory_movements, name="inventory-admin-movements"),
]
