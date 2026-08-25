import React from "react";
import { Button } from "@foundation/ui/Button";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { adminThemeManifest } from "@/manifest/theme.manifest";
import { FlameIcon, BoxIcon, TruckIcon, UserIcon } from "@foundation/ui/Icon/AppIcons";
import type { DashboardConfig } from "../config/types";

export interface DashboardPageProps {
  config: DashboardConfig;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ config }) => {
  const themeColors = (config as any)?.theme?.colors || adminThemeManifest.colors;
  const { primary, text, textMuted, border, background, surface } = themeColors;

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
                {config.titleKey}
              </Text>
              <Text variant="body" style={{ color: textMuted, fontSize: "16px", marginTop: "4px" }}>
                {config.subtitleKey}
              </Text>
            </div>
            <Button appearance="solid" tone="primary" size="md">
              Iniciar Despacho em Lote
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
                    {widget.titleKey}
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
                    Últimos Pedidos em Esteira
                  </Text>
                </div>
                <span style={{ fontSize: "13px", color: primary, fontWeight: "700", cursor: "pointer" }}>
                  Ver todas as caixas ➔
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${border}` }}>
                      <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Pedido</th>
                      <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Sócio</th>
                      <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Plano</th>
                      <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Caixa</th>
                      <th style={{ padding: "12px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Status</th>
                      <th style={{ padding: "12px 16px", color: textMuted, fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px" }}>Data</th>
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
