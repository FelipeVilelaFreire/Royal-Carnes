import type {
  CycleItemSelectionInputBase,
  PlanBase,
  SubscriptionBase,
  SubscriptionCycleBase,
  SubscriptionCycleItemBase,
} from "../../../shared-core";

export interface ClientPlanPriceDto {
  id: string | number;
  currency: string;
  amount_cents: number;
  billing_interval: "day" | "week" | "month" | "year";
  billing_interval_count: number;
  price_type: "recurring" | "trial" | "manual";
}

export interface ClientPlanEntitlementDto {
  id: string | number;
  key: string;
  target_type: "collection" | "category" | "product" | "variant";
  target_key?: string | null;
  target_name?: string | null;
  quantity: string;
  measurement_unit_key?: string | null;
  measurement_unit_symbol?: string | null;
  constraints?: Record<string, unknown>;
  sort_order?: number;
}

export interface ClientPlanDto {
  id: string | number;
  key: string;
  name: string;
  description?: string | null;
  status: "active" | "draft" | "archived";
  billing_interval: "day" | "week" | "month" | "year";
  trial_days?: number;
  sort_order?: number;
  prices?: ClientPlanPriceDto[];
  entitlements?: ClientPlanEntitlementDto[];
}

export interface ClientSubscriptionCycleItemDto {
  id: string | number;
  entitlement_key: string;
  product_key?: string | null;
  variant_sku?: string | null;
  quantity: string;
  measurement_unit_key?: string | null;
  status: "pending" | "selected" | "reserved" | "fulfilled" | "cancelled";
}

export interface ClientSubscriptionCycleDto {
  id: string | number;
  cycle_number: number;
  status: "open" | "locked" | "fulfilled" | "skipped" | "cancelled";
  starts_at: string;
  ends_at: string;
  closed_at?: string | null;
  items?: ClientSubscriptionCycleItemDto[];
}

export interface ClientSubscriptionDto {
  id: string | number;
  customer_id: string | number;
  customer_name: string;
  plan: ClientPlanDto;
  status: "active" | "paused" | "cancelled" | "past_due";
  started_at: string;
  ended_at?: string | null;
  current_cycle_starts_at?: string | null;
  current_cycle_ends_at?: string | null;
  cancelled_at?: string | null;
  cancel_reason?: string | null;
  cycles?: ClientSubscriptionCycleDto[];
}

export interface ClientSubscriptionResponseDto {
  subscription: ClientSubscriptionDto | null;
}

export interface ClientCurrentCycleResponseDto {
  cycle: ClientSubscriptionCycleDto | null;
}

export type ClientCycleItemSelectionInput = CycleItemSelectionInputBase;
export type ClientPlanView = PlanBase;
export type ClientSubscriptionView = SubscriptionBase;
export type ClientSubscriptionCycleView = SubscriptionCycleBase;
export type ClientSubscriptionCycleItemView = SubscriptionCycleItemBase;
