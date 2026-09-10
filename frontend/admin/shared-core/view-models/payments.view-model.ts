import type {
  AdminOrderConfigView,
  AdminOrderView,
} from "../contracts/orders.contract";
import type { AdminPaymentView } from "../contracts/payments.contract";
import type { AdminSubscriptionView } from "../contracts/subscriptions.contract";

export interface AdminPaymentRowViewModel {
  id: string | number;
  reference: string;
  customerId: string | number;
  customerName: string;
  orderId: string | number | null;
  subscriptionId: string | number | null;
  subscriptionPlanName: string | null;
  orderCode: string | null;
  originLabelKey: string;
  relationReference: string;
  orderStatusLabel: string;
  orderTotalLabel: string;
  subscriptionStatusLabelKey: string;
  subscriptionCycleNumber: string;
  subscriptionCycleStatusLabelKey: string;
  status: string;
  statusLabelKey: string;
  amountCents: number;
  amountLabel: string;
  currency: string;
  dueAt: string | null;
  dueAtInput: string;
  paidAt: string | null;
  paidAtInput: string;
  notes: string;
  linkedOrders: Array<{
    id: string | number;
    code: string;
    statusLabel: string;
    totalLabel: string;
    createdAt: string;
  }>;
  linkedSubscriptions: Array<{
    id: string | number;
    customerName: string;
    planName: string;
    statusLabelKey: string;
    cycleNumber: string;
    cycleStatusLabelKey: string;
    cycleWindow: string;
  }>;
  events: Array<{
    id: string;
    eventLabelKey: string;
    statusLabelKey: string;
    date: string;
  }>;
}

function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatDateTimeInput(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (part: number) => String(part).padStart(2, "0");
  const datePart = [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join("-");
  return `${datePart}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatMoney(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("pt-BR", {
    currency,
    style: "currency",
  }).format(amountCents / 100);
}

function statusLabelKey(status: string): string {
  return `common.status${status.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")}`;
}

function resolveOrderStatusLabel(config: AdminOrderConfigView | null, statusKey: string): string {
  return config?.statuses.find((status) => status.key === statusKey)?.label || statusKey;
}

function resolveOriginLabelKey(payment: AdminPaymentView): string {
  if (payment.orderId && payment.subscriptionId) return "pagamentos.origins.subscriptionOrder";
  if (payment.subscriptionId) return "pagamentos.origins.subscription";
  if (payment.orderId) return "pagamentos.origins.order";
  return "pagamentos.origins.manual";
}

function resolveCycleWindow(startsAt: string | null | undefined, endsAt: string | null | undefined): string {
  return [formatDate(startsAt), formatDate(endsAt)].filter(Boolean).join(" - ");
}

export function createAdminPaymentRowViewModel(
  payment: AdminPaymentView,
  orders: AdminOrderView[] = [],
  orderConfig: AdminOrderConfigView | null = null,
  subscriptions: AdminSubscriptionView[] = [],
): AdminPaymentRowViewModel {
  const linkedOrder = orders.find((order) => String(order.id) === String(payment.orderId || ""));
  const linkedSubscription = subscriptions.find((subscription) =>
    String(subscription.id) === String(payment.subscriptionId || ""),
  );
  const currentCycle = linkedSubscription?.cycles.find((cycle) => cycle.status === "open")
    || linkedSubscription?.cycles[0]
    || null;
  const createdAt = formatDate(payment.createdAt) || payment.createdAt;
  const updatedAt = formatDate(payment.updatedAt) || payment.updatedAt;

  return {
    id: payment.id,
    reference: payment.reference,
    customerId: payment.customerId,
    customerName: payment.customerName,
    orderId: payment.orderId,
    subscriptionId: payment.subscriptionId,
    subscriptionPlanName: payment.subscriptionPlanName || linkedSubscription?.plan.name || null,
    orderCode: payment.orderCode,
    originLabelKey: resolveOriginLabelKey(payment),
    relationReference: payment.orderCode || payment.subscriptionPlanName || linkedSubscription?.plan.name || "",
    orderStatusLabel: linkedOrder ? resolveOrderStatusLabel(orderConfig, linkedOrder.statusKey) : "",
    orderTotalLabel: linkedOrder ? formatMoney(linkedOrder.totalCents, linkedOrder.currency) : "",
    subscriptionStatusLabelKey: linkedSubscription ? statusLabelKey(linkedSubscription.status) : "",
    subscriptionCycleNumber: currentCycle ? String(currentCycle.cycleNumber) : "",
    subscriptionCycleStatusLabelKey: currentCycle ? statusLabelKey(currentCycle.status) : "",
    status: payment.status,
    statusLabelKey: statusLabelKey(payment.status),
    amountCents: payment.amountCents,
    amountLabel: formatMoney(payment.amountCents, payment.currency),
    currency: payment.currency,
    dueAt: formatDate(payment.dueAt),
    dueAtInput: formatDateTimeInput(payment.dueAt),
    paidAt: formatDate(payment.paidAt),
    paidAtInput: formatDateTimeInput(payment.paidAt),
    notes: payment.notes,
    linkedOrders: linkedOrder ? [{
      code: linkedOrder.code,
      createdAt: formatDate(linkedOrder.createdAt) || linkedOrder.createdAt,
      id: linkedOrder.id,
      statusLabel: resolveOrderStatusLabel(orderConfig, linkedOrder.statusKey),
      totalLabel: formatMoney(linkedOrder.totalCents, linkedOrder.currency),
    }] : [],
    linkedSubscriptions: linkedSubscription ? [{
      customerName: linkedSubscription.customerName,
      cycleNumber: currentCycle ? String(currentCycle.cycleNumber) : "",
      cycleStatusLabelKey: currentCycle ? statusLabelKey(currentCycle.status) : "",
      cycleWindow: currentCycle ? resolveCycleWindow(currentCycle.startsAt, currentCycle.endsAt) : "",
      id: linkedSubscription.id,
      planName: linkedSubscription.plan.name,
      statusLabelKey: statusLabelKey(linkedSubscription.status),
    }] : [],
    events: [
      {
        date: createdAt,
        eventLabelKey: "pagamentos.events.created",
        id: "created",
        statusLabelKey: statusLabelKey(payment.status),
      },
      {
        date: updatedAt,
        eventLabelKey: "pagamentos.events.updated",
        id: "updated",
        statusLabelKey: statusLabelKey(payment.status),
      },
    ],
  };
}
