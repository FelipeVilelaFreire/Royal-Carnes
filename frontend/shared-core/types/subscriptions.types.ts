export type SubscriptionEntityId = string | number;
export type PlanId = SubscriptionEntityId;
export type PlanPriceId = SubscriptionEntityId;
export type PlanEntitlementId = SubscriptionEntityId;
export type SubscriptionId = SubscriptionEntityId;
export type SubscriptionCycleId = SubscriptionEntityId;
export type SubscriptionCycleItemId = SubscriptionEntityId;

export type PlanKey = string;
export type PlanEntitlementKey = string;

export type BillingInterval = "day" | "week" | "month" | "year";
export type PlanStatus = "active" | "draft" | "archived";
export type PlanPriceType = "recurring" | "trial" | "manual";
export type EntitlementTargetType = "collection" | "category" | "product" | "variant";
export type SubscriptionStatus = "active" | "paused" | "cancelled" | "past_due";
export type SubscriptionCycleStatus = "open" | "locked" | "fulfilled" | "skipped" | "cancelled";
export type SubscriptionCycleItemStatus =
  | "pending"
  | "selected"
  | "reserved"
  | "fulfilled"
  | "cancelled";

export type EntitlementConstraints = Record<string, unknown>;
