import type {
  ClientDeliveryConfigView,
  ClientDeliveryView,
} from "../contracts/deliveries.contract";

export interface ClientDeliveryRowViewModel {
  id: string | number;
  code: string;
  orderCode: string;
  statusKey: string;
  statusLabel: string;
  packageCount: number;
  hasConfirmation: boolean;
  createdAt: string;
}

export interface ClientDeliveriesViewModel {
  deliveries: ClientDeliveryRowViewModel[];
  totals: {
    deliveries: number;
  };
}

function resolveStatusLabel(
  config: ClientDeliveryConfigView | null,
  statusKey: string,
): string {
  return config?.statuses.find((status) => status.key === statusKey)?.label || statusKey;
}

export function createClientDeliveryRowViewModel(
  delivery: ClientDeliveryView,
  config: ClientDeliveryConfigView | null = null,
): ClientDeliveryRowViewModel {
  return {
    id: delivery.id,
    code: delivery.code,
    orderCode: delivery.orderCode,
    statusKey: delivery.statusKey,
    statusLabel: resolveStatusLabel(config, delivery.statusKey),
    packageCount: delivery.packages.length,
    hasConfirmation: Boolean(delivery.confirmation),
    createdAt: delivery.createdAt,
  };
}

export function createClientDeliveriesViewModel(
  deliveries: ClientDeliveryView[],
  config: ClientDeliveryConfigView | null = null,
): ClientDeliveriesViewModel {
  return {
    deliveries: deliveries.map((delivery) =>
      createClientDeliveryRowViewModel(delivery, config),
    ),
    totals: {
      deliveries: deliveries.length,
    },
  };
}
