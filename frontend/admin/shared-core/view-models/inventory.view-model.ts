import type {
  AdminInventoryAdjustmentInput,
  AdminInventoryItemFormInput,
  AdminInventoryItemView,
  AdminInventoryMovementView,
} from "../contracts/inventory.contract";

export interface AdminInventoryItemRowViewModel {
  id: string | number;
  productName: string;
  variantName: string | null;
  sku: string | null;
  status: string;
  availableQuantity: string;
  reservedQuantity: string;
  sellableQuantity: string;
  measurementUnitSymbol: string | null;
  isLowStock: boolean;
  updatedAt: string;
}

export interface AdminInventoryMovementRowViewModel {
  id: string | number;
  movementType: string;
  quantityDelta: string;
  reservedDelta: string;
  reason: string;
  actorEmail: string | null;
  createdAt: string;
}

export interface AdminInventoryViewModel {
  items: AdminInventoryItemRowViewModel[];
  totals: {
    items: number;
    available: number;
    limited: number;
    unavailable: number;
    disabled: number;
  };
}

export interface AdminInventoryItemFormViewModel {
  input: AdminInventoryItemFormInput;
  canSubmit: boolean;
  missingFields: Array<keyof AdminInventoryItemFormInput>;
}

export interface AdminInventoryAdjustmentViewModel {
  input: AdminInventoryAdjustmentInput;
  canSubmit: boolean;
  missingFields: Array<keyof AdminInventoryAdjustmentInput>;
}

function toNumber(quantity: string): number {
  const parsed = Number(quantity);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function createAdminInventoryItemRowViewModel(
  item: AdminInventoryItemView,
): AdminInventoryItemRowViewModel {
  return {
    id: item.id,
    productName: item.productName,
    variantName: item.variantName ?? null,
    sku: item.variantSku ?? null,
    status: item.status,
    availableQuantity: item.availableQuantity,
    reservedQuantity: item.reservedQuantity,
    sellableQuantity: item.sellableQuantity,
    measurementUnitSymbol: item.measurementUnitSymbol ?? null,
    isLowStock:
      item.status === "limited" ||
      (toNumber(item.lowStockThreshold) > 0 &&
        toNumber(item.sellableQuantity) <= toNumber(item.lowStockThreshold)),
    updatedAt: item.updatedAt,
  };
}

export function createAdminInventoryMovementRowViewModel(
  movement: AdminInventoryMovementView,
): AdminInventoryMovementRowViewModel {
  return {
    id: movement.id,
    movementType: movement.movementType,
    quantityDelta: movement.quantityDelta,
    reservedDelta: movement.reservedDelta,
    reason: movement.reason,
    actorEmail: movement.actorEmail ?? null,
    createdAt: movement.createdAt,
  };
}

export function createAdminInventoryViewModel(
  items: AdminInventoryItemView[],
): AdminInventoryViewModel {
  return {
    items: items.map(createAdminInventoryItemRowViewModel),
    totals: {
      items: items.length,
      available: items.filter((item) => item.status === "available").length,
      limited: items.filter((item) => item.status === "limited").length,
      unavailable: items.filter((item) => item.status === "unavailable").length,
      disabled: items.filter((item) => item.status === "disabled").length,
    },
  };
}

export function createAdminInventoryItemFormViewModel(
  input: AdminInventoryItemFormInput,
): AdminInventoryItemFormViewModel {
  const missingFields: Array<keyof AdminInventoryItemFormInput> = [];
  if (!input.productKey) missingFields.push("productKey");

  return {
    input,
    canSubmit: missingFields.length === 0,
    missingFields,
  };
}

export function createAdminInventoryAdjustmentViewModel(
  input: AdminInventoryAdjustmentInput,
): AdminInventoryAdjustmentViewModel {
  const missingFields: Array<keyof AdminInventoryAdjustmentInput> = [];
  if (!input.quantityDelta && !input.reservedDelta) missingFields.push("quantityDelta");

  return {
    input,
    canSubmit: missingFields.length === 0,
    missingFields,
  };
}
