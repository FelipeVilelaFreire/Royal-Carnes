import React from "react";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { clientPtBR } from "@/locales/pt-BR";
import { clientThemeManifest } from "@/manifests/theme.manifest";
import { SnowflakeIcon, CheckIcon, FlameIcon } from "@foundation/ui/Icon/AppIcons";
import { ScrollToAppear } from "@foundation/ui/ScrollToAppear/ScrollToAppear";

export const HomeDifferentialsSection: React.FC = () => {
  const themeColors = clientThemeManifest.colors;
  const { primary, text, textMuted, border, surface } = themeColors;
  const strings = clientPtBR.landing.differentials;

  const items = [
    { icon: <SnowflakeIcon size={26} color={primary} />, ...strings.coldChain },
    { icon: <CheckIcon size={26} color={primary} />, ...strings.curatorship },
    { icon: <FlameIcon size={26} color={primary} />, ...strings.flexibility }
  ];

  return (
    <div style={{ width: "100%", padding: "20px 0" }}>
      <ScrollToAppear direction="up">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: primary, letterSpacing: "2px", textTransform: "uppercase" }}>
            {strings.badge}
          </span>
          <Text variant="h2" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "40px", margin: "8px 0 0 0", fontWeight: "800" }}>
            {strings.title}
          </Text>
        </div>
      </ScrollToAppear>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "32px",
          width: "100%"
        }}
      >
        {items.map((item, index) => (
          <ScrollToAppear key={index} delayMs={index * 120} direction="up">
            <Surface
              style={{
                background: surface,
                border: `1px solid ${border}`,
                borderRadius: "24px",
                padding: "40px 32px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.6)",
                boxSizing: "border-box",
                height: "100%"
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: "rgba(255, 198, 101, 0.12)",
                  border: `1px solid ${border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {item.icon}
              </div>
              <Text variant="h3" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "24px", margin: 0, fontWeight: "700" }}>
                {item.title}
              </Text>
              <Text variant="body" style={{ color: textMuted, fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                {item.description}
              </Text>
            </Surface>
          </ScrollToAppear>
        ))}
      </div>
    </div>
  );
};
