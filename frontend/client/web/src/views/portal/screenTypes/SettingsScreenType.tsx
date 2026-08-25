import React from "react";
import { Button } from "@foundation/ui/Button";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { clientPtBR } from "@/manifest/locales/pt-BR";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";

export const SettingsScreenType: React.FC = () => {
  const { primary, text, textMuted, border } = themeColorsDefault.dark;
  const strings = clientPtBR.portal.settingsScreen;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", width: "100%", maxWidth: "800px" }}>
      <Text variant="h2" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "32px", margin: 0 }}>
        {strings.title}
      </Text>

      {/* Endereço */}
      <Surface
        style={{
          background: "rgba(21, 19, 18, 0.85)",
          border: `1px solid ${border}`,
          borderRadius: "20px",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}
      >
        <Text variant="h3" style={{ color: primary, fontSize: "18px", margin: 0, fontWeight: "700" }}>
          📍 {strings.addressTitle}
        </Text>
        <Text variant="body" style={{ color: text, fontSize: "15px" }}>
          {strings.address}
        </Text>
      </Surface>

      {/* Pagamento */}
      <Surface
        style={{
          background: "rgba(21, 19, 18, 0.85)",
          border: `1px solid ${border}`,
          borderRadius: "20px",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}
      >
        <Text variant="h3" style={{ color: primary, fontSize: "18px", margin: 0, fontWeight: "700" }}>
          💳 {strings.paymentTitle}
        </Text>
        <Text variant="body" style={{ color: text, fontSize: "15px" }}>
          {strings.paymentCard}
        </Text>
      </Surface>

      <div>
        <Button appearance="solid" tone="primary" size="md">
          {strings.ctaSave}
        </Button>
      </div>
    </div>
  );
};
