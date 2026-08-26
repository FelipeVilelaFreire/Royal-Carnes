import React from "react";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { adminThemeManifest } from "@/manifests/theme.manifest";
import { adminPtBR } from "@/locales/pt-BR";
import { settingsConfig } from "@/manifests/pages/settings.config";
import { SettingsIcon, SnowflakeIcon, CheckIcon, StoreIcon } from "@foundation/ui/Icon/AppIcons";

export interface SettingsPageProps {
  config?: typeof settingsConfig;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ config = settingsConfig }) => {
  const themeColors = adminThemeManifest.colors;
  const { primary, text, textMuted, border, background, surface, surfaceContainer } = themeColors;

  const settingsData = config?.settings || {
    brandName: "ROYAL PRIME",
    recurrencyProvider: "Stripe Subscriptions",
    recurrencyStatus: "ativo",
    coldChainSensor: "Sensor IoT -2°C",
    coldChainStatus: "monitorando",
    fulfillmentWarehouse: "Central Gastronômica SP-01"
  };

  return (
    <div style={{ width: "100%", background, minHeight: "100vh", paddingBottom: "60px" }}>
      <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingTop: "20px", width: "100%" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <SettingsIcon size={32} color={primary} />
              <Text variant="h1" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "40px", margin: 0, fontWeight: "800" }}>
                {adminPtBR.configuracoes.title}
              </Text>
            </div>
            <Text variant="body" style={{ color: textMuted, fontSize: "15px", marginTop: "4px" }}>
              {adminPtBR.configuracoes.subtitle}
            </Text>
          </div>

          <Surface
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: "24px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}
          >
            <Text variant="h2" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "24px", margin: 0, fontWeight: "700" }}>
              {adminPtBR.configuracoes.sectionOperation}
            </Text>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              <div style={{ background: surfaceContainer || surface, padding: "20px", borderRadius: "16px", border: `1px solid ${border}` }}>
                <span style={{ fontSize: "14px", color: text, fontWeight: "700", display: "block", marginBottom: "4px" }}>
                  {adminPtBR.configuracoes.cards.brand}
                </span>
                <span style={{ fontSize: "13px", color: textMuted }}>{settingsData.brandName}</span>
              </div>

              <div style={{ background: surfaceContainer || surface, padding: "20px", borderRadius: "16px", border: `1px solid ${border}` }}>
                <span style={{ fontSize: "14px", color: text, fontWeight: "700", display: "block", marginBottom: "4px" }}>
                  {adminPtBR.configuracoes.cards.recurrency}
                </span>
                <span style={{ fontSize: "13px", color: "#10B981", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <CheckIcon size={16} color="#10B981" /> {settingsData.recurrencyProvider} ({settingsData.recurrencyStatus})
                </span>
              </div>

              <div style={{ background: surfaceContainer || surface, padding: "20px", borderRadius: "16px", border: `1px solid ${border}` }}>
                <span style={{ fontSize: "14px", color: text, fontWeight: "700", display: "block", marginBottom: "4px" }}>
                  {adminPtBR.configuracoes.cards.coldChain}
                </span>
                <span style={{ fontSize: "13px", color: primary, fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <SnowflakeIcon size={16} color={primary} /> {settingsData.coldChainSensor} ({settingsData.coldChainStatus})
                </span>
              </div>

              <div style={{ background: surfaceContainer || surface, padding: "20px", borderRadius: "16px", border: `1px solid ${border}` }}>
                <span style={{ fontSize: "14px", color: text, fontWeight: "700", display: "block", marginBottom: "4px" }}>
                  {adminPtBR.configuracoes.cards.warehouse}
                </span>
                <span style={{ fontSize: "13px", color: textMuted, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <StoreIcon size={16} color={primary} /> {settingsData.fulfillmentWarehouse}
                </span>
              </div>
            </div>
          </Surface>
        </div>
      </SectionContainer>
    </div>
  );
};
