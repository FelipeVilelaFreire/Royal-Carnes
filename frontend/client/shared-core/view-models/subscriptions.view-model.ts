import type {
  ClientPlanView,
  ClientSubscriptionCycleItemView,
  ClientSubscriptionCycleView,
  ClientSubscriptionView,
} from "../contracts/subscriptions.contract";

export interface ClientPlanCardViewModel {
  id: string | number;
  key: string;
  name: string;
  description: string;
  priceLabel: string | null;
  billingInterval: string;
  entitlementCount: number;
}

export interface ClientSubscriptionViewModel {
  subscription: ClientSubscriptionView | null;
  isActive: boolean;
  planName: string | null;
  planPriceLabel: string | null;
  currentCycleRange: string | null;
}

export interface ClientCycleViewModel {
  cycle: ClientSubscriptionCycleView | null;
  isOpen: boolean;
  selectedItems: ClientCycleItemViewModel[];
  totalItems: number;
  cycleNumber: number | null;
  rangeLabel: string | null;
  usage: ClientCycleUsageViewModel[];
}

export interface ClientCycleItemViewModel {
  id: string | number;
  entitlementKey: string;
  productKey: string | null;
  name: string;
  description: string;
  categoryLabel: string;
  imageUrl: string | null;
  quantityLabel: string;
  status: ClientSubscriptionCycleItemView["status"];
  priceLabel: string | null;
  unitLabel: string | null;
}

export interface ClientCycleUsageViewModel {
  key: string;
  valueLabel: string;
  used: number;
  limit: number;
}

function formatPrice(plan: ClientPlanView): string | null {
  const price = plan.prices[0];
  if (!price) return null;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: price.currency,
  }).format(price.amountCents / 100);
}

export function createClientPlanCardViewModel(plan: ClientPlanView): ClientPlanCardViewModel {
  return {
    id: plan.id,
    key: plan.key,
    name: plan.name,
    description: plan.description || "",
    priceLabel: formatPrice(plan),
    billingInterval: plan.billingInterval,
    entitlementCount: plan.entitlements.length,
  };
}

export function createClientPlansViewModel(plans: ClientPlanView[]): ClientPlanCardViewModel[] {
  return plans.map(createClientPlanCardViewModel);
}

export function createClientSubscriptionViewModel(
  subscription: ClientSubscriptionView | null,
): ClientSubscriptionViewModel {
  return {
    subscription,
    isActive: subscription?.status === "active",
    planName: subscription?.plan.name || null,
    planPriceLabel: subscription?.plan ? formatPrice(subscription.plan) : null,
    currentCycleRange:
      subscription?.currentCycleStartsAt && subscription.currentCycleEndsAt
        ? `${subscription.currentCycleStartsAt} - ${subscription.currentCycleEndsAt}`
        : null,
  };
}

const readString = (value: unknown): string | null => (typeof value === "string" && value.trim() ? value : null);
const readNumber = (value: unknown): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const formatQuantity = (quantity: string, unit?: string | null) => {
  const suffix = unit ? ` ${unit}` : "";
  return `${quantity}${suffix}`;
};

function createCycleItemViewModel(item: ClientSubscriptionCycleItemView): ClientCycleItemViewModel {
  const metadata = item.metadata || {};
  return {
    id: item.id,
    entitlementKey: item.entitlementKey,
    productKey: item.productKey || null,
    name: readString(metadata.name) || item.productKey || String(item.id),
    description: readString(metadata.description) || "",
    categoryLabel: readString(metadata.categoryLabel) || item.entitlementKey,
    imageUrl: readString(metadata.imageUrl),
    quantityLabel: formatQuantity(item.quantity, readString(metadata.unitLabel) || item.measurementUnitKey),
    status: item.status,
    priceLabel: readString(metadata.priceLabel),
    unitLabel: readString(metadata.unitLabel) || item.measurementUnitKey || null,
  };
}

function createCycleUsage(cycle: ClientSubscriptionCycleView | null): ClientCycleUsageViewModel[] {
  const items = cycle?.items || [];
  const limits = ((cycle?.metadata || {}).usageLimits || {}) as Record<string, unknown>;
  const countSelected = (key: string) =>
    items.filter((item) => item.status === "selected" && item.entitlementKey === key).length;
  const sumQuantity = (key: string) =>
    items
      .filter((item) => item.status === "selected" && item.entitlementKey === key)
      .reduce((total, item) => total + readNumber(item.quantity), 0);

  return [
    { key: "cuts", used: countSelected("cuts"), limit: readNumber(limits.cuts) },
    { key: "protein", used: sumQuantity("cuts"), limit: readNumber(limits.protein) },
    { key: "charcoal", used: sumQuantity("charcoal"), limit: readNumber(limits.charcoal) },
    { key: "seasonings", used: countSelected("seasonings"), limit: readNumber(limits.seasonings) },
    { key: "sides", used: countSelected("sides"), limit: readNumber(limits.sides) },
    { key: "utensils", used: countSelected("utensils"), limit: readNumber(limits.utensils) },
  ].map((metric) => ({
    ...metric,
    valueLabel: `${metric.used} / ${metric.limit}`,
  }));
}

export function createClientCycleViewModel(
  cycle: ClientSubscriptionCycleView | null,
): ClientCycleViewModel {
  const selectedItems = (cycle?.items || [])
    .filter((item) => item.status === "selected")
    .map(createCycleItemViewModel);

  return {
    cycle,
    isOpen: cycle?.status === "open",
    selectedItems,
    totalItems: cycle?.items.length || 0,
    cycleNumber: cycle?.cycleNumber || null,
    rangeLabel: cycle ? `${cycle.startsAt} - ${cycle.endsAt}` : null,
    usage: createCycleUsage(cycle),
  };
}
