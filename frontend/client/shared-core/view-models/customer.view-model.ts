import type { ClientCustomerProfile } from "../types/customer.types";
import type {
  ClientCustomerAccount,
  ClientCustomerCycleUsage,
  ClientCustomerDataSource,
  ClientCustomerNotificationPreferences,
  ClientCustomerPlan,
  ClientCustomerSubscriptionTier,
} from "../contracts/customer.contract";

export interface ClientCustomerViewModel {
  name: string;
  email: string | null;
  phone: string | null;
  primaryAddressLabel: string | null;
  addressCount: number;
}

export function createClientCustomerViewModel(
  customer: ClientCustomerProfile | null,
): ClientCustomerViewModel {
  const primaryAddress =
    customer?.addresses.find((address) => address.isDefault) ||
    customer?.addresses[0] ||
    null;

  return {
    name: customer?.name || "",
    email: customer?.email || null,
    phone: customer?.phone || null,
    primaryAddressLabel: primaryAddress?.label || null,
    addressCount: customer?.addresses.length || 0,
  };
}

export interface ClientCustomerUsageMetric {
  key: string;
  labelKey: string;
  valueLabel: string;
  percent: number;
}

export interface ClientCustomerAccountViewModel {
  activePlan: ClientCustomerPlan;
  activeSubscriptionLabel: string;
  customer: ClientCustomerAccount;
  initials: string;
  nextBillingLabel: string;
  nextDeliveryLabel: string;
  planPriceLabel: string;
  primaryAddressLabel: string;
  usageMetrics: ClientCustomerUsageMetric[];
}

export interface ClientCustomerAccountViewModelInput {
  dataSource: ClientCustomerDataSource;
  selectedPlanKey: ClientCustomerSubscriptionTier;
}

const clampPercent = (used: number, limit: number) => {
  if (limit <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((used / limit) * 100)));
};

const formatPlanPrice = (value: number) => value.toLocaleString("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const emptyCycleUsage = (plan: ClientCustomerPlan): ClientCustomerCycleUsage => ({
  cycleLabel: "Atual",
  cutsUsed: 0,
  cutsLimit: plan.productSelectionLimit,
  weightKgUsed: 0,
  weightKgLimit: plan.proteinKgLimit,
  charcoalKgUsed: 0,
  charcoalKgLimit: plan.charcoalKgLimit,
  complementsUsed: 0,
  complementsLimit: plan.seasoningSelectionLimit + plan.sideSelectionLimit,
  seasoningsUsed: 0,
  seasoningsLimit: plan.seasoningSelectionLimit,
  sidesUsed: 0,
  sidesLimit: plan.sideSelectionLimit,
  utensilsUsed: 0,
  utensilsLimit: plan.utensilSelectionLimit,
});

export const createClientCustomerAccountViewModel = ({
  dataSource,
  selectedPlanKey,
}: ClientCustomerAccountViewModelInput): ClientCustomerAccountViewModel => {
  const { customer, plans } = dataSource;
  const activePlan =
    plans.find((plan) => plan.key === selectedPlanKey) ||
    plans.find((plan) => plan.key === customer.activeSubscription?.planKey) ||
    plans[0] || {
      key: "",
      name: "",
      monthlyPrice: 0,
      productSelectionLimit: 0,
      proteinKgLimit: 0,
      charcoalKgLimit: 0,
      seasoningSelectionLimit: 0,
      sideSelectionLimit: 0,
      utensilSelectionLimit: 0,
      features: [],
    };
  const usage = dataSource.cycleUsage || emptyCycleUsage(activePlan);
  const primaryAddress = customer.addresses.find((address) => address.isPrimary) || customer.addresses[0];
  const firstName = customer.name.trim().split(" ")[0] || customer.name;
  const initials = customer.name
    .split(" ")
    .map((part) => part.trim().slice(0, 1))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return {
    activePlan,
    activeSubscriptionLabel: activePlan.name,
    customer,
    initials,
    nextBillingLabel: customer.activeSubscription?.nextBillingLabel || "",
    nextDeliveryLabel: customer.activeSubscription?.nextDeliveryLabel || "",
    planPriceLabel: formatPlanPrice(activePlan.monthlyPrice),
    primaryAddressLabel: primaryAddress ? `${primaryAddress.label} - ${primaryAddress.neighborhoodLine}` : "",
    usageMetrics: [
      {
        key: "cuts",
        labelKey: "cuts",
        valueLabel: `${usage.cutsUsed} / ${usage.cutsLimit}`,
        percent: clampPercent(usage.cutsUsed, usage.cutsLimit),
      },
      {
        key: "meat",
        labelKey: "meat",
        valueLabel: `${usage.weightKgUsed}kg / ${usage.weightKgLimit}kg`,
        percent: clampPercent(usage.weightKgUsed, usage.weightKgLimit),
      },
      {
        key: "charcoal",
        labelKey: "charcoal",
        valueLabel: `${usage.charcoalKgUsed}kg / ${usage.charcoalKgLimit}kg`,
        percent: clampPercent(usage.charcoalKgUsed, usage.charcoalKgLimit),
      },
      {
        key: "complements",
        labelKey: "complements",
        valueLabel: `${usage.complementsUsed} / ${usage.complementsLimit}`,
        percent: clampPercent(usage.complementsUsed, usage.complementsLimit),
      },
      {
        key: "utensils",
        labelKey: "utensils",
        valueLabel: `${usage.utensilsUsed} / ${usage.utensilsLimit}`,
        percent: clampPercent(usage.utensilsUsed, usage.utensilsLimit),
      },
    ],
  };
};

export const updateClientCustomerNotifications = (
  current: ClientCustomerNotificationPreferences,
  key: keyof ClientCustomerNotificationPreferences,
  value: boolean,
) => ({
  ...current,
  [key]: value,
});
