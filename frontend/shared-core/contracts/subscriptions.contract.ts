import type {
  CommercialModeKey,
  MeasurementUnitKey,
  ProductKey,
  ProductVariantSku,
} from "../types/catalog.types";
import type { CustomerId } from "../types/identity.types";
import type {
  BillingInterval,
  EntitlementConstraints,
  EntitlementTargetType,
  PlanEntitlementId,
  PlanEntitlementKey,
  PlanId,
  PlanKey,
  PlanPriceId,
  PlanPriceType,
  PlanStatus,
  SubscriptionCycleId,
  SubscriptionCycleItemId,
  SubscriptionCycleItemStatus,
  SubscriptionCycleStatus,
  SubscriptionId,
  SubscriptionStatus,
} from "../types/subscriptions.types";

export interface PlanPriceBase {
  id: PlanPriceId;
  currency: string;
  amountCents: number;
  billingInterval: BillingInterval;
  billingIntervalCount: number;
  priceType: PlanPriceType;
}

export interface PlanEntitlementBase {
  id: PlanEntitlementId;
  key: PlanEntitlementKey;
  targetType: EntitlementTargetType;
  targetKey?: string | null;
  targetName?: string | null;
  quantity: string;
  measurementUnitKey?: MeasurementUnitKey | null;
  measurementUnitSymbol?: string | null;
  constraints: EntitlementConstraints;
  sortOrder: number;
}

export interface PlanBase {
  id: PlanId;
  key: PlanKey;
  name: string;
  description?: string | null;
  status: PlanStatus;
  billingInterval: BillingInterval;
  trialDays: number;
  sortOrder: number;
  prices: PlanPriceBase[];
  entitlements: PlanEntitlementBase[];
}

export interface SubscriptionCycleItemBase {
  id: SubscriptionCycleItemId;
  entitlementKey: PlanEntitlementKey;
  productKey?: ProductKey | null;
  variantSku?: ProductVariantSku | null;
  quantity: string;
  measurementUnitKey?: MeasurementUnitKey | null;
  status: SubscriptionCycleItemStatus;
}

export interface SubscriptionCycleBase {
  id: SubscriptionCycleId;
  cycleNumber: number;
  status: SubscriptionCycleStatus;
  startsAt: string;
  endsAt: string;
  closedAt?: string | null;
  items: SubscriptionCycleItemBase[];
}

export interface SubscriptionBase {
  id: SubscriptionId;
  customerId: CustomerId;
  customerName: string;
  plan: PlanBase;
  status: SubscriptionStatus;
  startedAt: string;
  endedAt?: string | null;
  currentCycleStartsAt?: string | null;
  currentCycleEndsAt?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  cycles: SubscriptionCycleBase[];
}

export interface CycleItemSelectionInputBase {
  entitlementKey: PlanEntitlementKey;
  productKey?: ProductKey;
  variantSku?: ProductVariantSku;
  quantity: string;
  measurementUnitKey?: MeasurementUnitKey;
}

export interface PlanEntitlementConstraintsShape {
  maxSelections?: number;
  maxQuantity?: string | number;
  minQuantity?: string | number;
  allowedCommercialModes?: CommercialModeKey[];
  requiresAvailability?: boolean;
  allowedAttributes?: Record<string, string[]>;
  [key: string]: unknown;
}

export type SubscriptionErrorCode =
  | "customer_not_found"
  | "subscription_not_found"
  | "current_cycle_not_found"
  | "selection_reference_not_found"
  | "product_required"
  | "target_mismatch"
  | "unit_mismatch"
  | "unit_required"
  | "quantity_exceeded"
  | "max_quantity_exceeded"
  | "max_selections_exceeded"
  | "attribute_not_allowed"
  | "unavailable"
  | "plan_entitlement_reference_not_found"
  | "subscription_reference_not_found"
  | "permission_denied"
  | "network_error"
  | "unknown_error";
