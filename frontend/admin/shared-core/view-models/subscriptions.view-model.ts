import type {
  AdminOrderConfigView,
  AdminOrderView,
} from "../contracts/orders.contract";
import type { AdminPaymentView } from "../contracts/payments.contract";
import type {
  AdminPlanFormInput,
  AdminPlanView,
  AdminSubscriptionFormInput,
  AdminSubscriptionView,
  AdminSubscriptionCycleView,
} from "../contracts/subscriptions.contract";
import { formatAdminDateTime } from "../formatters/date-time.formatter";

type SubscriptionStatusTone = "success" | "warning" | "danger" | "neutral";

function resolveSubscriptionStatusTone(status: "active" | "paused" | "cancelled" | "past_due"): SubscriptionStatusTone {
  if (status === "active") return "success";
  if (status === "paused" || status === "past_due") return "warning";
  return "danger";
}

function resolvePlanStatusTone(status: "active" | "draft" | "archived"): SubscriptionStatusTone {
  if (status === "active") return "success";
  if (status === "draft") return "warning";
  return "neutral";
}

export interface AdminPlanRowViewModel {
  id: string | number;
  key: string;
  name: string;
  description: string | null;
  accentColor: string;
  status: string;
  statusLabelKey: string;
  statusTone: SubscriptionStatusTone;
  priceCents: number | null;
  priceLabel: string | null;
  billingInterval: string;
  billingIntervalLabelKey: string;
  trialDays: number;
  deliveryMinBusinessDays: number;
  deliveryMaxBusinessDays: number;
  sortOrder: number;
  entitlementCount: number;
  entitlementSummary: string;
  capacitySummary: string;
  entitlements: AdminPlanFormInput["entitlements"];
  subscriberCount: number;
  activeSubscriberCount: number;
  subscriberSummary: string;
  subscribers: Array<{
    id: string | number;
    customerId: string | number;
    customerName: string;
    status: string;
    statusLabelKey: string;
    startedAt: string;
    currentCycleEndsAt: string | null;
  }>;
}

export interface AdminSubscriptionRowViewModel {
  id: string | number;
  cancelReason: string | null;
  cancelledAt: string | null;
  cancelledAtInput: string;
  currentCycleConsumedSummary: string;
  currentCycleEndsAt: string | null;
  currentCycleEndsAtInput: string;
  currentCycleWindow: string;
  currentCycleItems: Array<{
    id: string | number;
    item: string;
    quantityWithUnit: string;
    status: string;
    statusLabelKey: string;
  }>;
  currentCycleLimitSummary: string;
  currentCycleOrderSummary: string;
  currentCycleRemainingSummary: string;
  currentCycleStartsAt: string | null;
  currentCycleStartsAtInput: string;
  currentCycleUsageItems: Array<{
    id: string | number;
    item: string;
    selectedItems: string;
    usedWithLimit: string;
    remainingWithUnit: string;
  }>;
  currentCycleUsageSummary: string;
  customerId: string | number;
  customerName: string;
  defaultDeliveryAddressId: string | number | null;
  deliveryPreferences: string;
  deliveryWindow: string;
  endedAt: string | null;
  endedAtInput: string;
  internalNotes: string;
  orders: any[];
  payments: any[];
  planKey: string;
  planName: string;
  preferredDeliveryDay: string;
  status: string;
  statusLabelKey: string;
  statusTone: SubscriptionStatusTone;
  startedAt: string;
  startedAtInput: string;
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

function formatDateTimeInput(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (part: number) => String(part).padStart(2, "0");
  const datePart = [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join("-");
  return `${datePart}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDecimal(value: string | number | null | undefined): string {
  if (value === undefined || value === null || value === "") return "";
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return String(value);
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  }).format(parsed);
}

function formatMoney(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("pt-BR", {
    currency,
    style: "currency",
  }).format(amountCents / 100);
}

function resolveOrderStatusLabel(config: AdminOrderConfigView | null, statusKey: string): string {
  return config?.statuses.find((status) => status.key === statusKey)?.label || statusKey;
}

function formatOrderCount(count: number): string {
  return count === 1 ? "1 pedido" : `${count} pedidos`;
}

function resolvePaymentStatusLabelKey(status: string): string {
  return `common.status${status.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")}`;
}

function addQuantityByUnit(
  totals: Record<string, number>,
  quantity: string | number | null | undefined,
  unit: string | null | undefined,
): Record<string, number> {
  const parsed = Number(quantity);
  const unitKey = unit || "";
  if (!Number.isFinite(parsed) || !unitKey) return totals;
  return {
    ...totals,
    [unitKey]: (totals[unitKey] || 0) + parsed,
  };
}

function summarizeQuantities(totals: Record<string, number>): string {
  return Object.entries(totals)
    .filter(([, quantity]) => quantity > 0)
    .map(([unit, quantity]) => [formatDecimal(quantity), unit].filter(Boolean).join(" "))
    .join(", ");
}

function subtractQuantities(
  limitTotals: Record<string, number>,
  consumedTotals: Record<string, number>,
): Record<string, number> {
  return Object.fromEntries(
    Object.entries(limitTotals).map(([unit, quantity]) => [
      unit,
      Math.max(0, quantity - (consumedTotals[unit] || 0)),
    ]),
  );
}

function formatQuantityWithUnit(quantity: string | number | null | undefined, unit: string): string {
  return [formatDecimal(quantity), unit].filter(Boolean).join(" ");
}

export function createAdminPlanRowViewModel(plan: AdminPlanView): AdminPlanRowViewModel {
  const planEntitlements = plan.entitlements.filter((entitlement) => (
    entitlement.targetType === "category" && (entitlement.targetPath || []).length <= 1
  ));
  const entitlements = planEntitlements.map((entitlement) => {
    const targetName = entitlement.targetName || entitlement.targetKey || entitlement.key;
    return {
      constraints: entitlement.constraints,
      capacityKey: String(entitlement.constraints?.capacityKey || entitlement.key),
      capacityLabel: String(entitlement.constraints?.capacityLabel || targetName),
      hierarchyLabel: targetName,
      key: entitlement.key,
      maxSelections: entitlement.constraints?.maxSelections || "",
      measurementUnitKey: entitlement.measurementUnitKey || undefined,
      quantity: entitlement.quantity,
      sortOrder: entitlement.sortOrder,
      targetKey: entitlement.targetKey || "",
      targetType: entitlement.targetType,
    };
  });
  const capacitySummary = entitlements
    .filter((entitlement) => {
      const source = planEntitlements.find((item) => item.key === entitlement.key);
      return entitlement.targetType === "category" && (source?.targetPath || []).length <= 1;
    })
    .map((entitlement) => `${formatQuantityWithUnit(entitlement.quantity, entitlement.measurementUnitKey || "")} ${entitlement.capacityLabel}`.trim())
    .join(" · ");
  const firstEntitlements = planEntitlements.slice(0, 3).map((entitlement) => {
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
    accentColor: plan.accentColor,
    status: plan.status,
    statusLabelKey: `common.status${plan.status.charAt(0).toUpperCase()}${plan.status.slice(1)}`,
    statusTone: resolvePlanStatusTone(plan.status),
    priceCents: plan.prices[0]?.amountCents ?? null,
    priceLabel: formatPrice(plan),
    billingInterval: plan.billingInterval,
    billingIntervalLabelKey: `planos.billingIntervals.${plan.billingInterval}`,
    trialDays: plan.trialDays,
    deliveryMinBusinessDays: plan.deliveryMinBusinessDays,
    deliveryMaxBusinessDays: plan.deliveryMaxBusinessDays,
    sortOrder: plan.sortOrder,
    entitlementCount: planEntitlements.length,
    entitlementSummary: firstEntitlements.length ? firstEntitlements.join(", ") : "",
    capacitySummary,
    entitlements,
    subscriberCount: plan.subscriberCount,
    activeSubscriberCount: plan.activeSubscriberCount,
    subscriberSummary: firstSubscribers.length ? firstSubscribers.join(", ") : "",
    subscribers: plan.subscribers.map((subscriber) => ({
      id: subscriber.id,
      customerId: subscriber.customerId,
      customerName: subscriber.customerName,
      status: subscriber.status,
      statusLabelKey: `common.status${subscriber.status.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")}`,
      startedAt: formatAdminDateTime(subscriber.startedAt),
      currentCycleEndsAt: formatAdminDateTime(subscriber.currentCycleEndsAt) || null,
    })),
  };
}

export function createAdminSubscriptionRowViewModel(
  subscription: AdminSubscriptionView,
  orders: AdminOrderView[] = [],
  orderConfig: AdminOrderConfigView | null = null,
  payments: AdminPaymentView[] = [],
): AdminSubscriptionRowViewModel {
  const currentCycle = subscription.cycles.find((cycle) => cycle.status === "open") || subscription.cycles[0];
  const subscriptionOrders = orders.filter((order) => String(order.subscriptionId || "") === String(subscription.id));
  const subscriptionPayments = payments.filter((payment) => String(payment.subscriptionId || "") === String(subscription.id));
  const limitTotals = subscription.plan.entitlements.reduce<Record<string, number>>(
    (totals, entitlement) =>
      addQuantityByUnit(totals, entitlement.quantity, entitlement.measurementUnitKey),
    {},
  );
  const consumedTotals = (currentCycle?.items || []).reduce<Record<string, number>>(
    (totals, item) => addQuantityByUnit(totals, item.quantity, item.measurementUnitKey),
    {},
  );
  const currentCycleLimitSummary = summarizeQuantities(limitTotals);
  const currentCycleConsumedSummary = summarizeQuantities(consumedTotals);
  const currentCycleRemainingSummary = summarizeQuantities(subtractQuantities(limitTotals, consumedTotals));
  const currentCycleStartsAt = formatAdminDateTime(subscription.currentCycleStartsAt ?? currentCycle?.startsAt) || null;
  const currentCycleEndsAt = formatAdminDateTime(subscription.currentCycleEndsAt ?? currentCycle?.endsAt) || null;
  const currentCycleUsageItems = subscription.plan.entitlements.map((entitlement) => {
    const cycleItems = (currentCycle?.items || []).filter((item) => item.entitlementKey === entitlement.key);
    const unit = entitlement.measurementUnitSymbol || entitlement.measurementUnitKey || "";
    const consumed = cycleItems.reduce((total, item) => {
      const parsed = Number(item.quantity);
      return Number.isFinite(parsed) ? total + parsed : total;
    }, 0);
    const limit = Number(entitlement.quantity);
    const remaining = Number.isFinite(limit) ? Math.max(0, limit - consumed) : null;

    return {
      id: entitlement.id || entitlement.key,
      item: entitlement.targetName || entitlement.targetKey || entitlement.key,
      remainingWithUnit: remaining === null ? "" : formatQuantityWithUnit(remaining, unit),
      selectedItems: cycleItems
        .map((item) => item.productKey || item.variantSku || item.entitlementKey)
        .filter(Boolean)
        .join(", "),
      usedWithLimit: `${formatDecimal(consumed)} / ${formatQuantityWithUnit(entitlement.quantity, unit)}`,
    };
  });

  return {
    cancelReason: subscription.cancelReason ?? null,
    cancelledAt: formatAdminDateTime(subscription.cancelledAt) || null,
    cancelledAtInput: formatDateTimeInput(subscription.cancelledAt),
    currentCycleConsumedSummary,
    currentCycleEndsAt,
    currentCycleEndsAtInput: formatDateTimeInput(subscription.currentCycleEndsAt ?? currentCycle?.endsAt),
    currentCycleItems: (currentCycle?.items || []).map((item) => ({
      id: item.id,
      item: item.productKey || item.variantSku || item.entitlementKey,
      quantityWithUnit: [formatDecimal(item.quantity), item.measurementUnitKey].filter(Boolean).join(" "),
      status: item.status,
      statusLabelKey: `common.status${item.status.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")}`,
    })),
    currentCycleLimitSummary,
    currentCycleOrderSummary: formatOrderCount(subscriptionOrders.length),
    currentCycleRemainingSummary,
    currentCycleStartsAt,
    currentCycleStartsAtInput: formatDateTimeInput(subscription.currentCycleStartsAt ?? currentCycle?.startsAt),
    currentCycleWindow: [currentCycleStartsAt, currentCycleEndsAt].filter(Boolean).join(" - "),
    currentCycleUsageItems,
    currentCycleUsageSummary: currentCycleUsageItems
      .map((item) => `${item.item}: ${item.usedWithLimit}`)
      .join("; "),
    customerId: subscription.customerId,
    defaultDeliveryAddressId: subscription.defaultDeliveryAddressId ?? null,
    deliveryPreferences: subscription.deliveryPreferences || "",
    deliveryWindow: subscription.deliveryWindow || "",
    id: subscription.id,
    endedAt: formatAdminDateTime(subscription.endedAt) || null,
    endedAtInput: formatDateTimeInput(subscription.endedAt),
    internalNotes: subscription.internalNotes || "",
    orders: subscriptionOrders.map((order) => ({
      code: order.code,
      createdAt: formatAdminDateTime(order.createdAt),
      id: order.id,
      statusLabel: resolveOrderStatusLabel(orderConfig, order.statusKey),
      totalLabel: formatMoney(order.totalCents, order.currency),
    })),
    payments: subscriptionPayments.map((payment) => ({
      amountLabel: formatMoney(payment.amountCents, payment.currency),
      dueAt: formatAdminDateTime(payment.dueAt),
      id: payment.id,
      reference: payment.reference,
      statusLabelKey: resolvePaymentStatusLabelKey(payment.status),
    })),
    customerName: subscription.customerName,
    planKey: subscription.plan.key,
    planName: subscription.plan.name,
    preferredDeliveryDay: subscription.preferredDeliveryDay || "",
    status: subscription.status,
    statusLabelKey: `common.status${subscription.status.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")}`,
    statusTone: resolveSubscriptionStatusTone(subscription.status),
    startedAt: formatAdminDateTime(subscription.startedAt),
    startedAtInput: formatDateTimeInput(subscription.startedAt),
  };
}

export function createAdminCycleRowViewModel(
  cycle: AdminSubscriptionCycleView,
): AdminCycleRowViewModel {
  return {
    id: cycle.id,
    cycleNumber: cycle.cycleNumber,
    status: cycle.status,
    startsAt: formatAdminDateTime(cycle.startsAt),
    endsAt: formatAdminDateTime(cycle.endsAt),
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
