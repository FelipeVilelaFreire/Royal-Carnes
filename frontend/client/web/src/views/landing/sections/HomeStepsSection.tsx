import React from "react";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { clientPtBR } from "@/manifest/locales/pt-BR";
import { clientThemeManifest } from "@/manifest/theme.manifest";
import { ScrollToAppear } from "@foundation/ui/ScrollToAppear/ScrollToAppear";

export const HomeStepsSection: React.FC = () => {
  const themeColors = clientThemeManifest.colors;
  const { primary, text, textMuted, border, surface } = themeColors;
  const strings = clientPtBR.landing.steps;

  const steps = [strings.step1, strings.step2, strings.step3];

  return (
    <div style={{ width: "100%" }}>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", width: "100%" }}>
        {steps.map((step, index) => (
          <ScrollToAppear key={index} delayMs={index * 120} direction="up">
            <Surface
              style={{
                background: surface,
                border: `1px solid ${border}`,
                borderRadius: "24px",
                padding: "40px 32px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
                boxSizing: "border-box",
                height: "100%"
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(255, 198, 101, 0.12)",
                  border: `2px solid ${primary}`,
                  color: primary,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "26px",
                  fontWeight: "800",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {step.number}
              </div>
              <Text variant="h3" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "24px", margin: 0, fontWeight: "700" }}>
                {step.title}
              </Text>
              <Text variant="body" style={{ color: textMuted, fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                {step.description}
              </Text>
            </Surface>
          </ScrollToAppear>
        ))}
      </div>
    </div>
  );
};
