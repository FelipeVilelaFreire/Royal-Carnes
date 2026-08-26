import React from "react";
import { Button } from "@foundation/ui/Button";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { clientPtBR } from "@/locales/pt-BR";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";

export const CatalogScreenType: React.FC = () => {
  const { primary, text, textMuted, border, accentCrimson } = themeColorsDefault.dark;
  const strings = clientPtBR.portal.catalogScreen;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span
          style={{
            alignSelf: "flex-start",
            background: "rgba(255,198,101,0.15)",
            color: primary,
            fontSize: "11px",
            fontWeight: "800",
            padding: "4px 12px",
            borderRadius: "16px",
            border: "1px solid rgba(255,198,101,0.3)"
          }}
        >
          {strings.badge}
        </span>
        <Text variant="h2" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "32px", margin: 0 }}>
          {strings.title}
        </Text>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
        {strings.items.map((item, index) => (
          <Surface
            key={index}
            style={{
              background: "rgba(21, 19, 18, 0.85)",
              border: `1px solid ${border}`,
              borderRadius: "24px",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "20px"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "32px" }}>{item.icon}</span>
                <span style={{ fontSize: "12px", color: textMuted, background: "#1A1817", padding: "4px 10px", borderRadius: "12px" }}>
                  {item.weight}
                </span>
              </div>
              <Text variant="h3" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "20px", margin: 0 }}>
                {item.name}
              </Text>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontSize: "24px", fontWeight: "800", color: primary }}>{item.price}</span>
                <span style={{ fontSize: "14px", color: textMuted, textDecoration: "line-through" }}>{item.oldPrice}</span>
              </div>
            </div>
            <Button appearance="solid" tone="primary" size="sm">
              {strings.ctaAdd}
            </Button>
          </Surface>
        ))}
      </div>
    </div>
  );
};
