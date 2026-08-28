export type SubscriptionTargetType = "collection" | "category" | "product" | "variant";

export type SubscriptionStatus = "active" | "paused" | "cancelled" | "past_due";

export type SubscriptionCycleStatus = "open" | "locked" | "fulfilled" | "skipped" | "cancelled";

export interface PlanPrice {
  id: number;
  currency: string;
  amount_cents: number;
  billing_interval: string;
  billing_interval_count: number;
  price_type: string;
}

export interface PlanEntitlement {
  id: number;
  key: string;
  target_type: SubscriptionTargetType;
  target_key: string;
  target_name: string | null;
  quantity: string;
  measurement_unit_key: string | null;
  measurement_unit_symbol: string | null;
  constraints: Record<string, unknown>;
  sort_order: number;
}

export interface SubscriptionPlan {
  id: number;
  key: string;
  name: string;
  description: string;
  status: string;
  billing_interval: string;
  trial_days: number;
  sort_order: number;
  prices: PlanPrice[];
  entitlements: PlanEntitlement[];
}

export interface SubscriptionCycleItem {
  id: number;
  entitlement_key: string;
  product_key: string | null;
  variant_sku: string | null;
  quantity: string;
  measurement_unit_key: string | null;
  status: string;
}

export interface SubscriptionCycle {
  id: number;
  cycle_number: number;
  status: SubscriptionCycleStatus;
  starts_at: string;
  ends_at: string;
  closed_at: string | null;
  items: SubscriptionCycleItem[];
}

export interface CustomerSubscription {
  id: number;
  customer_id: number;
  customer_name: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  started_at: string;
  ended_at: string | null;
  current_cycle_starts_at: string | null;
  current_cycle_ends_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string;
  cycles: SubscriptionCycle[];
}

export interface MySubscriptionResponse {
  subscription: CustomerSubscription | null;
}

export interface CurrentCycleResponse {
  cycle: SubscriptionCycle | null;
}

export interface AddCurrentCycleItemInput {
  entitlement_key: string;
  product_key?: string;
  variant_sku?: string;
  quantity: string;
  measurement_unit_key?: string;
}
