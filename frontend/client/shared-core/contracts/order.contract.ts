/**
 * Real Backend DTO Contracts matching Django API & seeds
 */
export type BackendOrderKind = "delivery" | "subscription-cycle" | string;

export type BackendOrderStatus =
  | "received"
  | "approved"
  | "separating"
  | "ready"
  | "completed"
  | "cancelled"
  | string;

export interface OrderItemDto {
  id?: number | string;
  product_key: string;
  variant_sku?: string | null;
  measurement_unit_key?: string | null;
  name_snapshot?: string;
  quantity: string | number;
  unit_price_cents?: number;
  total_cents?: number;
  weight_grams?: number;
}

export interface OrderStatusHistoryDto {
  status_key: string;
  note?: string;
  created_at?: string;
}

export interface OrderDto {
  id: number | string;
  code: string;
  kind_key: string;
  status_key: string;
  customer_id?: number | string;
  customer_name?: string;
  address_id?: number | string;
  currency?: string;
  subtotal_cents?: number;
  discount_cents?: number;
  freight_cents?: number;
  total_cents?: number;
  notes?: string;
  items?: OrderItemDto[];
  status_history?: OrderStatusHistoryDto[];
  created_at?: string;
  updated_at?: string;
  // Fallback UI fields
  title?: string;
  summary?: string;
  imageUrl?: string;
  createdAtLabel?: string;
  delivery?: {
    addressId: string;
    estimateLabel: string;
    deliveryCode?: string;
    deliveredAtLabel?: string;
  };
  payment?: {
    methodLabel: string;
    status: "pending" | "paid" | "payOnDelivery";
    totalLabel: string;
  };
  cycleUsage?: any;
  timeline?: any[];
  rating?: {
    score: number;
    comment?: string;
  };
}

export interface CreateOrderPayload {
  kind_key: string;
  address_id?: string;
  notes?: string;
  items: Array<{
    product_key: string;
    variant_sku?: string;
    quantity: string | number;
  }>;
}

/**
 * Legacy UI Contract types (for backward compatibility)
 */
export type RoyalOrderKind = "subscriptionCycle" | "royalDelivery" | string;

export type RoyalOrderStatus =
  | "sentToStore"
  | "approved"
  | "preparing"
  | "outForDelivery"
  | "delivered"
  | "cancelled"
  | "received"
  | "separating"
  | "ready"
  | "completed"
  | string;

export interface OrderKindDefinition {
  key: string;
  label: string;
  requiresInventory?: boolean;
  createsDelivery?: boolean;
}

export interface OrderStatusDefinition {
  key: string;
  label: string;
  tone: "success" | "danger" | "pending" | "active";
  description?: string;
  isInitial?: boolean;
  isTerminal?: boolean;
  allowedNextKeys?: string[];
}

export interface RoyalOrderItem {
  id?: string;
  productId: string;
  name: string;
  category?: string;
  quantity: number;
  unitLabel: string;
  weightKg?: number;
  price: number;
}

export interface RoyalOrderTimelineEntry {
  status: string;
  label: string;
  dateLabel?: string;
  completed: boolean;
}

export interface RoyalOrderCycleUsage {
  cycleLabel: string;
  cutsUsed: number;
  cutsLimit: number;
  weightKgUsed: number;
  weightKgLimit: number;
  charcoalKgUsed: number;
  charcoalKgLimit: number;
  complementsUsed: number;
  complementsLimit: number;
  seasoningsUsed: number;
  seasoningsLimit: number;
  sidesUsed: number;
  sidesLimit: number;
  utensilsUsed: number;
  utensilsLimit: number;
}

export interface RoyalCustomerOrder {
  id: string;
  code: string;
  customerId: string;
  customerName?: string;
  kind: string;
  title: string;
  summary: string;
  imageUrl: string;
  status: string;
  createdAtLabel: string;
  createdAt?: string;
  subscriptionId?: string;
  boxId?: string;
  delivery: {
    addressId: string;
    estimateLabel: string;
    deliveryCode?: string;
    deliveredAtLabel?: string;
  };
  payment: {
    methodLabel: string;
    status: "pending" | "paid" | "payOnDelivery";
    totalLabel: string;
    currency?: string;
    subtotalCents?: number;
    discountCents?: number;
    freightCents?: number;
    totalCents?: number;
  };
  cycleUsage?: RoyalOrderCycleUsage;
  items: RoyalOrderItem[];
  timeline: RoyalOrderTimelineEntry[];
  rating?: {
    score: number;
    comment?: string;
  };
}

export interface OrderConfigResponse {
  kinds: OrderKindDefinition[];
  statuses: OrderStatusDefinition[];
}

export interface CreateOrderInput {
  kind: string;
  items: Array<{ productId: string; quantity: number }>;
  addressId: string;
  paymentMethod: string;
  notes?: string;
}
