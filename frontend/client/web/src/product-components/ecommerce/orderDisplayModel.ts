import {
  getRoyalOrderStatusTone,
  royalOrderKindLabels,
  royalOrderStatusLabels,
  type RoyalCustomerOrder
} from "@/mocks/orders";

export interface PreparedTimelineStep {
  status: string;
  label: string;
  dateLabel?: string;
  completed: boolean;
}

export interface PreparedOrderViewModel {
  id: string;
  code: string;
  kindLabel: string;
  statusLabel: string;
  statusTone: "success" | "danger" | "pending" | "active";
  deliveryCodeLabel: string;
  moneyLabel: string;
  remainingCycleLabel: string | null;
  timelineSteps: PreparedTimelineStep[];
  canReview: boolean;
  rawOrder: RoyalCustomerOrder;
}

const formatKg = (value: number) => (Number.isInteger(value) ? `${value}kg` : `${value.toFixed(1)}kg`);

export function prepareMockOrderViewModel(order: RoyalCustomerOrder): PreparedOrderViewModel {
  const remainingCycleLabel = order.cycleUsage
    ? `${formatKg(Math.max(0, order.cycleUsage.weightKgLimit - order.cycleUsage.weightKgUsed))} de proteina, ${Math.max(0, order.cycleUsage.cutsLimit - order.cycleUsage.cutsUsed)} cortes e ${Math.max(0, order.cycleUsage.complementsLimit - order.cycleUsage.complementsUsed)} complementos restantes`
    : null;

  return {
    id: order.id,
    code: order.code,
    kindLabel: royalOrderKindLabels[order.kind],
    statusLabel: royalOrderStatusLabels[order.status],
    statusTone: getRoyalOrderStatusTone(order.status),
    deliveryCodeLabel: order.delivery.deliveryCode || (order.status === "delivered" ? "Validado" : "Pendente"),
    moneyLabel: order.kind === "subscriptionCycle" ? order.payment.totalLabel : `R$ ${order.payment.totalLabel}`,
    remainingCycleLabel,
    timelineSteps: order.timeline,
    canReview: order.status === "delivered" && !order.rating,
    rawOrder: order
  };
}
