"use client";

import React from "react";
import { BottomModal, Modal } from "@/legacy/design-system";
import { themeColorsDefault, themeTokens } from "@foundation/tokens/theme.tokens";
import { royalOrderKindLabels, royalOrderStatusLabels, type RoyalCustomerOrder } from "@/mocks/orders";

export interface OrderDetailModalProps {
  open: boolean;
  order: RoyalCustomerOrder | null;
  onClose: () => void;
  isDark: boolean;
  isMobile?: boolean;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  open,
  order,
  onClose,
  isDark,
  isMobile = false
}) => {
  const tokens = isDark ? themeColorsDefault.dark : themeColorsDefault.light;
  const Surface = isMobile ? BottomModal : Modal;

  const formatOrderTotal = (currentOrder: RoyalCustomerOrder) =>
    currentOrder.kind === "subscriptionCycle"
      ? currentOrder.payment.totalLabel
      : `R$ ${currentOrder.payment.totalLabel}`;

  const getDeliveryCodeLabel = (currentOrder: RoyalCustomerOrder) => {
    if (currentOrder.delivery.deliveryCode) return currentOrder.delivery.deliveryCode;
    if (currentOrder.status === "delivered") return "Validado";
    if (currentOrder.status === "cancelled") return "Nao aplicado";
    return "Pendente";
  };

  const formatKg = (value: number) => Number.isInteger(value) ? `${value}kg` : `${value.toFixed(1)}kg`;

  const getRemainingCycleLabel = (currentOrder: RoyalCustomerOrder) => {
    if (!currentOrder.cycleUsage) return null;
    const remainingWeight = Math.max(0, currentOrder.cycleUsage.weightKgLimit - currentOrder.cycleUsage.weightKgUsed);
    const remainingCuts = Math.max(0, currentOrder.cycleUsage.cutsLimit - currentOrder.cycleUsage.cutsUsed);
    const remainingComplements = Math.max(0, currentOrder.cycleUsage.complementsLimit - currentOrder.cycleUsage.complementsUsed);
    return `${formatKg(remainingWeight)} de proteina, ${remainingCuts} cortes e ${remainingComplements} complementos restantes`;
  };

  const getStatusTokens = (status: RoyalCustomerOrder["status"]) => {
    if (status === "delivered") {
      return {
        color: themeTokens.colors.statusActive,
        background: isDark ? "rgba(16, 185, 129, 0.14)" : "rgba(16, 185, 129, 0.1)",
        border: "rgba(16, 185, 129, 0.32)"
      };
    }
    if (status === "cancelled") {
      return {
        color: themeTokens.colors.statusCanceled,
        background: isDark ? "rgba(239, 68, 68, 0.14)" : "rgba(239, 68, 68, 0.1)",
        border: "rgba(239, 68, 68, 0.32)"
      };
    }
    if (status === "sentToStore") {
      return {
        color: themeTokens.colors.statusPaused,
        background: isDark ? "rgba(245, 158, 11, 0.14)" : "rgba(245, 158, 11, 0.1)",
        border: "rgba(245, 158, 11, 0.32)"
      };
    }
    return {
      color: tokens.copper,
      background: isDark ? "rgba(184, 115, 51, 0.14)" : "rgba(184, 115, 51, 0.08)",
      border: isDark ? "rgba(184, 115, 51, 0.32)" : "rgba(184, 115, 51, 0.26)"
    };
  };

  const timelineDoneTokens = {
    color: themeTokens.colors.statusActive,
    background: isDark ? "rgba(16, 185, 129, 0.14)" : "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.36)"
  };

  const renderStatusPill = (currentOrder: RoyalCustomerOrder) => {
    const statusTokens = getStatusTokens(currentOrder.status);
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", width: "fit-content", border: `1px solid ${statusTokens.border}`, borderRadius: "999px", background: statusTokens.background, color: statusTokens.color, padding: "7px 10px", fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        <span style={{ width: "7px", height: "7px", borderRadius: "999px", background: statusTokens.color }} />
        {royalOrderStatusLabels[currentOrder.status]}
      </span>
    );
  };

  return (
    <Surface
      open={open}
      onClose={onClose}
      isDark={isDark}
      maxWidth={780}
      title={order?.title}
      description={order ? `${order.code} - ${royalOrderKindLabels[order.kind]}` : undefined}
      ariaLabel="Detalhes do pedido"
    >
      {order ? (
        <div style={{ display: "grid", gap: isMobile ? "13px" : "15px", minWidth: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) auto", gap: "14px", alignItems: "flex-start" }}>
            <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
              {renderStatusPill(order)}
              <p style={{ margin: 0, color: tokens.textMuted, lineHeight: 1.45, fontSize: "13px" }}>{order.summary}</p>
            </div>
            <div style={{ textAlign: isMobile ? "left" : "right" }}>
              <span style={{ display: "block", color: tokens.textMuted, fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Total</span>
              <strong style={{ color: tokens.text, fontSize: "20px" }}>{formatOrderTotal(order)}</strong>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))", gap: "8px" }}>
            {[
              ["Data", order.createdAtLabel],
              ["Entrega", order.delivery.estimateLabel],
              ["Pagamento", order.payment.methodLabel],
              ["Codigo", getDeliveryCodeLabel(order)]
            ].map(([label, value]) => (
              <div key={label} style={{ border: `1px solid ${tokens.border}`, borderRadius: "12px", padding: "10px", background: tokens.surfaceContainer, minWidth: 0 }}>
                <span style={{ display: "block", color: tokens.textMuted, fontSize: "10px", fontWeight: 800, textTransform: "uppercase" }}>{label}</span>
                <strong style={{ color: label === "Codigo" ? tokens.copper : tokens.text, fontSize: label === "Codigo" ? "17px" : "13px", letterSpacing: label === "Codigo" ? "0.08em" : 0 }}>{value}</strong>
              </div>
            ))}
          </div>

          {order.cycleUsage ? (
            <div style={{ border: `1px solid ${tokens.border}`, borderRadius: "14px", padding: "12px", background: isDark ? "rgba(184, 115, 51, 0.08)" : "rgba(184, 115, 51, 0.04)", minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "baseline", flexWrap: "wrap", marginBottom: "8px" }}>
                <span style={{ display: "block", color: tokens.copper, fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Uso do ciclo de {order.cycleUsage.cycleLabel}
                </span>
                <span style={{ color: tokens.textMuted, fontSize: "11px", fontWeight: 700 }}>
                  {getRemainingCycleLabel(order)}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(104px, 1fr))", gap: "8px" }}>
                {[
                  ["Cortes", `${order.cycleUsage.cutsUsed} / ${order.cycleUsage.cutsLimit}`],
                  ["Proteina", `${formatKg(order.cycleUsage.weightKgUsed)} / ${formatKg(order.cycleUsage.weightKgLimit)}`],
                  ["Carvao", `${formatKg(order.cycleUsage.charcoalKgUsed)} / ${formatKg(order.cycleUsage.charcoalKgLimit)}`],
                  ["Compl.", `${order.cycleUsage.complementsUsed} / ${order.cycleUsage.complementsLimit}`],
                  ["Utensilio", `${order.cycleUsage.utensilsUsed} / ${order.cycleUsage.utensilsLimit}`]
                ].map(([label, value]) => (
                  <div key={label} style={{ border: `1px solid ${tokens.border}`, borderRadius: "10px", padding: "9px", background: tokens.background, minWidth: 0, minHeight: "58px", display: "grid", alignContent: "space-between" }}>
                    <span style={{ display: "block", color: tokens.textMuted, fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
                    <strong style={{ color: tokens.text, fontSize: "14px" }}>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div style={{ minWidth: 0 }}>
            <h3 style={{ margin: "0 0 10px", color: tokens.text, fontSize: "15px" }}>Itens do pedido</h3>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))", gap: "8px", maxHeight: isMobile ? "220px" : "178px", overflowY: "auto", paddingRight: "4px" }}>
              {order.items.map((item) => (
                <div key={item.productId} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "10px", alignItems: "center", border: `1px solid ${tokens.border}`, borderRadius: "10px", padding: "9px", minWidth: 0 }}>
                  <div style={{ minWidth: 0 }}>
                    <strong style={{ display: "block", color: tokens.text, overflowWrap: "anywhere" }}>{item.name}</strong>
                    <span style={{ color: tokens.textMuted, fontSize: "12px" }}>{item.category || "item"} - {item.unitLabel}</span>
                  </div>
                  <span style={{ color: tokens.textMuted, fontWeight: 800 }}>{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            <h3 style={{ margin: "0 0 10px", color: tokens.text, fontSize: "15px" }}>Acompanhamento</h3>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 0, overflowX: "auto", padding: "4px 0 6px", maxWidth: "100%" }}>
              {order.timeline.map((step, index) => {
                const isCurrentStep = order.status === step.status;
                const stepColor = step.completed ? timelineDoneTokens.color : isCurrentStep ? tokens.copper : tokens.border;
                const stepBackground = step.completed ? timelineDoneTokens.background : isCurrentStep ? (isDark ? "rgba(184, 115, 51, 0.14)" : "rgba(184, 115, 51, 0.08)") : tokens.surfaceContainer;
                const stepBorder = step.completed ? timelineDoneTokens.border : isCurrentStep ? (isDark ? "rgba(184, 115, 51, 0.34)" : "rgba(184, 115, 51, 0.28)") : tokens.border;
                return (
                  <div key={step.status} style={{ display: "flex", alignItems: "flex-start", minWidth: "104px", flex: "1 0 104px" }}>
                    <div style={{ display: "grid", gap: "7px", minWidth: "72px" }}>
                      <span style={{ width: "12px", height: "12px", borderRadius: "999px", background: stepColor, border: `1px solid ${stepBorder}`, boxShadow: step.completed || isCurrentStep ? `0 0 0 3px ${stepBackground}` : "none" }} />
                      <span style={{ color: step.completed ? timelineDoneTokens.color : isCurrentStep ? tokens.copper : tokens.textMuted, fontSize: "10px", fontWeight: step.completed || isCurrentStep ? 800 : 600, lineHeight: 1.25 }}>
                        {step.label}
                      </span>
                    </div>
                    {index < order.timeline.length - 1 ? (
                      <span style={{ height: "1px", minWidth: "28px", flex: 1, margin: "6px 8px 0", background: step.completed ? timelineDoneTokens.border : tokens.border, opacity: step.completed ? 1 : 0.65 }} />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </Surface>
  );
};
