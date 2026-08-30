import type {
  OrderBase,
  OrderConfigBase,
  OrderCreateInputBase,
  OrderItemBase,
  OrderKindBase,
  OrderStatusBase,
  OrderStatusHistoryBase,
  OrderTransitionInputBase,
} from "../../../shared-core";

export interface AdminOrderKindDto {
  id: string | number;
  key: string;
  label: string;
  commercial_mode_key?: string | null;
  code_sequence_key: string;
  requires_inventory: boolean;
  creates_delivery: boolean;
  is_active: boolean;
  sort_order?: number;
  metadata?: Record<string, unknown>;
}

export interface AdminOrderStatusDto {
  id: string | number;
  key: string;
  label: string;
  sort_order?: number;
  is_initial: boolean;
  is_terminal: boolean;
  is_public: boolean;
  allowed_next_keys?: string[];
  effects?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface AdminOrderConfigDto {
  kinds: AdminOrderKindDto[];
  statuses: AdminOrderStatusDto[];
}

export interface AdminOrderItemDto {
  id: string | number;
  product_key: string;
  variant_sku?: string | null;
  measurement_unit_key?: string | null;
  name_snapshot: string;
  quantity: string;
  unit_price_cents: number;
  total_cents: number;
  weight_grams?: number | null;
  source_type?: string;
  source_key?: string;
  metadata?: Record<string, unknown>;
}

export interface AdminOrderStatusHistoryDto {
  id: string | number;
  from_status_key?: string;
  to_status_key: string;
  note?: string;
  actor_email?: string | null;
  created_at: string;
}

export interface AdminOrderDto {
  id: string | number;
  code: string;
  kind_key: string;
  status_key: string;
  customer_id: string | number;
  customer_name: string;
  address_id?: string | number | null;
  subscription_id?: string | number | null;
  subscription_cycle_id?: string | number | null;
  currency: string;
  subtotal_cents: number;
  discount_cents: number;
  freight_cents: number;
  total_cents: number;
  notes?: string;
  metadata?: Record<string, unknown>;
  items?: AdminOrderItemDto[];
  status_history?: AdminOrderStatusHistoryDto[];
  created_at: string;
  updated_at: string;
}

export interface AdminOrderItemCreateDto {
  product_key: string;
  variant_sku?: string;
  quantity: string;
  source_type?: string;
  source_key?: string;
  metadata?: Record<string, unknown>;
}

export interface AdminOrderCreateDto {
  customer_id: string | number;
  kind_key: string;
  address_id?: string | number | null;
  subscription_id?: string | number | null;
  subscription_cycle_id?: string | number | null;
  notes?: string;
  items: AdminOrderItemCreateDto[];
}

export interface AdminOrderCreateInput extends OrderCreateInputBase {
  customerId: string | number;
}

export interface AdminOrderTransitionDto {
  status_key: string;
  note?: string;
}

export type AdminOrderKindView = OrderKindBase;
export type AdminOrderStatusView = OrderStatusBase;
export type AdminOrderConfigView = OrderConfigBase;
export type AdminOrderItemView = OrderItemBase;
export type AdminOrderStatusHistoryView = OrderStatusHistoryBase;
export type AdminOrderView = OrderBase;
export type AdminOrderTransitionInput = OrderTransitionInputBase;
