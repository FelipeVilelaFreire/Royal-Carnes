import type { AdminDashboardSummaryView } from "../contracts/dashboard.contract";

export type AdminDashboardWidgetKey = "mrr" | "subscribers" | "deliveries" | "retention";
export type AdminDashboardMetricKey =
  | AdminDashboardWidgetKey
  | "orders"
  | "pastDueSubscriptions"
  | "cancelledSubscriptions"
  | "readyDeliveries"
  | "outForDelivery"
  | "openOrders";
export type AdminDashboardTone = "primary" | "success" | "warning" | "danger" | "neutral";

export interface AdminDashboardWidgetViewModel {
  helperKey: string;
  helperVariables: Record<string, string | number>;
  key: AdminDashboardWidgetKey;
  tone: AdminDashboardTone;
  value: string;
}

export interface AdminDashboardRecentOrderViewModel {
  box: string;
  date: string;
  id: string;
  member: string;
  plan: string;
  statusKey: string;
  statusLabel: string;
  statusColor: string;
  statusTone: AdminDashboardTone;
}

export interface AdminDashboardPlanViewModel {
  activeSubscribers: string;
  billingIntervalKey: string;
  entitlementCount: string;
  id: string;
  name: string;
  price: string;
  statusKey: string;
  statusColor: string;
  statusTone: AdminDashboardTone;
}

export interface AdminDashboardViewModel {
  metrics: Record<AdminDashboardMetricKey, string>;
  plans: AdminDashboardPlanViewModel[];
  recentOrders: AdminDashboardRecentOrderViewModel[];
  widgets: AdminDashboardWidgetViewModel[];
}

export interface AdminDashboardViewModelOptions {
  recentOrdersLimit?: number;
}

function formatMoney(amountCents: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    currency,
    style: "currency",
  }).format(amountCents / 100);
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function resolveMonthlyPriceCents(summary: AdminDashboardSummaryView): number {
  const activeSubscriptions = summary.subscriptions.filter((subscription) => subscription.status === "active");
  const subscriptionTotal = activeSubscriptions.reduce((total, subscription) => {
    const monthlyPrice = subscription.plan.prices.find(
      (price) =>
        price.priceType === "recurring" &&
        price.billingInterval === "month" &&
        price.billingIntervalCount === 1,
    );
    return total + (monthlyPrice?.amountCents || 0);
  }, 0);

  if (subscriptionTotal > 0) return subscriptionTotal;

  return summary.orders.reduce((total, order) => total + order.totalCents, 0);
}

function resolveKindLabel(summary: AdminDashboardSummaryView, kindKey: string): string {
  return summary.orderConfig?.kinds.find((kind) => kind.key === kindKey)?.label || kindKey;
}

function resolveStatusLabel(summary: AdminDashboardSummaryView, statusKey: string): string {
  return summary.orderConfig?.statuses.find((status) => status.key === statusKey)?.label || statusKey;
}

function resolveStatusTone(statusKey: string): AdminDashboardTone {
  if (statusKey === "delivered" || statusKey === "completed" || statusKey === "approved") return "success";
  if (statusKey === "cancelled" || statusKey === "canceled") return "danger";
  if (
    statusKey === "pending" ||
    statusKey === "preparing" ||
    statusKey === "packing" ||
    statusKey === "ready" ||
    statusKey === "separating" ||
    statusKey === "outForDelivery"
  ) {
    return "warning";
  }
  return "neutral";
}

function resolveStatusColor(statusKey: string): string {
  if (statusKey === "received") return "received";
  if (statusKey === "ready") return "ready";
  if (statusKey === "delivered" || statusKey === "completed" || statusKey === "approved") return "active";
  if (statusKey === "cancelled" || statusKey === "canceled") return "canceled";
  return "paused";
}

function resolveOrderPlan(summary: AdminDashboardSummaryView, subscriptionId?: string | number | null): string | null {
  if (!subscriptionId) return null;
  return summary.subscriptions.find((subscription) => subscription.id === subscriptionId)?.plan.name || null;
}

function resolveOrderBox(summary: AdminDashboardSummaryView, orderId: string | number): string | null {
  const delivery = summary.deliveries.find((item) => item.orderId === orderId);
  return delivery?.code || delivery?.orderCode || null;
}

function resolvePlanPriceCents(plan: AdminDashboardSummaryView["subscriptions"][number]["plan"]): number {
  return plan.prices.find(
    (price) => price.priceType === "recurring" && price.billingInterval === plan.billingInterval,
  )?.amountCents || 0;
}

function isDeliveryTerminal(summary: AdminDashboardSummaryView, statusKey: string): boolean {
  return Boolean(summary.deliveryConfig?.statuses.find((status) => status.key === statusKey)?.isTerminal);
}

function isOrderTerminal(summary: AdminDashboardSummaryView, statusKey: string): boolean {
  return Boolean(summary.orderConfig?.statuses.find((status) => status.key === statusKey)?.isTerminal);
}

export function createAdminDashboardViewModel(
  summary: AdminDashboardSummaryView,
  options: AdminDashboardViewModelOptions = {},
): AdminDashboardViewModel {
  const recentOrdersLimit = options.recentOrdersLimit || 10;
  const monthlyRevenueCents = resolveMonthlyPriceCents(summary);
  const activeSubscribers = summary.subscriptions.filter((subscription) => subscription.status === "active").length;
  const pendingDeliveries = summary.deliveries.filter((delivery) => !isDeliveryTerminal(summary, delivery.statusKey)).length;
  const finishedSubscriptions = summary.subscriptions.filter(
    (subscription) => subscription.status === "cancelled" || subscription.status === "past_due",
  ).length;
  const retentionRate = summary.subscriptions.length
    ? ((summary.subscriptions.length - finishedSubscriptions) / summary.subscriptions.length) * 100
    : 100;
  const pastDueSubscriptions = summary.subscriptions.filter((subscription) => subscription.status === "past_due").length;
  const cancelledSubscriptions = summary.subscriptions.filter((subscription) => subscription.status === "cancelled").length;
  const readyDeliveries = summary.deliveries.filter((delivery) => delivery.statusKey === "ready").length;
  const outForDelivery = summary.deliveries.filter((delivery) => delivery.statusKey === "outForDelivery").length;
  const openOrders = summary.orders.filter((order) => !isOrderTerminal(summary, order.statusKey)).length;

  return {
    metrics: {
      cancelledSubscriptions: String(cancelledSubscriptions),
      deliveries: String(pendingDeliveries),
      mrr: formatMoney(monthlyRevenueCents),
      openOrders: String(openOrders),
      orders: String(summary.orders.length),
      outForDelivery: String(outForDelivery),
      pastDueSubscriptions: String(pastDueSubscriptions),
      readyDeliveries: String(readyDeliveries),
      retention: `${retentionRate.toFixed(1)}%`,
      subscribers: String(activeSubscribers),
    },
    widgets: [
      {
        helperKey: "dashboard.kpiHelpers.mrr",
        helperVariables: { orders: summary.orders.length },
        key: "mrr",
        tone: "primary",
        value: formatMoney(monthlyRevenueCents),
      },
      {
        helperKey: "dashboard.kpiHelpers.activeSubscribers",
        helperVariables: { total: summary.subscriptions.length },
        key: "subscribers",
        tone: "success",
        value: String(activeSubscribers),
      },
      {
        helperKey: "dashboard.kpiHelpers.pendingDeliveries",
        helperVariables: { total: summary.deliveries.length },
        key: "deliveries",
        tone: "warning",
        value: String(pendingDeliveries),
      },
      {
        helperKey: "dashboard.kpiHelpers.retentionRate",
        helperVariables: { churn: `${(100 - retentionRate).toFixed(1)}%` },
        key: "retention",
        tone: "success",
        value: `${retentionRate.toFixed(1)}%`,
      },
    ],
    plans: Array.from(
      summary.subscriptions.reduce((plans, subscription) => {
        const existing = plans.get(subscription.plan.key);
        const isActive = subscription.status === "active";
        plans.set(subscription.plan.key, {
          activeSubscribers: (existing?.activeSubscribers || 0) + (isActive ? 1 : 0),
          plan: subscription.plan,
        });
        return plans;
      }, new Map<string, { activeSubscribers: number; plan: AdminDashboardSummaryView["subscriptions"][number]["plan"] }>()),
    )
      .map(([key, { activeSubscribers, plan }]) => ({
        activeSubscribers: String(activeSubscribers),
        billingIntervalKey: `dashboard.billingIntervals.${plan.billingInterval}`,
        entitlementCount: String(plan.entitlements.length),
        id: String(key),
        name: plan.name,
        price: formatMoney(resolvePlanPriceCents(plan)),
        statusKey: `dashboard.planStatuses.${plan.status}`,
        statusColor: plan.status === "active" ? "active" : plan.status === "draft" ? "paused" : "canceled",
        statusTone: plan.status === "active" ? "success" : plan.status === "draft" ? "warning" : "neutral",
      }))
      .sort((first, second) => second.activeSubscribers.localeCompare(first.activeSubscribers, "pt-BR", { numeric: true }))
      .slice(0, 3),
    recentOrders: summary.orders
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, recentOrdersLimit)
      .map((order) => ({
        box: resolveOrderBox(summary, order.id) || resolveKindLabel(summary, order.kindKey),
        date: formatDate(order.createdAt),
        id: order.code,
        member: order.customerName,
        plan: resolveOrderPlan(summary, order.subscriptionId) || resolveKindLabel(summary, order.kindKey),
        statusKey: order.statusKey,
        statusLabel: resolveStatusLabel(summary, order.statusKey),
        statusColor: resolveStatusColor(order.statusKey),
        statusTone: resolveStatusTone(order.statusKey),
      })),
  };
}
