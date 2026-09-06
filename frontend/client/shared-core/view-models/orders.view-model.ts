import type {
  ClientOrderConfigView,
  ClientOrderCreateInput,
  ClientOrderView,
} from "../contracts/orders.contract";

export interface ClientOrderRowViewModel {
  id: string | number;
  code: string;
  kindKey: string;
  kindLabel: string;
  statusKey: string;
  statusLabel: string;
  statusTone: "active" | "danger" | "pending" | "success";
  title: string;
  summary: string;
  imageUrl: string;
  totalLabel: string;
  deliveryEstimateLabel: string;
  deliveryCodeLabel: string;
  paymentMethodLabel: string;
  itemCount: number;
  canReview: boolean;
  createdAt: string;
  createdAtLabel: string;
  items: ClientOrderItemViewModel[];
  timelineSteps: ClientOrderTimelineStepViewModel[];
  cycleUsage: ClientOrderCycleUsageViewModel | null;
  rawOrder: ClientOrderView;
}

export interface ClientOrdersViewModel {
  orders: ClientOrderRowViewModel[];
  currentOrder: ClientOrderRowViewModel | null;
  nextSubscriptionOrder: ClientOrderRowViewModel | null;
  totals: {
    orders: number;
    deliveredOrders: number;
    activeOrders: number;
  };
}

export interface ClientOrderItemViewModel {
  id: string | number;
  name: string;
  quantityLabel: string;
  categoryLabel: string;
}

export interface ClientOrderTimelineStepViewModel {
  key: string;
  label: string;
  completed: boolean;
  isCurrent: boolean;
}

export interface ClientOrderCycleUsageMetricViewModel {
  key: string;
  labelKey: "charcoal" | "complements" | "cuts" | "protein" | "utensils";
  valueLabel: string;
}

export interface ClientOrderCycleUsageViewModel {
  cycleLabel: string;
  remainingLabel: string;
  metrics: ClientOrderCycleUsageMetricViewModel[];
}

export interface ClientOrderFormViewModel {
  input: ClientOrderCreateInput;
  canSubmit: boolean;
  missingFields: Array<keyof ClientOrderCreateInput>;
}

function formatMoney(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(amountCents / 100);
}

function resolveStatusLabel(config: ClientOrderConfigView | null, statusKey: string): string {
  return config?.statuses.find((status) => status.key === statusKey)?.label || statusKey;
}

function resolveKindLabel(config: ClientOrderConfigView | null, kindKey: string): string {
  return config?.kinds.find((kind) => kind.key === kindKey)?.label || kindKey;
}

function resolveStatusTone(statusKey: string): ClientOrderRowViewModel["statusTone"] {
  if (statusKey === "delivered") return "success";
  if (statusKey === "cancelled" || statusKey === "canceled") return "danger";
  if (statusKey === "sentToStore") return "pending";
  return "active";
}

function formatKg(value: number): string {
  return Number.isInteger(value) ? `${value}kg` : `${value.toFixed(1)}kg`;
}

function resolveMetadata<T>(order: ClientOrderView, key: string): T | undefined {
  return order.metadata?.[key] as T | undefined;
}

function resolveTotalLabel(order: ClientOrderView): string {
  const payment = resolveMetadata<{ totalLabel?: string }>(order, "payment");
  if (payment?.totalLabel) {
    const numericLike = /[\d]/.test(payment.totalLabel);
    return numericLike ? formatMoney(order.totalCents, order.currency) : payment.totalLabel;
  }
  return formatMoney(order.totalCents, order.currency);
}

function createTimelineSteps(
  order: ClientOrderView,
  config: ClientOrderConfigView | null,
): ClientOrderTimelineStepViewModel[] {
  const fallbackTimeline = resolveMetadata<Array<{ status: string; label: string; completed: boolean }>>(order, "timeline");
  const timeline = fallbackTimeline?.length
    ? fallbackTimeline.map((step) => ({
        key: step.status,
        label: step.label,
        completed: step.completed,
        isCurrent: step.status === order.statusKey,
      }))
    : (config?.statuses || []).map((status) => ({
        key: status.key,
        label: status.label,
        completed: status.sortOrder <= (config?.statuses.find((item) => item.key === order.statusKey)?.sortOrder || 0),
        isCurrent: status.key === order.statusKey,
      }));

  return timeline;
}

function createCycleUsageViewModel(order: ClientOrderView): ClientOrderCycleUsageViewModel | null {
  const usage = resolveMetadata<{
    cycleLabel: string;
    cutsUsed: number;
    cutsLimit: number;
    weightKgUsed: number;
    weightKgLimit: number;
    charcoalKgUsed: number;
    charcoalKgLimit: number;
    complementsUsed: number;
    complementsLimit: number;
    utensilsUsed: number;
    utensilsLimit: number;
  }>(order, "cycleUsage");

  if (!usage) return null;

  return {
    cycleLabel: usage.cycleLabel,
    remainingLabel: `${usage.cutsUsed} / ${usage.cutsLimit}`,
    metrics: [
      { key: "cuts", labelKey: "cuts", valueLabel: `${usage.cutsUsed} / ${usage.cutsLimit}` },
      { key: "protein", labelKey: "protein", valueLabel: `${formatKg(usage.weightKgUsed)} / ${formatKg(usage.weightKgLimit)}` },
      { key: "charcoal", labelKey: "charcoal", valueLabel: `${formatKg(usage.charcoalKgUsed)} / ${formatKg(usage.charcoalKgLimit)}` },
      { key: "complements", labelKey: "complements", valueLabel: `${usage.complementsUsed} / ${usage.complementsLimit}` },
      { key: "utensils", labelKey: "utensils", valueLabel: `${usage.utensilsUsed} / ${usage.utensilsLimit}` },
    ],
  };
}

export function createClientOrderRowViewModel(
  order: ClientOrderView,
  config: ClientOrderConfigView | null = null,
): ClientOrderRowViewModel {
  const delivery = resolveMetadata<{ estimateLabel?: string; deliveryCode?: string }>(order, "delivery");
  const payment = resolveMetadata<{ methodLabel?: string }>(order, "payment");
  const title = resolveMetadata<string>(order, "title") || order.code;
  const summary = resolveMetadata<string>(order, "summary") || order.notes;
  const imageUrl = resolveMetadata<string>(order, "imageUrl") || "";
  const createdAtLabel = resolveMetadata<string>(order, "createdAtLabel") || order.createdAt;

  return {
    id: order.id,
    code: order.code,
    kindKey: order.kindKey,
    kindLabel: resolveKindLabel(config, order.kindKey),
    statusKey: order.statusKey,
    statusLabel: resolveStatusLabel(config, order.statusKey),
    statusTone: resolveStatusTone(order.statusKey),
    title,
    summary,
    imageUrl,
    totalLabel: resolveTotalLabel(order),
    deliveryEstimateLabel: delivery?.estimateLabel || "",
    deliveryCodeLabel: delivery?.deliveryCode || "--",
    paymentMethodLabel: payment?.methodLabel || "",
    itemCount: order.items.length,
    canReview: order.statusKey === "delivered",
    createdAt: order.createdAt,
    createdAtLabel,
    items: order.items.map((item) => ({
      id: item.id,
      name: item.nameSnapshot,
      quantityLabel: `${item.quantity} - ${String(item.metadata?.unitLabel || item.measurementUnitKey || "")}`.trim(),
      categoryLabel: String(item.metadata?.category || item.sourceType || ""),
    })),
    timelineSteps: createTimelineSteps(order, config),
    cycleUsage: createCycleUsageViewModel(order),
    rawOrder: order,
  };
}

export function createClientOrdersViewModel(
  orders: ClientOrderView[],
  config: ClientOrderConfigView | null = null,
): ClientOrdersViewModel {
  const rows = orders.map((order) => createClientOrderRowViewModel(order, config));
  const currentOrder = rows.find((order) => order.kindKey === "royalDelivery" && order.statusTone !== "success") || rows[0] || null;
  const nextSubscriptionOrder = rows.find((order) => order.kindKey === "subscriptionCycle" && order.statusTone !== "success") || null;

  return {
    orders: rows,
    currentOrder,
    nextSubscriptionOrder,
    totals: {
      orders: rows.length,
      deliveredOrders: rows.filter((order) => order.statusTone === "success").length,
      activeOrders: rows.filter((order) => order.statusTone !== "success" && order.statusTone !== "danger").length,
    },
  };
}

export function createClientOrderFormViewModel(
  input: ClientOrderCreateInput,
): ClientOrderFormViewModel {
  const missingFields: Array<keyof ClientOrderCreateInput> = [];
  if (!input.kindKey) missingFields.push("kindKey");
  if (!input.items.length) missingFields.push("items");

  return {
    input,
    canSubmit: missingFields.length === 0,
    missingFields,
  };
}
