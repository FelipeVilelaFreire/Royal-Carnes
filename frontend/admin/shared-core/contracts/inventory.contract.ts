import type {
  InventoryAdjustmentInputBase,
  InventoryItemBase,
  InventoryItemFormInputBase,
  InventoryMovementBase,
  InventoryMovementType,
  InventoryStatus,
  StockQuantity,
} from "../../../shared-core";

export interface AdminInventoryItemDto {
  id: string | number;
  product_key: string;
  product_name: string;
  variant_sku?: string | null;
  variant_name?: string | null;
  measurement_unit_key?: string | null;
  measurement_unit_symbol?: string | null;
  available_quantity: StockQuantity;
  reserved_quantity: StockQuantity;
  sellable_quantity: StockQuantity;
  low_stock_threshold: StockQuantity;
  status: InventoryStatus;
  notes?: string;
  updated_at: string;
}

export interface AdminInventoryItemUpsertDto {
  product_key: string;
  variant_sku?: string;
  measurement_unit_key?: string;
  available_quantity?: StockQuantity;
  reserved_quantity?: StockQuantity;
  low_stock_threshold?: StockQuantity;
  status?: InventoryStatus;
  notes?: string;
}

export interface AdminInventoryAdjustmentDto {
  quantity_delta?: StockQuantity;
  reserved_delta?: StockQuantity;
  movement_type?: InventoryMovementType;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export interface AdminInventoryMovementDto {
  id: string | number;
  movement_type: InventoryMovementType;
  quantity_delta: StockQuantity;
  reserved_delta: StockQuantity;
  reason?: string;
  metadata?: Record<string, unknown>;
  actor_email?: string | null;
  created_at: string;
}

export interface AdminInventorySnapshot {
  items: AdminInventoryItemView[];
}

export type AdminInventoryItemView = InventoryItemBase;
export type AdminInventoryMovementView = InventoryMovementBase;
export type AdminInventoryItemFormInput = InventoryItemFormInputBase;
export type AdminInventoryAdjustmentInput = InventoryAdjustmentInputBase;
