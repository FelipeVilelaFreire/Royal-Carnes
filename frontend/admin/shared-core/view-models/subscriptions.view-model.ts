import type {
  AdminPlanFormInput,
  AdminPlanView,
  AdminSubscriptionFormInput,
  AdminSubscriptionView,
  AdminSubscriptionCycleView,
} from "../contracts/subscriptions.contract";

export interface AdminPlanRowViewModel {
  id: string | number;
  key: string;
  name: string;
  description: string | null;
  status: string;
  statusLabelKey: string;
  priceCents: number | null;
  priceLabel: string | null;
  billingInterval: string;
  billingIntervalLabelKey: string;
  trialDays: number;
  sortOrder: number;
  entitlementCount: number;
  entitlementSummary: string;
  subscriberCount: number;
  activeSubscriberCount: number;
  subscriberSummary: string;
}

export interface AdminSubscriptionRowViewModel {
  id: string | number;
  customerName: string;
  planName: string;
  status: string;
  startedAt: string;
  currentCycleEndsAt: string | null;
}

export interface AdminCycleRowViewModel {
  id: string | number;
  cycleNumber: number;
  status: string;
  startsAt: string;
  endsAt: string;
  itemCount: number;
}

export interface AdminSubscriptionsViewModel {
  plans: AdminPlanRowViewModel[];
  subscriptions: AdminSubscriptionRowViewModel[];
  cycles: AdminCycleRowViewModel[];
  totals: {
    plans: number;
    subscriptions: number;
    activeSubscriptions: number;
    openCycles: number;
  };
}

export interface AdminPlanFormViewModel {
  input: AdminPlanFormInput;
  canSubmit: boolean;
  missingFields: Array<keyof AdminPlanFormInput>;
}

export interface AdminSubscriptionFormViewModel {
  input: AdminSubscriptionFormInput;
  canSubmit: boolean;
  missingFields: Array<keyof AdminSubscriptionFormInput>;
}

function formatPrice(plan: AdminPlanView): string | null {
  const price = plan.prices[0];
  if (!price) return null;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: price.currency,
  }).format(price.amountCents / 100);
}

export function createAdminPlanRowViewModel(plan: AdminPlanView): AdminPlanRowViewModel {
  const firstEntitlements = plan.entitlements.slice(0, 3).map((entitlement) => {
    const targetName = entitlement.targetName || entitlement.targetKey || entitlement.key;
    const unit = entitlement.measurementUnitSymbol || entitlement.measurementUnitKey || "";
    return `${entitlement.quantity} ${unit} ${targetName}`.trim();
  });
  const firstSubscribers = plan.subscribers.slice(0, 5).map((subscriber) => subscriber.customerName);

  return {
    id: plan.id,
    key: plan.key,
    name: plan.name,
    description: plan.description ?? null,
    status: plan.status,
    statusLabelKey: `common.status${plan.status.charAt(0).toUpperCase()}${plan.status.slice(1)}`,
    priceCents: plan.prices[0]?.amountCents ?? null,
    priceLabel: formatPrice(plan),
    billingInterval: plan.billingInterval,
    billingIntervalLabelKey: `planos.billingIntervals.${plan.billingInterval}`,
    trialDays: plan.trialDays,
    sortOrder: plan.sortOrder,
    entitlementCount: plan.entitlements.length,
    entitlementSummary: firstEntitlements.length ? firstEntitlements.join(", ") : "",
    subscriberCount: plan.subscriberCount,
    activeSubscriberCount: plan.activeSubscriberCount,
    subscriberSummary: firstSubscribers.length ? firstSubscribers.join(", ") : "",
  };
}

export function createAdminSubscriptionRowViewModel(
  subscription: AdminSubscriptionView,
): AdminSubscriptionRowViewModel {
  return {
    id: subscription.id,
    customerName: subscription.customerName,
    planName: subscription.plan.name,
    status: subscription.status,
    startedAt: subscription.startedAt,
    currentCycleEndsAt: subscription.currentCycleEndsAt ?? null,
  };
}

export function createAdminCycleRowViewModel(
  cycle: AdminSubscriptionCycleView,
): AdminCycleRowViewModel {
  return {
    id: cycle.id,
    cycleNumber: cycle.cycleNumber,
    status: cycle.status,
    startsAt: cycle.startsAt,
    endsAt: cycle.endsAt,
    itemCount: cycle.items.length,
  };
}

export function createAdminSubscriptionsViewModel(input: {
  plans: AdminPlanView[];
  subscriptions: AdminSubscriptionView[];
  cycles: AdminSubscriptionCycleView[];
}): AdminSubscriptionsViewModel {
  return {
    plans: input.plans.map(createAdminPlanRowViewModel),
    subscriptions: input.subscriptions.map(createAdminSubscriptionRowViewModel),
    cycles: input.cycles.map(createAdminCycleRowViewModel),
    totals: {
      plans: input.plans.length,
      subscriptions: input.subscriptions.length,
      activeSubscriptions: input.subscriptions.filter(
        (subscription) => subscription.status === "active",
      ).length,
      openCycles: input.cycles.filter((cycle) => cycle.status === "open").length,
    },
  };
}

export function createAdminPlanFormViewModel(
  input: AdminPlanFormInput,
): AdminPlanFormViewModel {
  const missingFields: Array<keyof AdminPlanFormInput> = [];
  if (!input.key) missingFields.push("key");
  if (!input.name) missingFields.push("name");

  return {
    input,
    canSubmit: missingFields.length === 0,
    missingFields,
  };
}

export function createAdminSubscriptionFormViewModel(
  input: AdminSubscriptionFormInput,
): AdminSubscriptionFormViewModel {
  const missingFields: Array<keyof AdminSubscriptionFormInput> = [];
  if (!input.customerId) missingFields.push("customerId");
  if (!input.planKey) missingFields.push("planKey");

  return {
    input,
    canSubmit: missingFields.length === 0,
    missingFields,
  };
}
