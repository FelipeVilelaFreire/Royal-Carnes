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
  currentCycleRange: string | null;
}

export interface ClientCycleViewModel {
  cycle: ClientSubscriptionCycleView | null;
  isOpen: boolean;
  selectedItems: ClientSubscriptionCycleItemView[];
  totalItems: number;
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
    currentCycleRange:
      subscription?.currentCycleStartsAt && subscription.currentCycleEndsAt
        ? `${subscription.currentCycleStartsAt} - ${subscription.currentCycleEndsAt}`
        : null,
  };
}

export function createClientCycleViewModel(
  cycle: ClientSubscriptionCycleView | null,
): ClientCycleViewModel {
  return {
    cycle,
    isOpen: cycle?.status === "open",
    selectedItems: (cycle?.items || []).filter((item) => item.status === "selected"),
    totalItems: cycle?.items.length || 0,
  };
}
