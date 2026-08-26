import React from "react";
import { Button } from "@foundation/ui/Button";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { SectionContainer } from "@foundation/ui/SectionContainer";
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
  const { primary, text, textMuted, border, background, surface } = themeColors;

  const titleText = t(config.titleKey, adminPtBR.dashboard.title);
  const subtitleText = t(config.subtitleKey, adminPtBR.dashboard.subtitle);

  const renderWidgetIcon = (index: number) => {
    if (index === 0) return <FlameIcon size={22} color={primary} />;
    if (index === 1) return <UserIcon size={22} color={primary} />;
    if (index === 2) return <BoxIcon size={22} color={primary} />;
    return <TruckIcon size={22} color={primary} />;
  };

  return (
    <div style={{ width: "100%", background, minHeight: "100vh", paddingBottom: "60px" }}>
      <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
        <div style={{ display: "flex", flexDirection: "column", gap: "36px", paddingTop: "20px", width: "100%" }}>
          {/* Header do Dashboard Admin */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <Text variant="h1" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "42px", margin: 0, fontWeight: "800" }}>
                {titleText}
              </Text>
              <Text variant="body" style={{ color: textMuted, fontSize: "16px", marginTop: "4px" }}>
                {subtitleText}
              </Text>
            </div>
            <Button appearance="solid" tone="primary" size="md">
              {adminPtBR.dashboard.ctaBatchDispatch}
            </Button>
          </div>

          {/* Grid de Widgets (StatWidgets / KPIs) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", width: "100%" }}>
            {config.widgets.map((widget, idx) => (
              <Surface
                key={widget.key}
                style={{
                  background: surface,
                  border: `1px solid ${border}`,
                  borderRadius: "20px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  boxSizing: "border-box"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: textMuted, fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                    {t(widget.titleKey)}
                  </span>
                  {renderWidgetIcon(idx)}
                </div>
                <Text variant="h2" style={{ fontFamily: "'Playfair Display', serif", color: primary, fontSize: "32px", margin: 0, fontWeight: "800" }}>
                  {widget.value}
                </Text>
                <span style={{ fontSize: "13px", color: "#10B981", fontWeight: "600" }}>
                  {widget.helper}
                </span>
              </Surface>
            ))}
          </div>

          {/* Tabela Declarativa do Dashboard */}
          {config.recentOrders && (
            <Surface
              style={{
                background: surface,
                border: `1px solid ${border}`,
                borderRadius: "24px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                boxSizing: "border-box"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                      <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>{adminPtBR.dashboard.tableHeaders.order}</th>
                      <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>{adminPtBR.dashboard.tableHeaders.member}</th>
                      <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>{adminPtBR.dashboard.tableHeaders.plan}</th>
                      <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>{adminPtBR.dashboard.tableHeaders.box}</th>
                      <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>{adminPtBR.dashboard.tableHeaders.status}</th>
                      <th style={{ padding: "12px 16px", color: textMuted, fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px" }}>{adminPtBR.dashboard.tableHeaders.date}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {config.recentOrders.map((order, idx) => (
                      <tr key={idx} style={{ borderBottom: `1px solid ${border}` }}>
                        <td style={{ padding: "16px", color: primary, fontWeight: "700", fontSize: "14px" }}>{order.id}</td>
                        <td style={{ padding: "16px", color: text, fontWeight: "600", fontSize: "14px" }}>{order.member}</td>
                        <td style={{ padding: "16px", color: textMuted, fontSize: "14px" }}>{order.plan}</td>
                        <td style={{ padding: "16px", color: textMuted, fontSize: "14px" }}>{order.box}</td>
                        <td style={{ padding: "16px" }}>
                          <span style={{ background: "rgba(0,229,255,0.12)", color: primary, fontSize: "12px", fontWeight: "700", padding: "4px 10px", borderRadius: "8px", border: `1px solid rgba(0,229,255,0.3)` }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: "16px", color: textMuted, fontSize: "13px" }}>{order.date}</td>
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
