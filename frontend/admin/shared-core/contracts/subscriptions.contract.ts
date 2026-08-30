import type {
  CycleItemSelectionInputBase,
  PlanBase,
  SubscriptionBase,
  SubscriptionCycleBase,
} from "../../../shared-core";

export interface AdminPlanPriceDto {
  id: string | number;
  currency: string;
  amount_cents: number;
  billing_interval: "day" | "week" | "month" | "year";
  billing_interval_count: number;
  price_type: "recurring" | "trial" | "manual";
}

export interface AdminPlanEntitlementDto {
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

export interface AdminPlanDto {
  id: string | number;
  key: string;
  name: string;
  description?: string | null;
  status: "active" | "draft" | "archived";
  billing_interval: "day" | "week" | "month" | "year";
  trial_days?: number;
  sort_order?: number;
  prices?: AdminPlanPriceDto[];
  entitlements?: AdminPlanEntitlementDto[];
}

export interface AdminSubscriptionCycleItemDto {
  id: string | number;
  entitlement_key: string;
  product_key?: string | null;
  variant_sku?: string | null;
  quantity: string;
  measurement_unit_key?: string | null;
  status: "pending" | "selected" | "reserved" | "fulfilled" | "cancelled";
}

export interface AdminSubscriptionCycleDto {
  id: string | number;
  cycle_number: number;
  status: "open" | "locked" | "fulfilled" | "skipped" | "cancelled";
  starts_at: string;
  ends_at: string;
  closed_at?: string | null;
  items?: AdminSubscriptionCycleItemDto[];
}

export interface AdminSubscriptionDto {
  id: string | number;
  customer_id: string | number;
  customer_name: string;
  plan: AdminPlanDto;
  status: "active" | "paused" | "cancelled" | "past_due";
  started_at: string;
  ended_at?: string | null;
  current_cycle_starts_at?: string | null;
  current_cycle_ends_at?: string | null;
  cancelled_at?: string | null;
  cancel_reason?: string | null;
  cycles?: AdminSubscriptionCycleDto[];
}

export interface AdminPlanEntitlementFormInput {
  key: string;
  targetType: "collection" | "category" | "product" | "variant";
  targetKey: string;
  quantity: string;
  measurementUnitKey?: string;
  constraints?: Record<string, unknown>;
  sortOrder?: number;
}

export interface AdminPlanFormInput {
  key: string;
  name: string;
  description?: string;
  billingInterval?: "day" | "week" | "month" | "year";
  priceCents?: number;
  entitlements?: AdminPlanEntitlementFormInput[];
}

export interface AdminPlanCreateDto {
  key: string;
  name: string;
  description?: string;
  billing_interval?: "day" | "week" | "month" | "year";
  price_cents?: number;
  entitlements?: Array<{
    key: string;
    target_type: "collection" | "category" | "product" | "variant";
    target_key: string;
    quantity: string;
    measurement_unit_key?: string;
    constraints?: Record<string, unknown>;
    sort_order?: number;
  }>;
}

export interface AdminSubscriptionFormInput {
  customerId: string | number;
  planKey: string;
  status?: "active" | "paused" | "cancelled" | "past_due";
  startedAt?: string | null;
}

export interface AdminSubscriptionCreateDto {
  customer_id: string | number;
  plan_key: string;
  status?: "active" | "paused" | "cancelled" | "past_due";
  started_at?: string | null;
}

export type AdminCycleItemSelectionInput = CycleItemSelectionInputBase;
export type AdminPlanView = PlanBase;
export type AdminSubscriptionView = SubscriptionBase;
export type AdminSubscriptionCycleView = SubscriptionCycleBase;
