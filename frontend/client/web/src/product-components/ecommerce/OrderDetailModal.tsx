"use client";

import React, { useMemo } from "react";
import { BottomModal, Modal } from "@/legacy/design-system";
import { CheckIcon } from "@/legacy/design-system/Icons";
import { themeColorsDefault, themeTokens } from "@foundation/tokens/theme.tokens";
import type { RoyalCustomerOrder } from "@royalprime/client/contracts/order.contract";
import { prepareOrderViewModel, type PreparedOrderViewModel } from "@royalprime/client/view-models/orders.view-model";

import { clientPtBR } from "@/locales/pt-BR";

export interface OrderDetailModalProps {
  open: boolean;
  order: RoyalCustomerOrder | null;
  viewModel?: PreparedOrderViewModel | null;
  onClose: () => void;
  isDark: boolean;
  isMobile?: boolean;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  open,
  order,
  viewModel: passedViewModel,
  onClose,
  isDark,
  isMobile = false
}) => {
  const strings = clientPtBR.orderDetailModal;
  const tokens = isDark ? themeColorsDefault.dark : themeColorsDefault.light;
  const Surface = isMobile ? BottomModal : Modal;

  const vm = useMemo(() => {
    if (passedViewModel) return passedViewModel;
    if (order) return prepareOrderViewModel(order);
    return null;
  }, [order, passedViewModel]);

  const currentOrder = vm?.rawOrder;

  const getStatusToneTokens = (tone: "success" | "danger" | "pending" | "active") => {
    if (tone === "success") {
      return {
        color: themeTokens.colors.statusActive,
        background: isDark ? "rgba(16, 185, 129, 0.14)" : "rgba(16, 185, 129, 0.1)",
        border: "rgba(16, 185, 129, 0.32)"
      };
    }
    if (tone === "danger") {
      return {
        color: themeTokens.colors.statusCanceled,
        background: isDark ? "rgba(239, 68, 68, 0.14)" : "rgba(239, 68, 68, 0.1)",
        border: "rgba(239, 68, 68, 0.32)"
      };
    }
    if (tone === "pending") {
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

  const formatKg = (value: number) => (Number.isInteger(value) ? `${value}kg` : `${value.toFixed(1)}kg`);

  return (
    <Surface
      open={open}
      onClose={onClose}
      isDark={isDark}
      maxWidth={780}
      title={currentOrder?.title}
      description={currentOrder && vm ? `${currentOrder.code} - ${vm.kindLabel}` : undefined}
      ariaLabel={strings.title}
    >
      {currentOrder && vm ? (
        <div style={{ display: "grid", gap: isMobile ? "13px" : "15px", minWidth: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) auto", gap: "14px", alignItems: "flex-start" }}>
            <div style={{ display: "grid", gap: "8px", minWidth: 0 }}>
              {(() => {
                const statusTokens = getStatusToneTokens(vm.statusTone);
                return (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", width: "fit-content", border: `1px solid ${statusTokens.border}`, borderRadius: "999px", background: statusTokens.background, color: statusTokens.color, padding: "7px 10px", fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    <span style={{ width: "7px", height: "7px", borderRadius: "999px", background: statusTokens.color }} />
                    {vm.statusLabel}
                  </span>
                );
              })()}
              <p style={{ margin: 0, color: tokens.textMuted, lineHeight: 1.45, fontSize: "13px" }}>{currentOrder.summary}</p>
            </div>
            <div style={{ textAlign: isMobile ? "left" : "right" }}>
              <span style={{ display: "block", color: tokens.textMuted, fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>{strings.totalLabel}</span>
              <strong style={{ color: tokens.text, fontSize: "20px" }}>{vm.moneyLabel}</strong>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))", gap: "8px" }}>
            {[
              { key: "date", label: "Data", value: currentOrder.createdAtLabel },
              { key: "estimate", label: strings.estimateLabel, value: currentOrder.delivery.estimateLabel },
              { key: "payment", label: strings.paymentTitle, value: currentOrder.payment.methodLabel },
              { key: "code", label: strings.deliveryCodeLabel, value: vm.deliveryCodeLabel }
            ].map(({ key, label, value }) => (
              <div key={key} style={{ border: `1px solid ${tokens.border}`, borderRadius: "12px", padding: "10px", background: tokens.surfaceContainer, minWidth: 0 }}>
                <span style={{ display: "block", color: tokens.textMuted, fontSize: "10px", fontWeight: 800, textTransform: "uppercase" }}>{label}</span>
                <strong style={{ color: key === "code" ? tokens.copper : tokens.text, fontSize: key === "code" ? "17px" : "13px", letterSpacing: key === "code" ? "0.08em" : 0 }}>{value}</strong>
              </div>
            ))}
          </div>

          {currentOrder.cycleUsage ? (
            <div style={{ border: `1px solid ${tokens.border}`, borderRadius: "14px", padding: "12px", background: isDark ? "rgba(184, 115, 51, 0.08)" : "rgba(184, 115, 51, 0.04)", minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "baseline", flexWrap: "wrap", marginBottom: "8px" }}>
                <span style={{ display: "block", color: tokens.copper, fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Uso do ciclo de {currentOrder.cycleUsage.cycleLabel}
                </span>
                <span style={{ color: tokens.textMuted, fontSize: "11px", fontWeight: 700 }}>
                  {vm.remainingCycleLabel}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(104px, 1fr))", gap: "8px" }}>
                {[
                  ["Cortes", `${currentOrder.cycleUsage.cutsUsed} / ${currentOrder.cycleUsage.cutsLimit}`],
                  ["Proteina", `${formatKg(currentOrder.cycleUsage.weightKgUsed)} / ${formatKg(currentOrder.cycleUsage.weightKgLimit)}`],
                  ["Carvao", `${formatKg(currentOrder.cycleUsage.charcoalKgUsed)} / ${formatKg(currentOrder.cycleUsage.charcoalKgLimit)}`],
                  ["Compl.", `${currentOrder.cycleUsage.complementsUsed} / ${currentOrder.cycleUsage.complementsLimit}`],
                  ["Utensilio", `${currentOrder.cycleUsage.utensilsUsed} / ${currentOrder.cycleUsage.utensilsLimit}`]
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
              {currentOrder.items.map((item) => (
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
            <div style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${vm.timelineSteps.length}, minmax(92px, 1fr))`, gap: "8px", overflowX: "auto", padding: "8px 2px 4px", maxWidth: "100%" }}>
              <span style={{ position: "absolute", left: "18px", right: "18px", top: "17px", height: "2px", background: tokens.border, opacity: 0.72 }} />
              {vm.timelineSteps.map((step, index) => {
                const isCurrentStep = currentOrder.status === step.status;
                const stepColor = step.completed ? timelineDoneTokens.color : isCurrentStep ? tokens.copper : tokens.border;
                const stepBackground = step.completed ? timelineDoneTokens.background : isCurrentStep ? (isDark ? "rgba(184, 115, 51, 0.14)" : "rgba(184, 115, 51, 0.08)") : tokens.surfaceContainer;
                const stepBorder = step.completed ? timelineDoneTokens.border : isCurrentStep ? (isDark ? "rgba(184, 115, 51, 0.34)" : "rgba(184, 115, 51, 0.28)") : tokens.border;
                return (
                  <div key={step.status} style={{ position: "relative", zIndex: 1, minWidth: "92px", display: "grid", justifyItems: "center", gap: "7px", textAlign: "center" }}>
                    {index < vm.timelineSteps.length - 1 && step.completed ? (
                      <span style={{ position: "absolute", left: "50%", right: "-50%", top: "9px", height: "2px", background: timelineDoneTokens.color }} />
                    ) : null}
                    <span style={{ width: "20px", height: "20px", borderRadius: "999px", background: step.completed ? timelineDoneTokens.color : stepBackground, border: `1px solid ${stepBorder}`, boxShadow: step.completed || isCurrentStep ? `0 0 0 4px ${stepBackground}` : "none", display: "grid", placeItems: "center", color: "#FFFFFF", position: "relative", zIndex: 2 }}>
                      {step.completed ? <CheckIcon size={12} color="#FFFFFF" /> : null}
                    </span>
                    <span style={{ color: step.completed ? timelineDoneTokens.color : isCurrentStep ? tokens.copper : tokens.textMuted, fontSize: "10px", fontWeight: step.completed || isCurrentStep ? 900 : 700, lineHeight: 1.22, maxWidth: "92px" }}>
                      {step.label}
                    </span>
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
