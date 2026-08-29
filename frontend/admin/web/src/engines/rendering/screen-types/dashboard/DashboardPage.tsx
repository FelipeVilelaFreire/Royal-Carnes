import React from "react";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { AvatarCell } from "@foundation/ui/Avatar";
import { adminThemeManifest } from "@/manifests/theme.manifest";
import { adminPtBR } from "@/locales/pt-BR";
import { FlameIcon, BoxIcon, TruckIcon, UserIcon, ChevronRightIcon } from "@foundation/ui/Icon/AppIcons";
import type { DashboardConfig } from "../config/types";

export interface DashboardPageProps {
  config: DashboardConfig;
}

function t(key: string, fallback?: string): string {
  if (!key) return fallback || "";
  const parts = key.split(".");
  let current: any = adminPtBR;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return fallback !== undefined ? fallback : key;
    }
  }
  return typeof current === "string" ? current : (fallback || key);
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ config }) => {
  const themeColors = (config as any)?.theme?.colors || adminThemeManifest.colors;
  const { primary, text, textMuted, border, background, surface, surfaceContainer } = themeColors;

  const titleText = t(config.titleKey, adminPtBR.dashboard.title);
  const subtitleText = t(config.subtitleKey, adminPtBR.dashboard.subtitle);

  const renderWidgetIcon = (index: number) => {
    if (index === 0) return <FlameIcon size={20} color={primary} />;
    if (index === 1) return <UserIcon size={20} color={primary} />;
    if (index === 2) return <BoxIcon size={20} color={primary} />;
    return <TruckIcon size={20} color={primary} />;
  };

  const renderStatusBadge = (orderOrStatus: any) => {
    const orderObj = typeof orderOrStatus === "string" ? ({ status: orderOrStatus } as any) : orderOrStatus;
    const statusConfig: Record<string, { label: string; bg: string; color: string; border: string }> = {
      received: { label: "Recebido", bg: "rgba(245, 158, 11, 0.15)", color: "#F59E0B", border: "rgba(245, 158, 11, 0.3)" },
      approved: { label: "Aprovado", bg: "rgba(16, 185, 129, 0.15)", color: "#10B981", border: "rgba(16, 185, 129, 0.3)" },
      separating: { label: "Em Separacao", bg: "rgba(255, 198, 101, 0.15)", color: primary, border: "rgba(255, 198, 101, 0.3)" },
      preparing: { label: "Em Preparo", bg: "rgba(255, 198, 101, 0.15)", color: primary, border: "rgba(255, 198, 101, 0.3)" },
      packing: { label: "Em Embalagem", bg: "rgba(255, 198, 101, 0.15)", color: primary, border: "rgba(255, 198, 101, 0.3)" },
      ready: { label: "Pronto", bg: "rgba(255, 198, 101, 0.15)", color: primary, border: "rgba(255, 198, 101, 0.3)" },
      outForDelivery: { label: "Em Transito", bg: "rgba(255, 198, 101, 0.15)", color: primary, border: "rgba(255, 198, 101, 0.3)" },
      delivered: { label: "Entregue", bg: "rgba(16, 185, 129, 0.15)", color: "#10B981", border: "rgba(16, 185, 129, 0.3)" },
      completed: { label: "Concluido", bg: "rgba(16, 185, 129, 0.15)", color: "#10B981", border: "rgba(16, 185, 129, 0.3)" },
      pending: { label: "Pendente", bg: "rgba(245, 158, 11, 0.15)", color: "#F59E0B", border: "rgba(245, 158, 11, 0.3)" },
      cancelled: { label: "Cancelado", bg: "rgba(239, 68, 68, 0.15)", color: "#EF4444", border: "rgba(239, 68, 68, 0.3)" }
    };
    const vm = statusConfig[orderObj.status] || {
      label: orderObj.statusLabel || orderObj.status || "Status",
      bg: "rgba(212, 196, 176, 0.12)",
      color: primary,
      border: "rgba(212, 196, 176, 0.3)"
    };
    return (
      <span
        style={{
          background: vm.bg,
          color: vm.color,
          fontSize: "12px",
          fontWeight: "700",
          padding: "5px 12px",
          borderRadius: "10px",
          border: `1px solid ${vm.border}`,
          letterSpacing: "0.5px"
        }}
      >
        {vm.label}
      </span>
    );
  };

  return (
    <div style={{ width: "100%", background, minHeight: "100vh", paddingBottom: "60px" }}>
      <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
        <div style={{ display: "flex", flexDirection: "column", gap: "36px", paddingTop: "20px", width: "100%" }}>
          {/* Header Executivo do Dashboard */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <Text variant="h1" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "40px", margin: 0, fontWeight: "800" }}>
                {titleText}
              </Text>
              <Text variant="body" style={{ color: textMuted, fontSize: "15px", marginTop: "6px" }}>
                {subtitleText}
              </Text>
            </div>
          </div>

          {/* Grid de Cards de KPIs com Estética Gourmet Gold */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", width: "100%" }}>
            {config.widgets.map((widget, idx) => (
              <Surface
                key={widget.key}
                style={{
                  background: `linear-gradient(135deg, ${surface} 0%, ${surfaceContainer || surface} 100%)`,
                  border: `1px solid ${border}`,
                  borderRadius: "20px",
                  padding: "24px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  boxSizing: "border-box",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: textMuted, fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.2px" }}>
                    {t(widget.titleKey)}
                  </span>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "12px",
                      background: "rgba(255, 198, 101, 0.12)",
                      border: `1px solid ${border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {renderWidgetIcon(idx)}
                  </div>
                </div>

                <Text variant="h2" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "32px", margin: 0, fontWeight: "800" }}>
                  {widget.value}
                </Text>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#10B981", fontWeight: "700", background: "rgba(16, 185, 129, 0.12)", padding: "3px 8px", borderRadius: "6px" }}>
                    {widget.helper}
                  </span>
                </div>
              </Surface>
            ))}
          </div>

          {/* Tabela de Pedidos em Esteira */}
          {config.recentOrders && (
            <Surface
              style={{
                background: surface,
                border: `1px solid ${border}`,
                borderRadius: "24px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                boxSizing: "border-box",
                boxShadow: "0 12px 32px rgba(0, 0, 0, 0.25)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <BoxIcon size={22} color={primary} />
                  <Text variant="h3" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "22px", margin: 0, fontWeight: "700" }}>
                    {adminPtBR.dashboard.tableTitle}
                  </Text>
                </div>
                <span style={{ fontSize: "13px", color: primary, fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  {adminPtBR.dashboard.viewAllBoxes} <ChevronRightIcon size={16} color={primary} />
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${border}` }}>
                      <th style={{ padding: "14px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>{adminPtBR.dashboard.tableHeaders.order}</th>
                      <th style={{ padding: "14px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>{adminPtBR.dashboard.tableHeaders.member}</th>
                      <th style={{ padding: "14px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>{adminPtBR.dashboard.tableHeaders.plan}</th>
                      <th style={{ padding: "14px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>{adminPtBR.dashboard.tableHeaders.box}</th>
                      <th style={{ padding: "14px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>{adminPtBR.dashboard.tableHeaders.status}</th>
                      <th style={{ padding: "14px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>{adminPtBR.dashboard.tableHeaders.date}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {config.recentOrders.map((order, idx) => (
                      <tr key={idx} style={{ borderBottom: `1px solid ${border}`, transition: "background 0.2s ease" }}>
                        <td style={{ padding: "18px 16px", color: primary, fontWeight: "700", fontSize: "14px" }}>{order.id}</td>
                        <td style={{ padding: "18px 16px", color: text, fontWeight: "600", fontSize: "14px" }}>{order.member}</td>
                        <td style={{ padding: "18px 16px", color: textMuted, fontSize: "14px" }}>{order.plan}</td>
                        <td style={{ padding: "18px 16px", color: textMuted, fontSize: "14px" }}>{order.box}</td>
                        <td style={{ padding: "18px 16px" }}>
                          {renderStatusBadge(order.status)}
                        </td>
                        <td style={{ padding: "18px 16px", color: textMuted, fontSize: "13px" }}>{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Surface>
          )}
        </div>
      </SectionContainer>
    </div>
  );
};
