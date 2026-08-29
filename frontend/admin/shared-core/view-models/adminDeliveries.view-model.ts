import type { AdminDelivery } from "../contracts/admin-delivery.contract";

export interface PreparedAdminDeliveryViewModel {
  id: string;
  orderCode: string;
  customerName: string;
  planName: string;
  scheduledDate: string;
  statusLabel: string;
  statusTone: "success" | "warning" | "danger" | "primary" | "neutral";
  badgeBg: string;
  badgeColor: string;
  badgeBorder: string;
  address: string;
  itemsSummary: string;
  raw: AdminDelivery;
}

interface StatusConfigEntry {
  label: string;
  tone: PreparedAdminDeliveryViewModel["statusTone"];
  bg: string;
  color: string;
  border: string;
}

const deliveryStatusConfig: Record<string, StatusConfigEntry> = {
  pending: {
    label: "Pendente",
    tone: "warning",
    bg: "rgba(245, 158, 11, 0.15)",
    color: "#F59E0B",
    border: "rgba(245, 158, 11, 0.3)"
  },
  packing: {
    label: "Separando entrega",
    tone: "primary",
    bg: "rgba(255, 198, 101, 0.15)",
    color: "#D4C4B0",
    border: "rgba(255, 198, 101, 0.3)"
  },
  outForDelivery: {
    label: "Saiu para entrega",
    tone: "primary",
    bg: "rgba(255, 198, 101, 0.15)",
    color: "#D4C4B0",
    border: "rgba(255, 198, 101, 0.3)"
  },
  "out-for-delivery": {
    label: "Saiu para entrega",
    tone: "primary",
    bg: "rgba(255, 198, 101, 0.15)",
    color: "#D4C4B0",
    border: "rgba(255, 198, 101, 0.3)"
  },
  delivered: {
    label: "Entregue",
    tone: "success",
    bg: "rgba(16, 185, 129, 0.15)",
    color: "#10B981",
    border: "rgba(16, 185, 129, 0.3)"
  },
  failed: {
    label: "Falhou",
    tone: "danger",
    bg: "rgba(239, 68, 68, 0.15)",
    color: "#EF4444",
    border: "rgba(239, 68, 68, 0.3)"
  },
  cancelled: {
    label: "Cancelada",
    tone: "danger",
    bg: "rgba(239, 68, 68, 0.15)",
    color: "#EF4444",
    border: "rgba(239, 68, 68, 0.3)"
  }
};

export function prepareAdminDeliveryViewModel(
  delivery: AdminDelivery,
  primaryColor = "#D4C4B0"
): PreparedAdminDeliveryViewModel {
  const statusKey = delivery.status || (delivery as any).status_key || "pending";
  const cfg = deliveryStatusConfig[statusKey] || {
    label: statusKey,
    tone: "neutral",
    bg: "rgba(212, 196, 176, 0.12)",
    color: primaryColor,
    border: "rgba(212, 196, 176, 0.3)"
  };

  const badgeColor = cfg.tone === "primary" ? primaryColor : cfg.color;

  return {
    id: delivery.id,
    orderCode: delivery.orderCode || (delivery as any).order_code || "",
    customerName: delivery.customerName || (delivery as any).customer_name || "",
    planName: delivery.planName || "",
    scheduledDate: delivery.scheduledDate || (delivery as any).created_at || "",
    statusLabel: cfg.label,
    statusTone: cfg.tone,
    badgeBg: cfg.bg,
    badgeColor,
    badgeBorder: cfg.border,
    address: delivery.address || "",
    itemsSummary: Array.isArray(delivery.items) ? delivery.items.join(", ") : "",
    raw: delivery
  };
}
