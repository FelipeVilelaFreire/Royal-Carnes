import type {
  MeasurementUnitKey,
  ProductKey,
  ProductVariantSku,
} from "../types/catalog.types";
import type {
  OrderCode,
  OrderId,
  OrderItemId,
  OrderKindId,
  OrderKindKey,
  OrderQuantity,
  OrderSourceKey,
  OrderSourceType,
  OrderStatusHistoryId,
  OrderStatusId,
  OrderStatusKey,
} from "../types/orders.types";

export interface OrderKindBase {
  id: OrderKindId;
  key: OrderKindKey;
  label: string;
  commercialModeKey?: string | null;
  codeSequenceKey: string;
  requiresInventory: boolean;
  createsDelivery: boolean;
  isActive: boolean;
  sortOrder: number;
  metadata: Record<string, unknown>;
}

export interface OrderStatusBase {
  id: OrderStatusId;
  key: OrderStatusKey;
  label: string;
  sortOrder: number;
  isInitial: boolean;
  isTerminal: boolean;
  isPublic: boolean;
  allowedNextKeys: OrderStatusKey[];
  effects: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export interface OrderItemBase {
  id: OrderItemId;
  productKey: ProductKey;
  variantSku?: ProductVariantSku | null;
  measurementUnitKey?: MeasurementUnitKey | null;
  nameSnapshot: string;
  quantity: OrderQuantity;
  unitPriceCents: number;
  totalCents: number;
  weightGrams?: number | null;
  sourceType: OrderSourceType;
  sourceKey: OrderSourceKey;
  metadata: Record<string, unknown>;
}

export interface OrderStatusHistoryBase {
  id: OrderStatusHistoryId;
  fromStatusKey: OrderStatusKey | "";
  toStatusKey: OrderStatusKey;
  note: string;
  actorEmail?: string | null;
  createdAt: string;
}

export interface OrderBase {
  id: OrderId;
  code: OrderCode;
  kindKey: OrderKindKey;
  statusKey: OrderStatusKey;
  customerId: string | number;
  customerName: string;
  addressId?: string | number | null;
  subscriptionId?: string | number | null;
  subscriptionCycleId?: string | number | null;
  currency: string;
  subtotalCents: number;
  discountCents: number;
  freightCents: number;
  totalCents: number;
  notes: string;
  metadata: Record<string, unknown>;
  items: OrderItemBase[];
  statusHistory: OrderStatusHistoryBase[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemCreateInputBase {
  productKey: ProductKey;
  variantSku?: ProductVariantSku | "";
  quantity: OrderQuantity;
  sourceType?: OrderSourceType;
  sourceKey?: OrderSourceKey;
  metadata?: Record<string, unknown>;
}

export interface OrderCreateInputBase {
  kindKey: OrderKindKey;
  addressId?: string | number | null;
  subscriptionId?: string | number | null;
  subscriptionCycleId?: string | number | null;
  notes?: string;
  items: OrderItemCreateInputBase[];
}

export interface OrderConfigBase {
  kinds: OrderKindBase[];
  statuses: OrderStatusBase[];
}

export interface OrderTransitionInputBase {
  statusKey: OrderStatusKey;
  note?: string;
}

export type OrderErrorCode =
  | "customer_not_found"
  | "order_reference_not_found"
  | "order_not_found"
  | "order_status_not_found"
  | "order_initial_status_not_configured"
  | "customer_organization_mismatch"
  | "address_mismatch"
  | "subscription_organization_mismatch"
  | "subscription_cycle_organization_mismatch"
  | "order_items_required"
  | "product_price_not_found"
  | "inventory_item_not_found"
  | "variant_product_mismatch"
  | "order_item_quantity_invalid"
  | "order_status_terminal"
  | "order_status_transition_not_allowed"
  | "negative_available_quantity"
  | "negative_reserved_quantity"
  | "reserved_exceeds_available"
  | "permission_denied"
  | "network_error"
  | "unknown_error";
