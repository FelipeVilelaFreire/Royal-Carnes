import type { AdminDashboardSummaryView } from "../contracts/dashboard.contract";

export type AdminDashboardWidgetKey = "mrr" | "subscribers" | "deliveries" | "retention";
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
  statusTone: AdminDashboardTone;
}

export interface AdminDashboardViewModel {
  recentOrders: AdminDashboardRecentOrderViewModel[];
  widgets: AdminDashboardWidgetViewModel[];
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

function resolveOrderPlan(summary: AdminDashboardSummaryView, subscriptionId?: string | number | null): string | null {
  if (!subscriptionId) return null;
  return summary.subscriptions.find((subscription) => subscription.id === subscriptionId)?.plan.name || null;
}

function resolveOrderBox(summary: AdminDashboardSummaryView, orderId: string | number): string | null {
  const delivery = summary.deliveries.find((item) => item.orderId === orderId);
  return delivery?.code || delivery?.orderCode || null;
}

export function createAdminDashboardViewModel(
  summary: AdminDashboardSummaryView,
): AdminDashboardViewModel {
  const monthlyRevenueCents = resolveMonthlyPriceCents(summary);
  const activeSubscribers = summary.subscriptions.filter((subscription) => subscription.status === "active").length;
  const pendingDeliveries = summary.deliveries.filter((delivery) => {
    const status = summary.deliveryConfig?.statuses.find((item) => item.key === delivery.statusKey);
    return !status?.isTerminal;
  }).length;
  const finishedSubscriptions = summary.subscriptions.filter(
    (subscription) => subscription.status === "cancelled" || subscription.status === "past_due",
  ).length;
  const retentionRate = summary.subscriptions.length
    ? ((summary.subscriptions.length - finishedSubscriptions) / summary.subscriptions.length) * 100
    : 100;

  return {
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
    recentOrders: summary.orders
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((order) => ({
        box: resolveOrderBox(summary, order.id) || resolveKindLabel(summary, order.kindKey),
        date: formatDate(order.createdAt),
        id: order.code,
        member: order.customerName,
        plan: resolveOrderPlan(summary, order.subscriptionId) || resolveKindLabel(summary, order.kindKey),
        statusKey: order.statusKey,
        statusLabel: resolveStatusLabel(summary, order.statusKey),
        statusTone: resolveStatusTone(order.statusKey),
      })),
  };
}

