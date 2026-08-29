import type { DeliveryDto, RoyalDelivery } from "../contracts/delivery.contract";

export interface PreparedDeliveryViewModel {
  id: string;
  code: string;
  orderCode: string;
  statusLabel: string;
  statusTone: "success" | "danger" | "pending" | "active";
  formattedAddress: string;
  itemsSummary: string[];
  rawDelivery: any;
}

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  packing: "Separando entrega",
  outForDelivery: "Saiu para entrega",
  "out-for-delivery": "Saiu para entrega",
  delivered: "Entregue",
  failed: "Falhou",
  cancelled: "Cancelada"
};

const statusTones: Record<string, "success" | "danger" | "pending" | "active"> = {
  pending: "pending",
  packing: "active",
  outForDelivery: "active",
  "out-for-delivery": "active",
  delivered: "success",
  failed: "danger",
  cancelled: "danger"
};

export function prepareDeliveryViewModel(deliveryInput: DeliveryDto | RoyalDelivery | any): PreparedDeliveryViewModel {
  const isDto = "status_key" in deliveryInput;

  const rawStatus = isDto ? deliveryInput.status_key : deliveryInput.statusKey;
  const statusLabel = statusLabels[rawStatus] || rawStatus || "Pendente";
  const statusTone = statusTones[rawStatus] || "pending";

  let formattedAddress = "";
  const snap = deliveryInput.address_snapshot || deliveryInput.addressSnapshot;
  if (snap) {
    const { street, number, neighborhood, city, state } = snap;
    formattedAddress = `${street || ""}, ${number || ""} - ${neighborhood || ""}, ${city || ""} / ${state || ""}`;
  }

  const itemsSummary: string[] = [];
  if (Array.isArray(deliveryInput.packages)) {
    deliveryInput.packages.forEach((pkg: any) => {
      if (Array.isArray(pkg.items)) {
        itemsSummary.push(...pkg.items);
      }
    });
  }

  return {
    id: String(deliveryInput.id || deliveryInput.code),
    code: String(deliveryInput.code || deliveryInput.id),
    orderCode: String(deliveryInput.order_code || deliveryInput.orderCode || ""),
    statusLabel,
    statusTone,
    formattedAddress,
    itemsSummary,
    rawDelivery: deliveryInput
  };
}
