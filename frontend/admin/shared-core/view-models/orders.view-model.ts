import type {
  AdminOrderConfigView,
  AdminOrderCreateInput,
  AdminOrderTransitionInput,
  AdminOrderView,
} from "../contracts/orders.contract";
import type {
  AdminDeliveryConfigView,
  AdminDeliveryView,
} from "../contracts/deliveries.contract";
import type { AdminPaymentView } from "../contracts/payments.contract";
import { formatAdminDate, formatAdminDateTime } from "../formatters/date-time.formatter";
import { createAdminPaymentRowViewModel } from "./payments.view-model";

export interface AdminOrderRowViewModel {
  id: string | number;
  customerId: string | number;
  code: string;
  customerName: string;
  addressLabel: string;
  subscriptionCycleWindow: string;
  kindKey: string;
  kindLabel: string;
  workflowLabel: string;
  recurrenceLabel: string;
  deliveryStatusLabel: string;
  deliveryCode: string;
  deliveryDeadline: string;
  deliveryDeadlineSortValue: string;
  deliveryPromiseState: string;
  deliveryPromisePriority: number;
  deliveryPromiseStatusLabelKey: string;
  deliveryPromiseStatusTone: "danger" | "neutral" | "success" | "warning";
  deliveryBusinessDays: number | null;
  paymentStatusLabelKey: string;
  paymentReference: string;
  subscriptionCycleLabel: string;
  subscriptionCycleStatus: string;
  subscriptionCycleStatusLabelKey: string;
  subscriptionId: string | number | null;
  subscriptionCycleId: string | number | null;
  boxCycleId: string | number | null;
  boxCycleLabel: string;
  boxCycleScheduledFor: string;
  boxCycleStatus: string;
  boxTemplateName: string;
  boxOrderCreationPolicy: string;
  boxOrderCreationPolicyLabelKey: string;
  boxRecurrenceDay: string;
  boxCycleStatusLabelKey: string;
  statusKey: string;
  statusLabel: string;
  statusLabelKey: string;
  statusColor?: string;
  statusTone?: "danger" | "neutral" | "success" | "warning";
  totalLabel: string;
  totalCents: number;
  totalFormatted: string;
  summary: string;
  itemCount: number;
  items: Array<AdminOrderView["items"][number] & {
    quantityLabel: string;
    sourceTypeLabelKey: string;
    totalFormatted: string;
    unitPriceFormatted: string;
  }>;
  deliveries: Array<{
    id: string | number;
    code: string;
    statusLabel: string;
    statusTone?: "danger" | "neutral" | "primary" | "success" | "warning";
    address: string;
    confirmationCode: string;
    promisedDeliveryStartsOn: string;
    promisedDeliveryByOn: string;
    deliveryPromiseStatusLabelKey: string;
    deliveryPromiseStatusTone: "danger" | "neutral" | "success" | "warning";
    deliveryBusinessDays: number | null;
    notes: string;
  }>;
  payments: Array<{
    id: string | number;
    reference: string;
    statusLabelKey: string;
    amountLabel: string;
    dueAt: string | null;
    paidAt: string | null;
  }>;
  statusHistory: AdminOrderView["statusHistory"];
  createdAt: string;
}

export interface AdminOrdersViewModel {
  orders: AdminOrderRowViewModel[];
  totals: {
    orders: number;
    byStatus: Record<string, number>;
  };
}

export interface AdminOrderFormViewModel {
  input: AdminOrderCreateInput;
  canSubmit: boolean;
  missingFields: Array<keyof AdminOrderCreateInput>;
}

export interface AdminOrderTransitionViewModel {
  input: AdminOrderTransitionInput;
  canSubmit: boolean;
  missingFields: Array<keyof AdminOrderTransitionInput>;
  allowedNextStatuses: Array<{ key: string; label: string }>;
}

function formatMoney(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(amountCents / 100);
}

function formatQuantity(quantity: string, measurementUnitKey?: string | null): string {
  const parsedQuantity = Number(quantity);
  const quantityLabel = Number.isFinite(parsedQuantity)
    ? new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 3 }).format(parsedQuantity)
    : quantity;
  return [quantityLabel, measurementUnitKey].filter(Boolean).join(" ");
}

function resolveKindLabel(config: AdminOrderConfigView | null, kindKey: string): string {
  return config?.kinds.find((kind) => kind.key === kindKey)?.label || kindKey;
}

function resolveStatusLabel(config: AdminOrderConfigView | null, statusKey: string): string {
  return config?.statuses.find((status) => status.key === statusKey)?.label || statusKey;
}

function resolveStatusPresentation(
  config: AdminOrderConfigView | null,
  statusKey: string,
): Pick<AdminOrderRowViewModel, "statusColor" | "statusTone"> {
  const metadata = config?.statuses.find((status) => status.key === statusKey)?.metadata;
  const presentation = metadata?.ui;
  if (!presentation || typeof presentation !== "object") return {};

  const { statusColor, statusTone } = presentation as Record<string, unknown>;
  return {
    statusColor: typeof statusColor === "string" ? statusColor : undefined,
    statusTone:
      statusTone === "danger" || statusTone === "neutral" || statusTone === "success" || statusTone === "warning"
        ? statusTone
        : undefined,
  };
}

function resolveDeliveryStatusLabel(
  config: AdminDeliveryConfigView | null,
  statusKey: string,
): string {
  return config?.statuses.find((status) => status.key === statusKey)?.label || statusKey;
}

function resolveDeliveryStatusPresentation(
  config: AdminDeliveryConfigView | null,
  statusKey: string,
): { statusColor?: string; statusTone?: "danger" | "neutral" | "primary" | "success" | "warning" } {
  const presentation = config?.statuses.find((status) => status.key === statusKey)?.metadata?.ui;
  if (!presentation || typeof presentation !== "object") return {};
  const { statusColor, statusTone } = presentation as Record<string, unknown>;
  return {
    statusColor: typeof statusColor === "string" ? statusColor : undefined,
    statusTone: statusTone === "danger" || statusTone === "neutral" || statusTone === "primary" || statusTone === "success" || statusTone === "warning"
      ? statusTone
      : undefined,
  };
}

function resolveDeliveryPromisePresentation(state: string) {
  const toneByState = {
    approaching: "warning",
    closed: "neutral",
    due_today: "warning",
    fulfilled: "success",
    on_track: "success",
    overdue: "danger",
    untracked: "neutral",
  } as const;
  const priorityByState: Record<string, number> = {
    overdue: 0,
    due_today: 1,
    approaching: 2,
    on_track: 3,
    untracked: 4,
    fulfilled: 5,
    closed: 6,
  };
  return {
    labelKey: `pedidos.deliveryPromise.states.${state}`,
    tone: toneByState[state as keyof typeof toneByState] || "neutral",
    priority: priorityByState[state] ?? 4,
  };
}

function formatAddressSnapshot(snapshot: Record<string, unknown>): string {
  const addressParts = [
    snapshot.street,
    snapshot.number,
    snapshot.neighborhood,
    snapshot.city,
    snapshot.state,
    snapshot.zipCode || snapshot.zip_code,
  ];
  return addressParts.map((part) => String(part || "").trim()).filter(Boolean).join(", ");
}

function resolveOrderItemSourceLabelKey(sourceType: string): string {
  return sourceType ? `pedidos.items.sourceTypes.${sourceType}` : "";
}

export function createAdminOrderRowViewModel(
  order: AdminOrderView,
  config: AdminOrderConfigView | null = null,
  deliveries: AdminDeliveryView[] = [],
  deliveryConfig: AdminDeliveryConfigView | null = null,
  payments: AdminPaymentView[] = [],
): AdminOrderRowViewModel {
  const relatedDeliveries = deliveries.filter((delivery) => String(delivery.orderId) === String(order.id));
  const relatedPayments = payments.filter((payment) => String(payment.orderId || "") === String(order.id));
  const primaryDelivery = relatedDeliveries[0] || null;
  const primaryPayment = relatedPayments[0] || null;
  const paymentRow = primaryPayment ? createAdminPaymentRowViewModel(primaryPayment) : null;
  const deliveryPromise = primaryDelivery?.deliveryPromiseStatus || { state: "untracked", remainingBusinessDays: null };
  const deliveryPromisePresentation = resolveDeliveryPromisePresentation(deliveryPromise.state);
  const isSubscriptionCycle = order.kindKey === "subscription-cycle" && Boolean(order.subscriptionId || order.subscriptionCycleId);
  const isRoyalBox = order.kindKey === "royal-box";
  const isBoxCycle = Boolean(order.boxCycleId);
  const subscriptionCycleLabel = order.subscriptionCycleNumber
    ? String(order.subscriptionCycleNumber)
    : "";
  const recurrenceLabel = isSubscriptionCycle
    ? [order.subscriptionPlanName, subscriptionCycleLabel].filter(Boolean).join(" - ")
    : isRoyalBox
      ? [order.boxTemplateName, order.boxCycleKey].filter(Boolean).join(" - ")
      : "";
  const totalLabel = formatMoney(order.totalCents, order.currency);
  const statusPresentation = resolveStatusPresentation(config, order.statusKey);
  const kindLabel = resolveKindLabel(config, order.kindKey);
  const workflowLabel = isSubscriptionCycle
    ? order.subscriptionPlanName || kindLabel
    : kindLabel;

  return {
    id: order.id,
    customerId: order.customerId,
    code: order.code,
    customerName: order.customerName,
    addressLabel: order.addressLabel || "",
    subscriptionCycleWindow: isSubscriptionCycle ? [formatAdminDateTime(order.subscriptionCycleStartsAt), formatAdminDateTime(order.subscriptionCycleEndsAt)].filter(Boolean).join(" - ") : "",
    kindKey: order.kindKey,
    kindLabel,
    workflowLabel,
    recurrenceLabel,
    deliveryCode: primaryDelivery?.code || "",
    deliveryDeadline: primaryDelivery?.promisedDeliveryByOn
      ? formatAdminDate(primaryDelivery.promisedDeliveryByOn)
      : "",
    deliveryDeadlineSortValue: primaryDelivery?.promisedDeliveryByOn || "",
    deliveryPromiseState: deliveryPromise.state,
    deliveryPromisePriority: deliveryPromisePresentation.priority,
    deliveryPromiseStatusLabelKey: deliveryPromisePresentation.labelKey,
    deliveryPromiseStatusTone: deliveryPromisePresentation.tone,
    deliveryBusinessDays: deliveryPromise.remainingBusinessDays === null
      ? null
      : Math.abs(deliveryPromise.remainingBusinessDays),
    deliveryStatusLabel: primaryDelivery
      ? resolveDeliveryStatusLabel(deliveryConfig, primaryDelivery.statusKey)
      : "",
    paymentReference: primaryPayment?.reference || "",
    paymentStatusLabelKey: paymentRow?.statusLabelKey || "",
    subscriptionCycleLabel,
    subscriptionCycleStatus: order.subscriptionCycleStatus || "",
    subscriptionCycleStatusLabelKey: order.subscriptionCycleStatus ? `pedidos.subscriptionCycleStatuses.${order.subscriptionCycleStatus}` : "",
    subscriptionId: order.subscriptionId ?? null,
    subscriptionCycleId: order.subscriptionCycleId ?? null,
    boxCycleId: order.boxCycleId ?? null,
    boxCycleLabel: order.boxCycleKey || "",
    boxCycleScheduledFor: formatAdminDateTime(order.boxCycleScheduledFor),
    boxCycleStatus: order.boxCycleStatus || "",
    boxCycleStatusLabelKey: order.boxCycleStatus ? `pedidos.boxCycleStatuses.${order.boxCycleStatus}` : "",
    boxTemplateName: order.boxTemplateName || "",
    boxOrderCreationPolicy: order.boxOrderCreationPolicy || "",
    boxOrderCreationPolicyLabelKey: order.boxOrderCreationPolicy ? `pedidos.boxOrderCreationPolicies.${order.boxOrderCreationPolicy}` : "",
    boxRecurrenceDay: isRoyalBox && typeof order.boxRecurrenceDay === "number"
      ? String(order.boxRecurrenceDay)
      : isRoyalBox
        ? "-"
        : "",
    statusKey: order.statusKey,
    statusLabel: resolveStatusLabel(config, order.statusKey),
    statusLabelKey: `common.status${order.statusKey.charAt(0).toUpperCase()}${order.statusKey.slice(1)}`,
    ...statusPresentation,
    totalLabel,
    totalCents: order.totalCents,
    totalFormatted: totalLabel,
    summary: order.items.map((item) => `${item.nameSnapshot} x ${item.quantity}`).join(", "),
    itemCount: order.items.length,
    items: order.items.map((item) => ({
      ...item,
      quantityLabel: formatQuantity(item.quantity, item.measurementUnitKey),
      sourceTypeLabelKey: resolveOrderItemSourceLabelKey(item.sourceType),
      totalFormatted: formatMoney(item.totalCents, order.currency),
      unitPriceFormatted: formatMoney(item.unitPriceCents, order.currency),
    })),
    deliveries: relatedDeliveries.map((delivery) => {
      const promise = delivery.deliveryPromiseStatus || { state: "untracked", remainingBusinessDays: null };
      const presentation = resolveDeliveryPromisePresentation(promise.state);
      return {
        id: delivery.id,
        code: delivery.code,
        statusLabel: resolveDeliveryStatusLabel(deliveryConfig, delivery.statusKey),
        ...resolveDeliveryStatusPresentation(deliveryConfig, delivery.statusKey),
        address: formatAddressSnapshot(delivery.addressSnapshot),
        confirmationCode: delivery.confirmationCode,
        promisedDeliveryStartsOn: formatAdminDate(delivery.promisedDeliveryStartsOn),
        promisedDeliveryByOn: formatAdminDate(delivery.promisedDeliveryByOn),
        deliveryPromiseStatusLabelKey: presentation.labelKey,
        deliveryPromiseStatusTone: presentation.tone,
        deliveryBusinessDays: promise.remainingBusinessDays === null ? null : Math.abs(promise.remainingBusinessDays),
        notes: delivery.notes,
      };
    }),
    payments: relatedPayments.map((payment) => {
      const row = createAdminPaymentRowViewModel(payment);
      return {
        id: row.id,
        reference: row.reference,
        statusLabelKey: row.statusLabelKey,
        amountLabel: row.amountLabel,
        dueAt: row.dueAt,
        paidAt: row.paidAt,
      };
    }),
    statusHistory: order.statusHistory.map((entry) => ({
      ...entry,
      createdAt: formatAdminDateTime(entry.createdAt),
    })),
    createdAt: formatAdminDateTime(order.createdAt),
  };
}

export function createAdminOrdersViewModel(
  orders: AdminOrderView[],
  config: AdminOrderConfigView | null = null,
  deliveries: AdminDeliveryView[] = [],
  deliveryConfig: AdminDeliveryConfigView | null = null,
  payments: AdminPaymentView[] = [],
): AdminOrdersViewModel {
  return {
    orders: orders.map((order) =>
      createAdminOrderRowViewModel(order, config, deliveries, deliveryConfig, payments),
    ),
    totals: {
      orders: orders.length,
      byStatus: orders.reduce<Record<string, number>>((acc, order) => {
        acc[order.statusKey] = (acc[order.statusKey] || 0) + 1;
        return acc;
      }, {}),
    },
  };
}

export function createAdminOrderFormViewModel(
  input: AdminOrderCreateInput,
): AdminOrderFormViewModel {
  const missingFields: Array<keyof AdminOrderCreateInput> = [];
  if (!input.customerId) missingFields.push("customerId");
  if (!input.kindKey) missingFields.push("kindKey");
  if (!input.items.length) missingFields.push("items");

  return {
    input,
    canSubmit: missingFields.length === 0,
    missingFields,
  };
}

export function createAdminOrderTransitionViewModel(
  order: AdminOrderView | null,
  input: AdminOrderTransitionInput,
  config: AdminOrderConfigView | null = null,
): AdminOrderTransitionViewModel {
  const missingFields: Array<keyof AdminOrderTransitionInput> = [];
  if (!input.statusKey) missingFields.push("statusKey");

  const currentStatus = order
    ? config?.statuses.find((status) => status.key === order.statusKey)
    : null;
  const allowedKeys = currentStatus?.allowedNextKeys || [];

  return {
    input,
    canSubmit: missingFields.length === 0,
    missingFields,
    allowedNextStatuses: config
      ? config.statuses
          .filter((status) => !allowedKeys.length || allowedKeys.includes(status.key))
          .map((status) => ({ key: status.key, label: status.label }))
      : [],
  };
}
