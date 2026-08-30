import type {
  AdminOrderConfigView,
  AdminOrderCreateInput,
  AdminOrderTransitionInput,
  AdminOrderView,
} from "../contracts/orders.contract";

export interface AdminOrderRowViewModel {
  id: string | number;
  code: string;
  customerName: string;
  kindKey: string;
  kindLabel: string;
  statusKey: string;
  statusLabel: string;
  totalLabel: string;
  itemCount: number;
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

export function createAdminOrderRowViewModel(
  order: AdminOrderView,
  config: AdminOrderConfigView | null = null,
): AdminOrderRowViewModel {
  return {
    id: order.id,
    code: order.code,
    customerName: order.customerName,
    kindKey: order.kindKey,
    kindLabel: resolveKindLabel(config, order.kindKey),
    statusKey: order.statusKey,
    statusLabel: resolveStatusLabel(config, order.statusKey),
    totalLabel: formatMoney(order.totalCents, order.currency),
    itemCount: order.items.length,
    createdAt: order.createdAt,
  };
}

export function createAdminOrdersViewModel(
  orders: AdminOrderView[],
  config: AdminOrderConfigView | null = null,
): AdminOrdersViewModel {
  return {
    orders: orders.map((order) => createAdminOrderRowViewModel(order, config)),
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
