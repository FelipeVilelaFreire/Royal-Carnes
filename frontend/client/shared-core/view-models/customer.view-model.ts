import type { ClientCustomerProfile } from "../types/customer.types";
import type {
  ClientCustomerAccount,
  ClientCustomerCycleUsage,
  ClientCustomerDataSource,
  ClientCustomerPlanIncludedItem,
  ClientCustomerNotificationPreferences,
  ClientCustomerPlan,
  ClientCustomerSubscriptionTier,
} from "../contracts/customer.contract";
import type { ClientPlanView, ClientSubscriptionCycleView, ClientSubscriptionView } from "../contracts/subscriptions.contract";
import type { ClientOrdersViewModel } from "./orders.view-model";

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
  label: string;
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

const readNumber = (value: unknown) => {
  const parsed = typeof value === "number" ? value : Number(String(value || "0").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatQuantity = (quantity: string, unit: string | null) => [quantity, unit || ""].filter(Boolean).join(" ");

export const createClientCustomerPlans = (plans: ClientPlanView[]): ClientCustomerPlan[] => plans.map((plan) => {
  const entitlements = plan.entitlements || [];
  const monthlyPrice = (plan.prices || []).find((price) => price.billingInterval === "month") || plan.prices?.[0];
  const includedItems: ClientCustomerPlanIncludedItem[] = entitlements.map((entitlement) => ({
    id: String(entitlement.id || entitlement.key),
    name: entitlement.targetName || entitlement.targetKey || entitlement.key,
    quantityLabel: formatQuantity(
      entitlement.quantity,
      entitlement.measurementUnitSymbol || entitlement.measurementUnitKey,
    ),
    selectionLimit: (() => {
      const limit = readNumber(entitlement.constraints?.maxSelections);
      return limit > 0 ? limit : null;
    })(),
  }));
  return {
    key: plan.key,
    name: plan.name,
    monthlyPrice: (monthlyPrice?.amountCents || 0) / 100,
    productSelectionLimit: 0,
    proteinKgLimit: 0,
    charcoalKgLimit: 0,
    seasoningSelectionLimit: 0,
    sideSelectionLimit: 0,
    utensilSelectionLimit: 0,
    includedItems,
    features: includedItems.map((item) => item.name),
  };
});

export const createClientCustomerCycleUsage = (
  subscription: ClientSubscriptionView | null,
  cycle: ClientSubscriptionCycleView | null,
): ClientCustomerCycleUsage | null => {
  if (!subscription) return null;
  const capacity = (cycle?.capacity || []).map((item) => ({
    key: item.key,
    label: item.label,
    selectionLabel: item.selectionLabel ?? null,
    usedQuantity: readNumber(item.usedQuantity),
    limitQuantity: readNumber(item.limitQuantity),
    measurementUnitSymbol: item.measurementUnitSymbol ?? item.measurementUnitKey ?? null,
    usedSelections: item.usedSelections,
    limitSelections: item.limitSelections ?? null,
  }));
  return {
    cycleLabel: cycle ? String(cycle.cycleNumber) : "",
    capacity,
    cutsUsed: 0,
    cutsLimit: 0,
    weightKgUsed: 0,
    weightKgLimit: 0,
    charcoalKgUsed: 0,
    charcoalKgLimit: 0,
    complementsUsed: 0,
    complementsLimit: 0,
    seasoningsUsed: 0,
    seasoningsLimit: 0,
    sidesUsed: 0,
    sidesLimit: 0,
    utensilsUsed: 0,
    utensilsLimit: 0,
  };
};

export const createClientCustomerRecentOrders = (ordersViewModel: ClientOrdersViewModel) => ordersViewModel.orders.map((order) => ({
  id: String(order.id),
  code: order.code,
  kindLabel: order.kindLabel,
  title: order.title,
  summary: order.summary,
  statusLabel: order.statusLabel,
  statusTone: order.statusTone === "danger" || order.statusTone === "success"
    ? order.statusTone
    : order.statusTone === "warning" ? "pending" : "active",
  createdAtLabel: order.createdAtLabel,
  estimateLabel: order.deliveryEstimateLabel,
  totalLabel: order.totalLabel,
  imageUrl: order.imageUrl,
}));

export const createClientCustomerAccountViewModel = ({
  dataSource,
  selectedPlanKey,
}: ClientCustomerAccountViewModelInput): ClientCustomerAccountViewModel => {
  const { customer, plans } = dataSource;
  const activePlan =
    plans.find((plan) => plan.key === selectedPlanKey) ||
    plans.find((plan) => plan.key === customer.activeSubscription?.planKey) || {
      key: "",
      name: "",
      monthlyPrice: 0,
      includedItems: [],
      productSelectionLimit: 0,
      proteinKgLimit: 0,
      charcoalKgLimit: 0,
      seasoningSelectionLimit: 0,
      sideSelectionLimit: 0,
      utensilSelectionLimit: 0,
      features: [],
    };
  const usage = dataSource.cycleUsage;
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
    usageMetrics: (usage?.capacity || []).flatMap((item) => {
      const unit = item.measurementUnitSymbol || "";
      const metrics: ClientCustomerUsageMetric[] = [];
      if (item.limitSelections !== null && item.limitSelections !== undefined) {
        metrics.push({
          key: `${item.key}-selections`,
          label: item.selectionLabel || item.label,
          valueLabel: `${item.usedSelections} / ${item.limitSelections}`,
          percent: clampPercent(item.usedSelections, item.limitSelections),
        });
      }
      metrics.push({
        key: `${item.key}-quantity`,
        label: item.label,
        valueLabel: `${item.usedQuantity}${unit} / ${item.limitQuantity}${unit}`,
        percent: clampPercent(item.usedQuantity, item.limitQuantity),
      });
      return metrics;
    }),
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
