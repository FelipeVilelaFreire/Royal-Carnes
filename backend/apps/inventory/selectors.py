from .models import InventoryItem, InventoryMovement


def inventory_items_for_organization(organization):
    return (
        InventoryItem.objects.filter(organization=organization)
        .select_related("product", "variant", "measurement_unit")
        .order_by("product__name", "variant__name")
    )


def inventory_item_detail(item_id, organization):
    return (
        InventoryItem.objects.select_related("product", "variant", "measurement_unit")
        .get(id=item_id, organization=organization)
    )


def inventory_movements_for_item(organization, item):
    return InventoryMovement.objects.filter(
        organization=organization,
        inventory_item=item,
    ).select_related("actor")
