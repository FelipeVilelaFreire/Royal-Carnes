import type {
  AdminDeliveryConfigView,
  AdminDeliveryConfirmInput,
  AdminDeliveryCreateInput,
  AdminDeliveryTransitionInput,
  AdminDeliveryView,
} from "../contracts/deliveries.contract";
import { formatAdminDate, formatAdminDateTime } from "../formatters/date-time.formatter";

export interface AdminDeliveryRowViewModel {
  id: string | number;
  code: string;
  orderId: string | number;
  orderCode: string;
  customerName: string;
  statusKey: string;
  statusLabel: string;
  statusColor?: string;
  statusTone?: "danger" | "neutral" | "primary" | "success" | "warning";
  packageCount: number;
  hasConfirmation: boolean;
  promisedDeliveryStartsOn: string;
  promisedDeliveryByOn: string;
  deliveryPromiseStatusLabelKey: string;
  deliveryPromiseStatusTone: "danger" | "neutral" | "success" | "warning";
  deliveryBusinessDays: number | null;
  linkedOrder: Array<{ code: string; id: string | number; statusLabel: string }>;
  createdAt: string;
}

export interface AdminDeliveriesViewModel {
  deliveries: AdminDeliveryRowViewModel[];
  totals: {
    deliveries: number;
    confirmed: number;
    byStatus: Record<string, number>;
  };
}

export interface AdminDeliveryCreateFormViewModel {
  input: AdminDeliveryCreateInput;
  canSubmit: boolean;
  missingFields: Array<keyof AdminDeliveryCreateInput>;
}

export interface AdminDeliveryTransitionViewModel {
  input: AdminDeliveryTransitionInput;
  canSubmit: boolean;
  missingFields: Array<keyof AdminDeliveryTransitionInput>;
  allowedNextStatuses: Array<{ key: string; label: string }>;
}

export interface AdminDeliveryConfirmViewModel {
  input: AdminDeliveryConfirmInput;
  canSubmit: boolean;
  missingFields: Array<keyof AdminDeliveryConfirmInput>;
}

function resolveStatusLabel(
  config: AdminDeliveryConfigView | null,
  statusKey: string,
): string {
  return config?.statuses.find((status) => status.key === statusKey)?.label || statusKey;
}

function resolveStatusPresentation(
  config: AdminDeliveryConfigView | null,
  statusKey: string,
): Pick<AdminDeliveryRowViewModel, "statusColor" | "statusTone"> {
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
  return {
    labelKey: `pedidos.deliveryPromise.states.${state}`,
    tone: toneByState[state as keyof typeof toneByState] || "neutral",
  };
}

export function createAdminDeliveryRowViewModel(
  delivery: AdminDeliveryView,
  config: AdminDeliveryConfigView | null = null,
): AdminDeliveryRowViewModel {
  const statusPresentation = resolveStatusPresentation(config, delivery.statusKey);
  const promise = delivery.deliveryPromiseStatus || { state: "untracked", remainingBusinessDays: null };
  const promisePresentation = resolveDeliveryPromisePresentation(promise.state);
  return {
    id: delivery.id,
    code: delivery.code,
    orderId: delivery.orderId,
    orderCode: delivery.orderCode,
    customerName: delivery.customerName,
    statusKey: delivery.statusKey,
    statusLabel: resolveStatusLabel(config, delivery.statusKey),
    ...statusPresentation,
    packageCount: delivery.packages.length,
    hasConfirmation: Boolean(delivery.confirmation),
    promisedDeliveryStartsOn: formatAdminDate(delivery.promisedDeliveryStartsOn),
    promisedDeliveryByOn: formatAdminDate(delivery.promisedDeliveryByOn),
    deliveryPromiseStatusLabelKey: promisePresentation.labelKey,
    deliveryPromiseStatusTone: promisePresentation.tone,
    deliveryBusinessDays: promise.remainingBusinessDays === null ? null : Math.abs(promise.remainingBusinessDays),
    linkedOrder: [{
      code: delivery.orderCode,
      id: delivery.orderId,
      statusLabel: resolveStatusLabel(config, delivery.statusKey),
    }],
    createdAt: formatAdminDateTime(delivery.createdAt),
  };
}

export function createAdminDeliveriesViewModel(
  deliveries: AdminDeliveryView[],
  config: AdminDeliveryConfigView | null = null,
): AdminDeliveriesViewModel {
  return {
    deliveries: deliveries.map((delivery) =>
      createAdminDeliveryRowViewModel(delivery, config),
    ),
    totals: {
      deliveries: deliveries.length,
      confirmed: deliveries.filter((delivery) => Boolean(delivery.confirmation)).length,
      byStatus: deliveries.reduce<Record<string, number>>((acc, delivery) => {
        acc[delivery.statusKey] = (acc[delivery.statusKey] || 0) + 1;
        return acc;
      }, {}),
    },
  };
}

export function createAdminDeliveryCreateFormViewModel(
  input: AdminDeliveryCreateInput,
): AdminDeliveryCreateFormViewModel {
  const missingFields: Array<keyof AdminDeliveryCreateInput> = [];
  if (!input.orderId) missingFields.push("orderId");

  return {
    input,
    canSubmit: missingFields.length === 0,
    missingFields,
  };
}

export function createAdminDeliveryTransitionViewModel(
  delivery: AdminDeliveryView | null,
  input: AdminDeliveryTransitionInput,
  config: AdminDeliveryConfigView | null = null,
): AdminDeliveryTransitionViewModel {
  const missingFields: Array<keyof AdminDeliveryTransitionInput> = [];
  if (!input.statusKey) missingFields.push("statusKey");

  const currentStatus = delivery
    ? config?.statuses.find((status) => status.key === delivery.statusKey)
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

export function createAdminDeliveryConfirmViewModel(
  input: AdminDeliveryConfirmInput,
): AdminDeliveryConfirmViewModel {
  return {
    input,
    canSubmit: true,
    missingFields: [],
  };
}
