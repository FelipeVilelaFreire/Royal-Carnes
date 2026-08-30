import type {
  ClientOrderConfigView,
  ClientOrderCreateInput,
  ClientOrderView,
} from "../contracts/orders.contract";

export interface ClientOrderRowViewModel {
  id: string | number;
  code: string;
  kindKey: string;
  statusKey: string;
  statusLabel: string;
  totalLabel: string;
  itemCount: number;
  createdAt: string;
}

export interface ClientOrdersViewModel {
  orders: ClientOrderRowViewModel[];
  totals: {
    orders: number;
  };
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

export function createClientOrderRowViewModel(
  order: ClientOrderView,
  config: ClientOrderConfigView | null = null,
): ClientOrderRowViewModel {
  return {
    id: order.id,
    code: order.code,
    kindKey: order.kindKey,
    statusKey: order.statusKey,
    statusLabel: resolveStatusLabel(config, order.statusKey),
    totalLabel: formatMoney(order.totalCents, order.currency),
    itemCount: order.items.length,
    createdAt: order.createdAt,
  };
}

export function createClientOrdersViewModel(
  orders: ClientOrderView[],
  config: ClientOrderConfigView | null = null,
): ClientOrdersViewModel {
  return {
    orders: orders.map((order) => createClientOrderRowViewModel(order, config)),
    totals: {
      orders: orders.length,
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
