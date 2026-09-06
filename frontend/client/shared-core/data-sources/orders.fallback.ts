import type { ClientOrderConfigView, ClientOrderView } from "../contracts/orders.contract";
import {
  royalCustomerOrdersMock,
  royalOrderKindLabels,
  royalOrderStatusLabels,
  type RoyalCustomerOrder,
} from "../mocks/orders";

const orderStatuses = ["sentToStore", "approved", "preparing", "outForDelivery", "delivered", "cancelled"];

const parseMoneyToCents = (value: string) => {
  const normalized = value.replace(/[^\d,.-]/g, "").replace(".", "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
};

const createFallbackOrder = (order: RoyalCustomerOrder): ClientOrderView => ({
  id: order.id,
  code: order.code,
  kindKey: order.kind,
  statusKey: order.status,
  customerId: order.customerId,
  customerName: "Felipe Vilela",
  addressId: order.delivery.addressId,
  subscriptionId: order.subscriptionId || null,
  subscriptionCycleId: order.boxId || null,
  currency: "BRL",
  subtotalCents: parseMoneyToCents(order.payment.totalLabel),
  discountCents: 0,
  freightCents: 0,
  totalCents: parseMoneyToCents(order.payment.totalLabel),
  notes: "",
  metadata: {
    createdAtLabel: order.createdAtLabel,
    cycleUsage: order.cycleUsage,
    delivery: order.delivery,
    imageUrl: order.imageUrl,
    payment: order.payment,
    rating: order.rating,
    summary: order.summary,
    timeline: order.timeline,
    title: order.title,
  },
  items: order.items.map((item) => ({
    id: item.productId,
    productKey: item.productId,
    variantSku: null,
    measurementUnitKey: null,
    nameSnapshot: item.name,
    quantity: String(item.quantity),
    unitPriceCents: Math.round(item.price * 100),
    totalCents: Math.round(item.price * item.quantity * 100),
    weightGrams: item.weightKg ? Math.round(item.weightKg * 1000) : null,
    sourceType: item.category || "",
    sourceKey: item.productId,
    metadata: {
      category: item.category,
      unitLabel: item.unitLabel,
    },
  })),
  statusHistory: order.timeline
    .filter((entry) => entry.completed)
    .map((entry, index) => ({
      id: `${order.id}-${entry.status}`,
      fromStatusKey: index === 0 ? "" : order.timeline[index - 1]?.status || "",
      toStatusKey: entry.status,
      note: entry.label,
      actorEmail: null,
      createdAt: order.createdAtLabel,
    })),
  createdAt: order.createdAtLabel,
  updatedAt: order.createdAtLabel,
});

export const ordersFallbackDataSource: {
  config: ClientOrderConfigView;
  orders: ClientOrderView[];
} = {
  config: {
    kinds: [
      {
        id: "subscriptionCycle",
        key: "subscriptionCycle",
        label: royalOrderKindLabels.subscriptionCycle,
        commercialModeKey: "subscription",
        codeSequenceKey: "subscription-cycle",
        requiresInventory: true,
        createsDelivery: true,
        isActive: true,
        sortOrder: 10,
        metadata: {},
      },
      {
        id: "royalDelivery",
        key: "royalDelivery",
        label: royalOrderKindLabels.royalDelivery,
        commercialModeKey: "royalDelivery",
        codeSequenceKey: "royal-delivery",
        requiresInventory: true,
        createsDelivery: true,
        isActive: true,
        sortOrder: 20,
        metadata: {},
      },
    ],
    statuses: orderStatuses.map((status, index) => ({
      id: status,
      key: status,
      label: royalOrderStatusLabels[status as keyof typeof royalOrderStatusLabels],
      sortOrder: index + 1,
      isInitial: index === 0,
      isTerminal: status === "delivered" || status === "cancelled",
      isPublic: true,
      allowedNextKeys: orderStatuses[index + 1] ? [orderStatuses[index + 1]] : [],
      effects: {},
      metadata: {},
    })),
  },
  orders: royalCustomerOrdersMock.map(createFallbackOrder),
};
