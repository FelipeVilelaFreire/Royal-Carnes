import React from "react";
import { Button } from "@foundation/ui/Button";
import { Text } from "@foundation/ui/Text";
import { clientPtBR } from "@/manifest/locales/pt-BR";
import { clientThemeManifest } from "@/manifest/theme.manifest";

export interface HomeHeroSectionProps {
  onRouteClick: (routeKey: string) => void;
}

export const HomeHeroSection: React.FC<HomeHeroSectionProps> = ({ onRouteClick }) => {
  const themeColors = clientThemeManifest.colors;
  const { primary, text, textMuted, border } = themeColors;
  const strings = clientPtBR.landing.hero;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        minHeight: "75vh",
        paddingTop: "40px",
        paddingBottom: "40px"
      }}
    >
      <div style={{ maxWidth: "760px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Badge Pill com Ponto Pulsante */}
        <div
          style={{
            alignSelf: "flex-start",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(21, 19, 18, 0.8)",
            color: textMuted,
            padding: "8px 20px",
            borderRadius: "9999px",
            fontSize: "11px",
            fontWeight: "800",
            letterSpacing: "2px",
            textTransform: "uppercase",
            border: `1px solid ${border}`,
            backdropFilter: "blur(12px)"
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#A40213", boxShadow: "0 0 10px #A40213" }} />
          <span>{strings.badge}</span>
        </div>

        {/* Headline Principal Playfair 56px */}
        <Text
          variant="h1"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: text,
            fontSize: "60px",
            fontWeight: "800",
            lineHeight: 1.12,
            margin: 0
          }}
        >
          {strings.title}
        </Text>

        {/* Subtítulo Editorial */}
        <Text
          variant="body"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: textMuted,
            fontSize: "18px",
            lineHeight: 1.65,
            maxWidth: "680px",
            margin: 0
          }}
        >
          {strings.subtitle}
        </Text>

        {/* Botões CTA */}
        <div style={{ display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <Button
            appearance="solid"
            tone="primary"
            size="lg"
            onClick={() => {
              document.getElementById("assinaturas")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {strings.ctaPlans} ➔
          </Button>

          <Button
            appearance="outline"
            tone="neutral"
            size="lg"
            onClick={() => {
              document.getElementById("selecao")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {strings.ctaShowcase}
          </Button>
        </div>
      </div>
    </div>
  );
};
