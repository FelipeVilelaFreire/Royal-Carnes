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
import { createAdminPaymentRowViewModel } from "./payments.view-model";

export interface AdminOrderRowViewModel {
  id: string | number;
  code: string;
  customerName: string;
  kindKey: string;
  kindLabel: string;
  recurrenceLabel: string;
  deliveryStatusLabel: string;
  deliveryCode: string;
  paymentStatusLabelKey: string;
  paymentReference: string;
  subscriptionCycleLabel: string;
  subscriptionCycleStatus: string;
  subscriptionId: string | number | null;
  subscriptionCycleId: string | number | null;
  statusKey: string;
  statusLabel: string;
  statusLabelKey: string;
  totalLabel: string;
  totalFormatted: string;
  summary: string;
  itemCount: number;
  items: AdminOrderView["items"];
  deliveries: Array<{
    id: string | number;
    code: string;
    statusLabel: string;
    address: string;
    confirmationCode: string;
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

function resolveKindLabel(config: AdminOrderConfigView | null, kindKey: string): string {
  return config?.kinds.find((kind) => kind.key === kindKey)?.label || kindKey;
}

function resolveStatusLabel(config: AdminOrderConfigView | null, statusKey: string): string {
  return config?.statuses.find((status) => status.key === statusKey)?.label || statusKey;
}

function resolveDeliveryStatusLabel(
  config: AdminDeliveryConfigView | null,
  statusKey: string,
): string {
  return config?.statuses.find((status) => status.key === statusKey)?.label || statusKey;
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
  const isSubscriptionCycle = Boolean(order.subscriptionId || order.subscriptionCycleId);
  const subscriptionCycleLabel = order.subscriptionCycleNumber
    ? String(order.subscriptionCycleNumber)
    : "";
  const recurrenceLabel = isSubscriptionCycle
    ? [order.subscriptionPlanName, subscriptionCycleLabel].filter(Boolean).join(" - ")
    : "";
  const totalLabel = formatMoney(order.totalCents, order.currency);

  return {
    id: order.id,
    code: order.code,
    customerName: order.customerName,
    kindKey: order.kindKey,
    kindLabel: resolveKindLabel(config, order.kindKey),
    recurrenceLabel,
    deliveryCode: primaryDelivery?.code || "",
    deliveryStatusLabel: primaryDelivery
      ? resolveDeliveryStatusLabel(deliveryConfig, primaryDelivery.statusKey)
      : "",
    paymentReference: primaryPayment?.reference || "",
    paymentStatusLabelKey: paymentRow?.statusLabelKey || "",
    subscriptionCycleLabel,
    subscriptionCycleStatus: order.subscriptionCycleStatus || "",
    subscriptionId: order.subscriptionId ?? null,
    subscriptionCycleId: order.subscriptionCycleId ?? null,
    statusKey: order.statusKey,
    statusLabel: resolveStatusLabel(config, order.statusKey),
    statusLabelKey: `common.status${order.statusKey.charAt(0).toUpperCase()}${order.statusKey.slice(1)}`,
    totalLabel,
    totalFormatted: totalLabel,
    summary: order.items.map((item) => `${item.nameSnapshot} x ${item.quantity}`).join(", "),
    itemCount: order.items.length,
    items: order.items,
    deliveries: relatedDeliveries.map((delivery) => ({
      id: delivery.id,
      code: delivery.code,
      statusLabel: resolveDeliveryStatusLabel(deliveryConfig, delivery.statusKey),
      address: formatAddressSnapshot(delivery.addressSnapshot),
      confirmationCode: delivery.confirmationCode,
      notes: delivery.notes,
    })),
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
    statusHistory: order.statusHistory,
    createdAt: order.createdAt,
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
