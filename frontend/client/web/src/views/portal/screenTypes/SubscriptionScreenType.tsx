import React from "react";
import { Button } from "@foundation/ui/Button";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { clientPtBR } from "@/manifest/locales/pt-BR";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";

export const SubscriptionScreenType: React.FC = () => {
  const { primary, text, textMuted, border, accentCrimson } = themeColorsDefault.dark;
  const strings = clientPtBR.portal.subscriptionScreen;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", width: "100%" }}>
      {/* Banner Principal da Assinatura */}
      <Surface
        style={{
          background: "linear-gradient(135deg, rgba(255,198,101,0.12) 0%, rgba(21,19,18,0.95) 100%)",
          border: `1px solid ${primary}`,
          borderRadius: "24px",
          padding: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
          flexWrap: "wrap",
          gap: "24px"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                background: "rgba(34,197,94,0.15)",
                color: "#22C55E",
                fontSize: "11px",
                fontWeight: "800",
                padding: "4px 12px",
                borderRadius: "16px",
                border: "1px solid rgba(34,197,94,0.3)"
              }}
            >
              {strings.badge}
            </span>
            <span style={{ fontSize: "14px", color: textMuted }}>{strings.boxWeight}</span>
          </div>

          <Text variant="h1" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "36px", margin: 0, fontWeight: "800" }}>
            {strings.activePlanTitle}
          </Text>

          <Text variant="body" style={{ color: primary, fontSize: "15px", fontWeight: "700" }}>
            {strings.nextDispatch}
          </Text>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Button appearance="solid" tone="primary" size="md">
            {strings.actions.changePlan}
          </Button>
          <Button appearance="outline" tone="neutral" size="md">
            {strings.actions.pause}
          </Button>
        </div>
      </Surface>

      {/* Grid de Cortes da Caixa do Mês */}
      <div>
        <Text variant="h2" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "28px", marginBottom: "20px" }}>
          {strings.boxItemsTitle}
        </Text>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
          {strings.items.map((item, index) => (
            <Surface
              key={index}
              style={{
                background: "rgba(21, 19, 18, 0.85)",
                border: `1px solid ${border}`,
                borderRadius: "20px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "28px" }}>🥩</span>
                <span style={{ fontSize: "12px", fontWeight: "800", color: primary, background: "rgba(255,198,101,0.15)", padding: "2px 10px", borderRadius: "12px" }}>
                  {item.weight}
                </span>
              </div>
              <Text variant="h3" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "18px", margin: 0 }}>
                {item.name}
              </Text>
              <Text variant="caption" style={{ color: textMuted, fontSize: "13px" }}>
                {item.detail}
              </Text>
            </Surface>
          ))}
        </div>
      </div>
    </div>
  );
};
