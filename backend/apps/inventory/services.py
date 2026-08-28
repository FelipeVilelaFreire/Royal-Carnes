from decimal import Decimal

from django.db import transaction

from apps.catalog.models import MeasurementUnit, Product, ProductVariant

from .models import InventoryItem, InventoryMovement


class InventoryValidationError(ValueError):
    def __init__(self, code: str, detail: str):
        self.code = code
        self.detail = detail
        super().__init__(detail)


def resolve_inventory_status(item: InventoryItem) -> str:
    if item.status == InventoryItem.Status.DISABLED:
        return InventoryItem.Status.DISABLED
    if item.sellable_quantity <= 0:
        return InventoryItem.Status.UNAVAILABLE
    if item.low_stock_threshold and item.sellable_quantity <= item.low_stock_threshold:
        return InventoryItem.Status.LIMITED
    return InventoryItem.Status.AVAILABLE


@transaction.atomic
def upsert_inventory_item(
    *,
    organization,
    product: Product,
    variant: ProductVariant | None = None,
    measurement_unit: MeasurementUnit | None = None,
    available_quantity=0,
    reserved_quantity=0,
    low_stock_threshold=0,
    status: str | None = None,
    notes: str = "",
) -> InventoryItem:
    if variant is not None and variant.product_id != product.id:
        raise InventoryValidationError("variant_product_mismatch", "Variant does not belong to product")
    if measurement_unit is None and variant is not None:
        measurement_unit = variant.measurement_unit
    item, _created = InventoryItem.objects.update_or_create(
        organization=organization,
        product=product,
        variant=variant,
        defaults={
            "measurement_unit": measurement_unit,
            "available_quantity": available_quantity,
            "reserved_quantity": reserved_quantity,
            "low_stock_threshold": low_stock_threshold,
            "status": status or InventoryItem.Status.AVAILABLE,
            "notes": notes,
        },
    )
    next_status = resolve_inventory_status(item)
    if item.status != next_status:
        item.status = next_status
        item.save(update_fields=["status", "updated_at"])
    return item


@transaction.atomic
def adjust_inventory_item(
    *,
    organization,
    item: InventoryItem,
    quantity_delta=0,
    reserved_delta=0,
    movement_type: str = InventoryMovement.MovementType.MANUAL_ADJUSTMENT,
    reason: str = "",
    actor=None,
    metadata: dict | None = None,
) -> InventoryItem:
    if item.organization_id != organization.id:
        raise InventoryValidationError("organization_mismatch", "Inventory item must belong to organization")
    quantity_delta = Decimal(str(quantity_delta))
    reserved_delta = Decimal(str(reserved_delta))
    next_available = item.available_quantity + quantity_delta
    next_reserved = item.reserved_quantity + reserved_delta
    if next_available < 0:
        raise InventoryValidationError("negative_available_quantity", "Available quantity cannot be negative")
    if next_reserved < 0:
        raise InventoryValidationError("negative_reserved_quantity", "Reserved quantity cannot be negative")
    if next_reserved > next_available:
        raise InventoryValidationError("reserved_exceeds_available", "Reserved quantity cannot exceed available quantity")

    item.available_quantity = next_available
    item.reserved_quantity = next_reserved
    item.status = resolve_inventory_status(item)
    item.save(update_fields=["available_quantity", "reserved_quantity", "status", "updated_at"])
    InventoryMovement.objects.create(
        organization=organization,
        inventory_item=item,
        movement_type=movement_type,
        quantity_delta=quantity_delta,
        reserved_delta=reserved_delta,
        reason=reason,
        actor=actor,
        metadata=metadata or {},
    )
    return item
