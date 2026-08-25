import React from "react";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { clientPtBR } from "@/manifest/locales/pt-BR";
import { clientThemeManifest } from "@/manifest/theme.manifest";
import { ScrollToAppear } from "@foundation/ui/ScrollToAppear/ScrollToAppear";

export const HomeShowcaseSection: React.FC = () => {
  const themeColors = clientThemeManifest.colors;
  const { primary, text, textMuted, border, surface } = themeColors;
  const strings = clientPtBR.landing.showcase;

  const cards = [
    {
      ...strings.tomahawk,
      image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=800&auto=format&fit=crop"
    },
    {
      ...strings.wagyu,
      image: "https://images.unsplash.com/photo-1546964124-0cce460f38ef?q=80&w=800&auto=format&fit=crop"
    },
    {
      ...strings.picanha,
      image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=800&auto=format&fit=crop"
    }
  ];

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
          <Text variant="body" style={{ color: textMuted, fontSize: "16px", marginTop: "8px" }}>
            {strings.subtitle}
          </Text>
        </div>
      </ScrollToAppear>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", width: "100%" }}>
        {cards.map((card, index) => (
          <ScrollToAppear key={index} delayMs={index * 120} direction="up">
            <Surface
              style={{
                background: surface,
                border: `1px solid ${border}`,
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                height: "100%"
              }}
            >
              <div style={{ height: "280px", position: "relative", overflow: "hidden" }}>
                <img src={card.image} alt={card.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(11,9,8,0.95) 100%)" }} />
                <span
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    background: "rgba(11, 9, 8, 0.85)",
                    backdropFilter: "blur(8px)",
                    color: primary,
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    border: `1px solid ${border}`,
                    textTransform: "uppercase",
                    letterSpacing: "1px"
                  }}
                >
                  {card.badge}
                </span>
              </div>
              <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <Text variant="h3" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "24px", margin: 0, fontWeight: "700" }}>
                  {card.title}
                </Text>
                <Text variant="body" style={{ color: textMuted, fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                  {card.description}
                </Text>
              </div>
            </Surface>
          </ScrollToAppear>
        ))}
      </div>
    </div>
  );
};
