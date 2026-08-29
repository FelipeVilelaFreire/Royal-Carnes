import type { AdminOrder } from "../contracts/admin-order.contract";

export interface PreparedAdminOrderViewModel {
  id: string;
  code: string;
  customerName: string;
  email: string;
  kindLabel: string;
  summary: string;
  totalFormatted: string;
  statusLabel: string;
  statusTone: "success" | "warning" | "danger" | "primary" | "neutral";
  badgeBg: string;
  badgeColor: string;
  badgeBorder: string;
  createdAt: string;
  raw: AdminOrder;
}

interface StatusConfigEntry {
  label: string;
  tone: PreparedAdminOrderViewModel["statusTone"];
  bg: string;
  color: string;
  border: string;
}

const statusConfig: Record<string, StatusConfigEntry> = {
  received: {
    label: "Recebido",
    tone: "warning",
    bg: "rgba(245, 158, 11, 0.15)",
    color: "#F59E0B",
    border: "rgba(245, 158, 11, 0.3)"
  },
  approved: {
    label: "Aprovado",
    tone: "success",
    bg: "rgba(16, 185, 129, 0.15)",
    color: "#10B981",
    border: "rgba(16, 185, 129, 0.3)"
  },
  separating: {
    label: "Em Separacao",
    tone: "primary",
    bg: "rgba(255, 198, 101, 0.15)",
    color: "#D4C4B0",
    border: "rgba(255, 198, 101, 0.3)"
  },
  packing: {
    label: "Em Embalagem",
    tone: "primary",
    bg: "rgba(255, 198, 101, 0.15)",
    color: "#D4C4B0",
    border: "rgba(255, 198, 101, 0.3)"
  },
  ready: {
    label: "Pronto",
    tone: "primary",
    bg: "rgba(255, 198, 101, 0.15)",
    color: "#D4C4B0",
    border: "rgba(255, 198, 101, 0.3)"
  },
  outForDelivery: {
    label: "Em Transito",
    tone: "primary",
    bg: "rgba(255, 198, 101, 0.15)",
    color: "#D4C4B0",
    border: "rgba(255, 198, 101, 0.3)"
  },
  completed: {
    label: "Concluido",
    tone: "success",
    bg: "rgba(16, 185, 129, 0.15)",
    color: "#10B981",
    border: "rgba(16, 185, 129, 0.3)"
  },
  delivered: {
    label: "Entregue",
    tone: "success",
    bg: "rgba(16, 185, 129, 0.15)",
    color: "#10B981",
    border: "rgba(16, 185, 129, 0.3)"
  },
  pending: {
    label: "Pendente",
    tone: "warning",
    bg: "rgba(245, 158, 11, 0.15)",
    color: "#F59E0B",
    border: "rgba(245, 158, 11, 0.3)"
  },
  cancelled: {
    label: "Cancelado",
    tone: "danger",
    bg: "rgba(239, 68, 68, 0.15)",
    color: "#EF4444",
    border: "rgba(239, 68, 68, 0.3)"
  }
};

export function prepareAdminOrderViewModel(order: AdminOrder, primaryColor = "#D4C4B0"): PreparedAdminOrderViewModel {
  const statusKey = order.status || (order as any).status_key || "received";
  const cfg = statusConfig[statusKey] || {
    label: order.statusLabel || statusKey,
    tone: "neutral",
    bg: "rgba(212, 196, 176, 0.12)",
    color: primaryColor,
    border: "rgba(212, 196, 176, 0.3)"
  };

  const badgeColor = cfg.tone === "primary" ? primaryColor : cfg.color;

  return {
    id: order.id,
    code: order.code,
    customerName: order.customerName,
    email: order.email,
    kindLabel: order.kindLabel,
    summary: order.summary,
    totalFormatted: order.totalFormatted,
    statusLabel: cfg.label,
    statusTone: cfg.tone,
    badgeBg: cfg.bg,
    badgeColor,
    badgeBorder: cfg.border,
    createdAt: order.createdAt,
    raw: order
  };
}
