import type {
  OrderBase,
  OrderConfigBase,
  OrderCreateInputBase,
  OrderItemBase,
  OrderKindBase,
  OrderStatusBase,
  OrderStatusHistoryBase,
} from "../../../shared-core";

export interface ClientOrderKindDto {
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

export interface ClientOrderStatusDto {
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

export interface ClientOrderConfigDto {
  kinds: ClientOrderKindDto[];
  statuses: ClientOrderStatusDto[];
}

export interface ClientOrderItemDto {
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

export interface ClientOrderStatusHistoryDto {
  id: string | number;
  from_status_key?: string;
  to_status_key: string;
  note?: string;
  actor_email?: string | null;
  created_at: string;
}

export interface ClientOrderDto {
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
  items?: ClientOrderItemDto[];
  status_history?: ClientOrderStatusHistoryDto[];
  created_at: string;
  updated_at: string;
}

export interface ClientOrderItemCreateDto {
  product_key: string;
  variant_sku?: string;
  quantity: string;
  source_type?: string;
  source_key?: string;
  metadata?: Record<string, unknown>;
}

export interface ClientOrderCreateDto {
  kind_key: string;
  address_id?: string | number | null;
  subscription_id?: string | number | null;
  subscription_cycle_id?: string | number | null;
  notes?: string;
  items: ClientOrderItemCreateDto[];
}

export type ClientOrderKindView = OrderKindBase;
export type ClientOrderStatusView = OrderStatusBase;
export type ClientOrderConfigView = OrderConfigBase;
export type ClientOrderItemView = OrderItemBase;
export type ClientOrderStatusHistoryView = OrderStatusHistoryBase;
export type ClientOrderView = OrderBase;
export type ClientOrderCreateInput = OrderCreateInputBase;
