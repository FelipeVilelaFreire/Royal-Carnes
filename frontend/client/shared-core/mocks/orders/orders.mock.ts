import { catalogSubscriptionPlansMock } from "../catalog";
import type { SubscriptionTier } from "../catalog/types";

export type RoyalOrderKind = "subscriptionCycle" | "royalDelivery";

export type RoyalOrderStatus =
  | "sentToStore"
  | "approved"
  | "preparing"
  | "outForDelivery"
  | "delivered"
  | "cancelled";

export type RoyalOrderTimelineEntry = {
  status: RoyalOrderStatus;
  label: string;
  dateLabel?: string;
  completed: boolean;
};

export type RoyalOrderItem = {
  productId: string;
  name: string;
  category?: "meat" | "charcoal" | "seasoning" | "side" | "utensil";
  quantity: number;
  unitLabel: string;
  weightKg?: number;
  price: number;
};

export type RoyalCustomerOrder = {
  id: string;
  code: string;
  customerId: string;
  kind: RoyalOrderKind;
  title: string;
  summary: string;
  imageUrl: string;
  status: RoyalOrderStatus;
  createdAtLabel: string;
  subscriptionId?: string;
  boxId?: string;
  delivery: {
    addressId: string;
    estimateLabel: string;
    deliveryCode?: string;
    deliveredAtLabel?: string;
  };
  payment: {
    methodLabel: string;
    status: "pending" | "paid" | "payOnDelivery";
    totalLabel: string;
  };
  cycleUsage?: {
    cycleLabel: string;
    cutsUsed: number;
    cutsLimit: number;
    weightKgUsed: number;
    weightKgLimit: number;
    charcoalKgUsed: number;
    charcoalKgLimit: number;
    complementsUsed: number;
    complementsLimit: number;
    seasoningsUsed: number;
    seasoningsLimit: number;
    sidesUsed: number;
    sidesLimit: number;
    utensilsUsed: number;
    utensilsLimit: number;
  };
  items: RoyalOrderItem[];
  timeline: RoyalOrderTimelineEntry[];
  rating?: {
    score: number;
    comment?: string;
  };
};

export const royalOrderKindLabels: Record<RoyalOrderKind, string> = {
  subscriptionCycle: "Assinatura",
  royalDelivery: "Royal Delivery"
};

export const royalOrderStatusLabels: Record<RoyalOrderStatus, string> = {
  sentToStore: "Pedido enviado para a loja",
  approved: "Pedido aprovado",
  preparing: "Em separacao",
  outForDelivery: "Saiu para entrega",
  delivered: "Entregue",
  cancelled: "Cancelado"
};

export const getRoyalOrderStatusTone = (status: RoyalOrderStatus) => {
  if (status === "delivered") return "success";
  if (status === "cancelled") return "danger";
  if (status === "sentToStore") return "pending";
  return "active";
};

const defaultTimeline = (current: RoyalOrderStatus): RoyalOrderTimelineEntry[] => {
  const order: RoyalOrderStatus[] = ["sentToStore", "approved", "preparing", "outForDelivery", "delivered"];
  const currentIndex = order.indexOf(current);

  return order.map((status, index) => ({
    status,
    label: royalOrderStatusLabels[status],
    completed: current === "delivered" ? true : index <= currentIndex
  }));
};

const buildSubscriptionCycleUsage = (
  planKey: SubscriptionTier,
  cycleLabel: string,
  items: RoyalOrderItem[]
): NonNullable<RoyalCustomerOrder["cycleUsage"]> => {
  const plan = catalogSubscriptionPlansMock.find((item) => item.key === planKey) || catalogSubscriptionPlansMock[0];
  const meatItems = items.filter((item) => item.category === "meat");
  const charcoalItems = items.filter((item) => item.category === "charcoal");
  const seasoningItems = items.filter((item) => item.category === "seasoning");
  const sideItems = items.filter((item) => item.category === "side");
  const utensilItems = items.filter((item) => item.category === "utensil");
  const sumWeight = (entries: RoyalOrderItem[]) => entries.reduce((total, item) => total + (item.weightKg || 0), 0);
  const sumQuantity = (entries: RoyalOrderItem[]) => entries.reduce((total, item) => total + item.quantity, 0);

  return {
    cycleLabel,
    cutsUsed: meatItems.length,
    cutsLimit: plan.productSelectionLimit,
    weightKgUsed: sumWeight(meatItems),
    weightKgLimit: plan.proteinKgLimit,
    charcoalKgUsed: sumWeight(charcoalItems),
    charcoalKgLimit: plan.charcoalKgLimit,
    complementsUsed: sumQuantity(seasoningItems) + sumQuantity(sideItems),
    complementsLimit: plan.seasoningSelectionLimit + plan.sideSelectionLimit,
    seasoningsUsed: sumQuantity(seasoningItems),
    seasoningsLimit: plan.seasoningSelectionLimit,
    sidesUsed: sumQuantity(sideItems),
    sidesLimit: plan.sideSelectionLimit,
    utensilsUsed: sumQuantity(utensilItems),
    utensilsLimit: plan.utensilSelectionLimit
  };
};

const septemberSubscriptionItems: RoyalOrderItem[] = [
  { productId: "product-picanha", name: "Picanha", category: "meat", quantity: 1, unitLabel: "2kg", weightKg: 2, price: 0 },
  { productId: "product-briquete-premium", name: "Briquete premium", category: "charcoal", quantity: 1, unitLabel: "5kg", weightKg: 5, price: 0 },
  { productId: "product-sal-parrilla", name: "Sal de parrilla Royal", category: "seasoning", quantity: 1, unitLabel: "tempero", price: 0 },
  { productId: "product-pao-de-alho", name: "Pao de alho artesanal", category: "side", quantity: 1, unitLabel: "acompanhamento", price: 0 }
];

const septemberSubscriptionExtraItems: RoyalOrderItem[] = [
  { productId: "product-chimichurri", name: "Chimichurri Royal", category: "seasoning", quantity: 1, unitLabel: "tempero", price: 0 }
];

const septemberSubscriptionCycleItems = [
  ...septemberSubscriptionItems,
  ...septemberSubscriptionExtraItems
];

const julySubscriptionItems: RoyalOrderItem[] = [
  { productId: "product-picanha-premium", name: "Picanha Premium", category: "meat", quantity: 1, unitLabel: "2.0kg", weightKg: 2, price: 0 },
  { productId: "product-contra-file", name: "Contra file", category: "meat", quantity: 1, unitLabel: "2.0kg", weightKg: 2, price: 0 },
  { productId: "product-linguica-toscana", name: "Linguica toscana", category: "meat", quantity: 1, unitLabel: "1.0kg", weightKg: 1, price: 0 },
  { productId: "product-carvao-premium", name: "Carvao premium", category: "charcoal", quantity: 1, unitLabel: "5kg", weightKg: 5, price: 0 },
  { productId: "product-sal-parrilla", name: "Sal de parrilla Royal", category: "seasoning", quantity: 1, unitLabel: "tempero", price: 0 },
  { productId: "product-molho-barbecue", name: "Barbecue artesanal", category: "side", quantity: 1, unitLabel: "acompanhamento", price: 0 }
];

const augustSubscriptionItems: RoyalOrderItem[] = [
  { productId: "product-chorizo-angus", name: "Chorizo Angus", category: "meat", quantity: 1, unitLabel: "1.6kg", weightKg: 1.6, price: 0 },
  { productId: "product-bife-ancho", name: "Bife ancho marmorizado", category: "meat", quantity: 1, unitLabel: "1.4kg", weightKg: 1.4, price: 0 },
  { productId: "product-fraldinha-red", name: "Fraldinha Red Angus", category: "meat", quantity: 1, unitLabel: "1.2kg", weightKg: 1.2, price: 0 },
  { productId: "product-carvao-premium", name: "Carvao premium", category: "charcoal", quantity: 1, unitLabel: "5kg", weightKg: 5, price: 0 },
  { productId: "product-sal-defumado", name: "Sal defumado Royal", category: "seasoning", quantity: 1, unitLabel: "tempero", price: 0 },
  { productId: "product-farofa-crocante", name: "Farofa crocante", category: "side", quantity: 1, unitLabel: "acompanhamento", price: 0 },
  { productId: "product-molho-chimichurri", name: "Molho chimichurri fresco", category: "side", quantity: 1, unitLabel: "acompanhamento", price: 0 }
];

export const royalCustomerOrdersMock: RoyalCustomerOrder[] = [
  {
    id: "order-rd-8492",
    code: "#RD-8492",
    customerId: "customer-felipe-vilela",
    kind: "royalDelivery",
    title: "Pedido avulso Royal Delivery",
    summary: "Tomahawk Prime, Ancho Angus e carvao premium",
    imageUrl: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=900&q=82",
    status: "outForDelivery",
    createdAtLabel: "24 AGO 2026",
    delivery: {
      addressId: "address-home",
      estimateLabel: "Hoje, entre 18h e 20h",
      deliveryCode: "4821"
    },
    payment: {
      methodLabel: "Pagar na entrega",
      status: "payOnDelivery",
      totalLabel: "489,00"
    },
    items: [
      { productId: "product-tomahawk-prime", name: "Tomahawk Prime", category: "meat", quantity: 1, unitLabel: "1.2kg", weightKg: 1.2, price: 229 },
      { productId: "product-ancho-angus", name: "Ancho Angus", category: "meat", quantity: 2, unitLabel: "2 unidades", price: 180 },
      { productId: "product-carvao-premium", name: "Carvao premium", category: "charcoal", quantity: 1, unitLabel: "5kg", weightKg: 5, price: 80 }
    ],
    timeline: defaultTimeline("outForDelivery")
  },
  {
    id: "order-sub-2026-09-extra",
    code: "#RS-2026-09B",
    customerId: "customer-felipe-vilela",
    kind: "subscriptionCycle",
    title: "Complemento do Ciclo de Setembro - Royal Pro",
    summary: "1 tempero adicional dentro do mesmo ciclo",
    imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=82",
    status: "preparing",
    createdAtLabel: "30 AGO 2026",
    subscriptionId: "subscription-royal-pro-felipe",
    delivery: {
      addressId: "address-home",
      estimateLabel: "12 de Setembro, entre 18h e 20h"
    },
    payment: {
      methodLabel: "Assinatura Royal Pro",
      status: "paid",
      totalLabel: "Incluido na assinatura"
    },
    cycleUsage: buildSubscriptionCycleUsage("pro", "Setembro", septemberSubscriptionCycleItems),
    items: septemberSubscriptionExtraItems,
    timeline: defaultTimeline("preparing")
  },
  {
    id: "order-sub-2026-09-base",
    code: "#RS-2026-09A",
    customerId: "customer-felipe-vilela",
    kind: "subscriptionCycle",
    title: "Ciclo de Setembro - Royal Pro",
    summary: "Primeira selecao do ciclo: 2kg de proteina, 5kg de briquete, 1 tempero e 1 acompanhamento",
    imageUrl: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=900&q=82",
    status: "approved",
    createdAtLabel: "26 AGO 2026",
    subscriptionId: "subscription-royal-pro-felipe",
    delivery: {
      addressId: "address-home",
      estimateLabel: "12 de Setembro, entre 18h e 20h"
    },
    payment: {
      methodLabel: "Assinatura Royal Pro",
      status: "paid",
      totalLabel: "Incluido na assinatura"
    },
    cycleUsage: buildSubscriptionCycleUsage("pro", "Setembro", septemberSubscriptionItems),
    items: septemberSubscriptionItems,
    timeline: defaultTimeline("approved")
  },
  {
    id: "order-rd-8461",
    code: "#RD-8461",
    customerId: "customer-felipe-vilela",
    kind: "royalDelivery",
    title: "Pedido avulso de Agosto",
    summary: "Prime rib, linguiça artesanal e acompanhamentos para churrasco",
    imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=82",
    status: "delivered",
    createdAtLabel: "18 AGO 2026",
    delivery: {
      addressId: "address-home",
      estimateLabel: "Entregue em 18 de Agosto",
      deliveredAtLabel: "18 AGO 2026"
    },
    payment: {
      methodLabel: "Cartao final 2841",
      status: "paid",
      totalLabel: "276,90"
    },
    items: [
      { productId: "product-prime-rib", name: "Prime rib especial", category: "meat", quantity: 1, unitLabel: "1.2kg", weightKg: 1.2, price: 169.9 },
      { productId: "product-linguica-toscana", name: "Linguica toscana artesanal", category: "meat", quantity: 1, unitLabel: "1kg", weightKg: 1, price: 52 },
      { productId: "product-pao-de-alho", name: "Pao de alho artesanal", category: "side", quantity: 1, unitLabel: "acompanhamento", price: 28 },
      { productId: "product-sal-defumado", name: "Sal defumado Royal", category: "seasoning", quantity: 1, unitLabel: "tempero", price: 27 }
    ],
    timeline: defaultTimeline("delivered"),
    rating: {
      score: 5,
      comment: "Entrega dentro do horario e cortes excelentes."
    }
  },
  {
    id: "order-sub-2026-08",
    code: "#RS-2026-08",
    customerId: "customer-felipe-vilela",
    kind: "subscriptionCycle",
    title: "Ciclo de Agosto - Royal Pro",
    summary: "3 cortes, 5kg de carvao, 1 tempero e 2 acompanhamentos",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=82",
    status: "delivered",
    createdAtLabel: "12 AGO 2026",
    subscriptionId: "subscription-royal-pro-felipe",
    delivery: {
      addressId: "address-home",
      estimateLabel: "Entregue em 12 de Agosto",
      deliveredAtLabel: "12 AGO 2026"
    },
    payment: {
      methodLabel: "Assinatura Royal Pro",
      status: "paid",
      totalLabel: "Incluido na assinatura"
    },
    cycleUsage: buildSubscriptionCycleUsage("pro", "Agosto", augustSubscriptionItems),
    items: augustSubscriptionItems,
    timeline: defaultTimeline("delivered")
  },
  {
    id: "order-sub-2026-07",
    code: "#RS-2026-07",
    customerId: "customer-felipe-vilela",
    kind: "subscriptionCycle",
    title: "Ciclo de Julho - Royal Pro",
    summary: "3 cortes, 5kg de carvao, 1 tempero e 1 acompanhamento",
    imageUrl: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=82",
    status: "delivered",
    createdAtLabel: "12 JUL 2026",
    subscriptionId: "subscription-royal-pro-felipe",
    delivery: {
      addressId: "address-home",
      estimateLabel: "Entregue em 12 de Julho",
      deliveredAtLabel: "12 JUL 2026"
    },
    payment: {
      methodLabel: "Assinatura Royal Pro",
      status: "paid",
      totalLabel: "Incluido na assinatura"
    },
    cycleUsage: buildSubscriptionCycleUsage("pro", "Julho", julySubscriptionItems),
    items: julySubscriptionItems,
    timeline: defaultTimeline("delivered")
  }
];
