import React from "react";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { adminThemeManifest } from "@/manifest/theme.manifest";
import { SettingsIcon, SnowflakeIcon, CheckIcon } from "@foundation/ui/Icon/AppIcons";

export const SettingsPage: React.FC = () => {
  const themeColors = adminThemeManifest.colors;
  const { primary, text, textMuted, border, background, surface, surfaceContainer } = themeColors;

  return (
    <div style={{ width: "100%", background, minHeight: "100vh", paddingBottom: "60px" }}>
      <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingTop: "20px", width: "100%" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <SettingsIcon size={32} color={primary} />
              <Text variant="h1" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "40px", margin: 0, fontWeight: "800" }}>
                Configurações Gerais
              </Text>
            </div>
            <Text variant="body" style={{ color: textMuted, fontSize: "15px", marginTop: "4px" }}>
              Parâmetros operacionais do clube, integrações de pagamento e cadeia de frio.
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
              Parâmetros de Operação
            </Text>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              <div style={{ background: surfaceContainer || surface, padding: "20px", borderRadius: "16px", border: `1px solid ${border}` }}>
                <span style={{ fontSize: "14px", color: text, fontWeight: "700", display: "block" }}>Marca Global</span>
                <span style={{ fontSize: "13px", color: textMuted }}>ROYAL PRIME</span>
              </div>
              <div style={{ background: surfaceContainer || surface, padding: "20px", borderRadius: "16px", border: `1px solid ${border}` }}>
                <span style={{ fontSize: "14px", color: text, fontWeight: "700", display: "block" }}>Recorrência</span>
                <span style={{ fontSize: "13px", color: "#10B981", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <CheckIcon size={16} color="#10B981" /> Stripe Ativo
                </span>
              </div>
              <div style={{ background: surfaceContainer || surface, padding: "20px", borderRadius: "16px", border: `1px solid ${border}` }}>
                <span style={{ fontSize: "14px", color: text, fontWeight: "700", display: "block" }}>Cadeia de Frio</span>
                <span style={{ fontSize: "13px", color: primary, fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <SnowflakeIcon size={16} color={primary} /> Sensor -2°C Ativo
                </span>
              </div>
            </div>
          </Surface>
        </div>
      </SectionContainer>
    </div>
  );
};
