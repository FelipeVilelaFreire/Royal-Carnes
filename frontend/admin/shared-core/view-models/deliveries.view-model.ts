import type {
  AdminDeliveryConfigView,
  AdminDeliveryConfirmInput,
  AdminDeliveryCreateInput,
  AdminDeliveryTransitionInput,
  AdminDeliveryView,
} from "../contracts/deliveries.contract";

export interface AdminDeliveryRowViewModel {
  id: string | number;
  code: string;
  orderCode: string;
  customerName: string;
  statusKey: string;
  statusLabel: string;
  packageCount: number;
  hasConfirmation: boolean;
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

export function createAdminDeliveryRowViewModel(
  delivery: AdminDeliveryView,
  config: AdminDeliveryConfigView | null = null,
): AdminDeliveryRowViewModel {
  return {
    id: delivery.id,
    code: delivery.code,
    orderCode: delivery.orderCode,
    customerName: delivery.customerName,
    statusKey: delivery.statusKey,
    statusLabel: resolveStatusLabel(config, delivery.statusKey),
    packageCount: delivery.packages.length,
    hasConfirmation: Boolean(delivery.confirmation),
    createdAt: delivery.createdAt,
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
