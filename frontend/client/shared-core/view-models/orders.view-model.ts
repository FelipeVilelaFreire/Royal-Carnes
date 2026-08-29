import type { OrderDto, RoyalCustomerOrder } from "../contracts/order.contract";

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
  rawOrder: any;
}

const statusToneMap: Record<string, PreparedOrderViewModel["statusTone"]> = {
  received: "pending",
  sentToStore: "pending",
  approved: "active",
  separating: "active",
  preparing: "active",
  ready: "active",
  outForDelivery: "active",
  completed: "success",
  delivered: "success",
  cancelled: "danger"
};

const statusLabelMap: Record<string, string> = {
  received: "Recebido",
  sentToStore: "Recebido pela loja",
  approved: "Aprovado",
  separating: "Em separação",
  preparing: "Em preparo",
  ready: "Pronto para entrega",
  outForDelivery: "Saiu para entrega",
  completed: "Concluído",
  delivered: "Entregue",
  cancelled: "Cancelado"
};

const kindLabelMap: Record<string, string> = {
  delivery: "Royal Delivery",
  royalDelivery: "Royal Delivery",
  "subscription-cycle": "Ciclo de assinatura",
  subscriptionCycle: "Ciclo de assinatura"
};

export function prepareOrderViewModel(orderInput: OrderDto | RoyalCustomerOrder | any): PreparedOrderViewModel {
  const isBackendDto = "status_key" in orderInput;

  const rawStatus = isBackendDto ? orderInput.status_key : orderInput.status;
  const rawKind = isBackendDto ? orderInput.kind_key : orderInput.kind;

  const statusTone: PreparedOrderViewModel["statusTone"] = statusToneMap[rawStatus] || "pending";
  const statusLabel = statusLabelMap[rawStatus] || rawStatus || "Desconhecido";
  const kindLabel = kindLabelMap[rawKind] || rawKind || "Pedido";

  // Format Total Money
  let moneyLabel = "R$ 0,00";
  if (isBackendDto) {
    const cents = orderInput.total_cents ?? 0;
    moneyLabel = `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
  } else if (orderInput.payment?.totalLabel) {
    moneyLabel = rawKind === "subscriptionCycle" || rawKind === "subscription-cycle"
      ? orderInput.payment.totalLabel
      : `R$ ${orderInput.payment.totalLabel}`;
  }

  // Delivery Code
  let deliveryCodeLabel = "Pendente";
  const delCode = isBackendDto
    ? orderInput.delivery?.deliveryCode
    : orderInput.delivery?.deliveryCode;

  if (delCode) {
    deliveryCodeLabel = delCode;
  } else if (rawStatus === "delivered" || rawStatus === "completed") {
    deliveryCodeLabel = "Validado";
  } else if (rawStatus === "cancelled") {
    deliveryCodeLabel = "Não aplicado";
  }

  // Cycle usage remaining
  let remainingCycleLabel: string | null = null;
  if (orderInput.cycleUsage) {
    const formatKg = (val: number) => (Number.isInteger(val) ? `${val}kg` : `${val.toFixed(1)}kg`);
    const remainingWeight = Math.max(0, (orderInput.cycleUsage.weightKgLimit || 0) - (orderInput.cycleUsage.weightKgUsed || 0));
    const remainingCuts = Math.max(0, (orderInput.cycleUsage.cutsLimit || 0) - (orderInput.cycleUsage.cutsUsed || 0));
    const remainingComplements = Math.max(0, (orderInput.cycleUsage.complementsLimit || 0) - (orderInput.cycleUsage.complementsUsed || 0));
    remainingCycleLabel = `${formatKg(remainingWeight)} de proteína, ${remainingCuts} cortes e ${remainingComplements} complementos restantes`;
  }

  // Timeline
  let timelineSteps: PreparedTimelineStep[] = [];
  if (Array.isArray(orderInput.timeline)) {
    timelineSteps = orderInput.timeline.map((step: any) => ({
      status: step.status,
      label: step.label || statusLabelMap[step.status] || step.status,
      dateLabel: step.dateLabel,
      completed: !!step.completed
    }));
  } else if (Array.isArray(orderInput.status_history)) {
    timelineSteps = orderInput.status_history.map((hist: any) => ({
      status: hist.status_key,
      label: statusLabelMap[hist.status_key] || hist.status_key,
      dateLabel: hist.created_at,
      completed: true
    }));
  } else {
    // Basic fallback timeline steps
    timelineSteps = [
      { status: "received", label: "Recebido", completed: true },
      { status: "approved", label: "Aprovado", completed: rawStatus !== "received" },
      { status: "separating", label: "Separando", completed: ["separating", "ready", "completed", "delivered"].includes(rawStatus) },
      { status: "ready", label: "Pronto", completed: ["ready", "completed", "delivered"].includes(rawStatus) },
      { status: "completed", label: "Concluído", completed: ["completed", "delivered"].includes(rawStatus) }
    ];
  }

  const canReview = (rawStatus === "delivered" || rawStatus === "completed") && !orderInput.rating;

  return {
    id: String(orderInput.id || orderInput.code),
    code: String(orderInput.code || orderInput.id),
    kindLabel,
    statusLabel,
    statusTone,
    deliveryCodeLabel,
    moneyLabel,
    remainingCycleLabel,
    timelineSteps,
    canReview,
    rawOrder: orderInput
  };
}
