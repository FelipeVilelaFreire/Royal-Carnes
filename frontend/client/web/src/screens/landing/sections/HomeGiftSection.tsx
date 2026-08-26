import React from "react";
import { Button } from "@foundation/ui/Button";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { clientPtBR } from "@/locales/pt-BR";
import { clientThemeManifest } from "@/manifests/theme.manifest";
import { ScrollToAppear } from "@foundation/ui/ScrollToAppear/ScrollToAppear";

export interface HomeGiftSectionProps {
  onRouteClick: (routeKey: string) => void;
}

export const HomeGiftSection: React.FC<HomeGiftSectionProps> = ({ onRouteClick }) => {
  const themeColors = clientThemeManifest.colors;
  const { primary, text, textMuted, border, surface } = themeColors;
  const strings = clientPtBR.landing.gift;

  return (
    <div style={{ width: "100%" }}>
      <ScrollToAppear direction="up">
        <Surface
          style={{
            background: surface,
            border: `1px solid ${primary}`,
            borderRadius: "28px",
            padding: "48px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.7)",
            boxSizing: "border-box"
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(20, 1fr)", gap: "32px", alignItems: "center" }}>
            <div style={{ gridColumn: "1 / span 12", display: "flex", flexDirection: "column", gap: "20px" }}>
              <span
                style={{
                  alignSelf: "flex-start",
                  fontSize: "11px",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  color: primary,
                  background: "rgba(255,198,101,0.12)",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  border: `1px solid ${border}`
                }}
              >
                {strings.badge}
              </span>

              <Text variant="h2" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "40px", margin: 0, lineHeight: 1.2, fontWeight: "800" }}>
                {strings.title}
              </Text>

              <Text variant="body" style={{ color: textMuted, fontSize: "16px", lineHeight: 1.65, maxWidth: "620px" }}>
                {strings.description}
              </Text>

              <div style={{ marginTop: "8px" }}>
                <Button
                  appearance="solid"
                  tone="primary"
                  size="lg"
                  onClick={() => onRouteClick("plans")}
                >
                  {strings.cta} ➔
                </Button>
              </div>
            </div>

            <div style={{ gridColumn: "13 / span 8" }}>
              <div style={{ borderRadius: "20px", overflow: "hidden", border: `1px solid ${border}`, boxShadow: "0 15px 30px rgba(0,0,0,0.8)", height: "300px" }}>
                <img
                  src="https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=800&auto=format&fit=crop"
                  alt="Faca Artesanal de Churrasco"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </Surface>
      </ScrollToAppear>
    </div>
  );
};
