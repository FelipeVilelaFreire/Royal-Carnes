export type InventoryEntityId = string | number;
export type InventoryItemId = InventoryEntityId;
export type InventoryMovementId = InventoryEntityId;

export type InventoryStatus = "available" | "limited" | "unavailable" | "disabled";

export type InventoryMovementType =
  | "manualAdjustment"
  | "stockIn"
  | "stockOut"
  | "reservation"
  | "releaseReservation";

export type StockQuantity = string;
