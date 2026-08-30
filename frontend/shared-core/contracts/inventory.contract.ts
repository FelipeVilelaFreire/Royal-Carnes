import type {
  MeasurementUnitKey,
  ProductKey,
  ProductVariantSku,
} from "../types/catalog.types";
import type {
  InventoryItemId,
  InventoryMovementId,
  InventoryMovementType,
  InventoryStatus,
  StockQuantity,
} from "../types/inventory.types";

export interface InventoryItemBase {
  id: InventoryItemId;
  productKey: ProductKey;
  productName: string;
  variantSku?: ProductVariantSku | null;
  variantName?: string | null;
  measurementUnitKey?: MeasurementUnitKey | null;
  measurementUnitSymbol?: string | null;
  availableQuantity: StockQuantity;
  reservedQuantity: StockQuantity;
  sellableQuantity: StockQuantity;
  lowStockThreshold: StockQuantity;
  status: InventoryStatus;
  notes: string;
  updatedAt: string;
}

export interface InventoryMovementBase {
  id: InventoryMovementId;
  movementType: InventoryMovementType;
  quantityDelta: StockQuantity;
  reservedDelta: StockQuantity;
  reason: string;
  metadata: Record<string, unknown>;
  actorEmail?: string | null;
  createdAt: string;
}

export interface InventoryItemFormInputBase {
  productKey: ProductKey;
  variantSku?: ProductVariantSku | "";
  measurementUnitKey?: MeasurementUnitKey;
  availableQuantity?: StockQuantity;
  reservedQuantity?: StockQuantity;
  lowStockThreshold?: StockQuantity;
  status?: InventoryStatus;
  notes?: string;
}

export interface InventoryAdjustmentInputBase {
  quantityDelta?: StockQuantity;
  reservedDelta?: StockQuantity;
  movementType?: InventoryMovementType;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export type InventoryErrorCode =
  | "inventory_reference_not_found"
  | "variant_product_mismatch"
  | "organization_mismatch"
  | "negative_available_quantity"
  | "negative_reserved_quantity"
  | "reserved_exceeds_available"
  | "permission_denied"
  | "network_error"
  | "unknown_error";
