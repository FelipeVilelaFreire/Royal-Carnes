import React from "react";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { clientPtBR } from "@/manifest/locales/pt-BR";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";

export const TrackingScreenType: React.FC = () => {
  const { primary, text, textMuted, border } = themeColorsDefault.dark;
  const strings = clientPtBR.portal.trackingScreen;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", width: "100%" }}>
      <Surface
        style={{
          background: "rgba(21, 19, 18, 0.9)",
          border: `1px solid ${border}`,
          borderRadius: "24px",
          padding: "36px"
        }}
      >
        <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <Text variant="h2" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "28px", margin: 0 }}>
              {strings.title}
            </Text>
            <Text variant="body" style={{ color: textMuted, fontSize: "14px", marginTop: "4px" }}>
              {strings.carrier}
            </Text>
          </div>
          <div style={{ background: "#1A1817", border: `1px solid ${border}`, padding: "8px 16px", borderRadius: "12px" }}>
            <span style={{ fontSize: "12px", color: textMuted }}>{strings.trackingCodeLabel} </span>
            <span style={{ fontSize: "13px", fontWeight: "800", color: primary }}>{strings.trackingCode}</span>
          </div>
        </div>

        {/* Timeline Visual em 4 Etapas */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative" }}>
          {strings.steps.map((step, index) => {
            const isCompleted = step.status === "completed";
            const isActive = step.status === "active";
            return (
              <div key={index} style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: isCompleted ? "#22C55E" : isActive ? primary : "rgba(255,255,255,0.1)",
                    color: isCompleted || isActive ? "#0B0908" : textMuted,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "900",
                    fontSize: "14px",
                    flexShrink: 0
                  }}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <Text variant="h3" style={{ color: isActive ? primary : text, fontSize: "18px", margin: 0, fontWeight: "700" }}>
                    {step.label}
                  </Text>
                  <Text variant="caption" style={{ color: textMuted, fontSize: "13px" }}>
                    {step.date}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      </Surface>
    </div>
  );
};
