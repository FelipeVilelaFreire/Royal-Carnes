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
  { productId: "product-picanha-steakhouse", name: "Picanha Steakhouse", category: "meat", quantity: 1, unitLabel: "1.8kg", weightKg: 1.8, price: 0 },
  { productId: "product-ancho-angus", name: "Ancho Angus", category: "meat", quantity: 1, unitLabel: "1.4kg", weightKg: 1.4, price: 0 },
  { productId: "product-prime-rib", name: "Prime rib especial", category: "meat", quantity: 1, unitLabel: "1.2kg", weightKg: 1.2, price: 0 },
  { productId: "product-linguica-toscana", name: "Linguica toscana artesanal", category: "meat", quantity: 1, unitLabel: "1.0kg", weightKg: 1, price: 0 },
  { productId: "product-briquete-premium", name: "Briquete premium", category: "charcoal", quantity: 1, unitLabel: "5kg", weightKg: 5, price: 0 },
  { productId: "product-sal-parrilla", name: "Sal de parrilla Royal", category: "seasoning", quantity: 1, unitLabel: "tempero", price: 0 },
  { productId: "product-chimichurri", name: "Chimichurri Royal", category: "seasoning", quantity: 1, unitLabel: "tempero", price: 0 },
  { productId: "product-pao-de-alho", name: "Pao de alho artesanal", category: "side", quantity: 1, unitLabel: "acompanhamento", price: 0 },
  { productId: "product-faca-royal", name: "Faca Royal", category: "utensil", quantity: 1, unitLabel: "utensilio incluso", price: 0 }
];

const julySubscriptionItems: RoyalOrderItem[] = [
  { productId: "product-picanha-premium", name: "Picanha Premium", category: "meat", quantity: 1, unitLabel: "2.0kg", weightKg: 2, price: 0 },
  { productId: "product-contra-file", name: "Contra file", category: "meat", quantity: 1, unitLabel: "2.0kg", weightKg: 2, price: 0 },
  { productId: "product-linguica-toscana", name: "Linguica toscana", category: "meat", quantity: 1, unitLabel: "1.0kg", weightKg: 1, price: 0 },
  { productId: "product-carvao-premium", name: "Carvao premium", category: "charcoal", quantity: 1, unitLabel: "5kg", weightKg: 5, price: 0 },
  { productId: "product-sal-parrilla", name: "Sal de parrilla Royal", category: "seasoning", quantity: 1, unitLabel: "tempero", price: 0 },
  { productId: "product-molho-barbecue", name: "Barbecue artesanal", category: "side", quantity: 1, unitLabel: "acompanhamento", price: 0 }
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
    id: "order-sub-2026-09",
    code: "#RS-2026-09",
    customerId: "customer-felipe-vilela",
    kind: "subscriptionCycle",
    title: "Ciclo de Setembro - Royal Pro",
    summary: "4 cortes, 5kg de briquete, 2 temperos, 1 acompanhamento e 1 utensilio incluso",
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
