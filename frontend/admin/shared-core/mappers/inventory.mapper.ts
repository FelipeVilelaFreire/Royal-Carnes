import type {
  AdminInventoryAdjustmentDto,
  AdminInventoryAdjustmentInput,
  AdminInventoryItemDto,
  AdminInventoryItemFormInput,
  AdminInventoryItemUpsertDto,
  AdminInventoryMovementDto,
} from "../contracts/inventory.contract";
import type { InventoryItemBase, InventoryMovementBase } from "../../../shared-core";

export function mapAdminInventoryItemDto(dto: AdminInventoryItemDto): InventoryItemBase {
  return {
    id: dto.id,
    productKey: dto.product_key,
    productName: dto.product_name,
    variantSku: dto.variant_sku ?? null,
    variantName: dto.variant_name ?? null,
    measurementUnitKey: dto.measurement_unit_key ?? null,
    measurementUnitSymbol: dto.measurement_unit_symbol ?? null,
    availableQuantity: String(dto.available_quantity ?? "0.000"),
    reservedQuantity: String(dto.reserved_quantity ?? "0.000"),
    sellableQuantity: String(dto.sellable_quantity ?? "0.000"),
    lowStockThreshold: String(dto.low_stock_threshold ?? "0.000"),
    status: dto.status,
    notes: dto.notes ?? "",
    updatedAt: dto.updated_at,
  };
}

export function mapAdminInventoryMovementDto(
  dto: AdminInventoryMovementDto,
): InventoryMovementBase {
  return {
    id: dto.id,
    movementType: dto.movement_type,
    quantityDelta: String(dto.quantity_delta ?? "0.000"),
    reservedDelta: String(dto.reserved_delta ?? "0.000"),
    reason: dto.reason ?? "",
    metadata: dto.metadata || {},
    actorEmail: dto.actor_email ?? null,
    createdAt: dto.created_at,
  };
}

export function mapAdminInventoryItemFormInput(
  input: AdminInventoryItemFormInput,
): AdminInventoryItemUpsertDto {
  return {
    product_key: input.productKey,
    variant_sku: input.variantSku || undefined,
    measurement_unit_key: input.measurementUnitKey,
    available_quantity: input.availableQuantity,
    reserved_quantity: input.reservedQuantity,
    low_stock_threshold: input.lowStockThreshold,
    status: input.status,
    notes: input.notes,
  };
}

export function mapAdminInventoryAdjustmentInput(
  input: AdminInventoryAdjustmentInput,
): AdminInventoryAdjustmentDto {
  return {
    quantity_delta: input.quantityDelta,
    reserved_delta: input.reservedDelta,
    movement_type: input.movementType,
    reason: input.reason,
    metadata: input.metadata,
  };
}
