import React, { useState } from "react";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { clientPtBR } from "@/locales/pt-BR";
import { clientThemeManifest } from "@/manifests/theme.manifest";

export const HomeFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const themeColors = clientThemeManifest.colors;
  const { primary, text, textMuted, border, surface } = themeColors;
  const strings = clientPtBR.landing.faq;

  const faqs = [strings.q1, strings.q2, strings.q3];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ width: "100%", maxWidth: "840px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "44px" }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color: primary, letterSpacing: "2px", textTransform: "uppercase" }}>
          {strings.badge}
        </span>
        <Text variant="h2" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "42px", margin: "8px 0 0 0", fontWeight: "800" }}>
          {strings.title}
        </Text>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <Surface
              key={index}
              style={{
                background: surface,
                border: `1px solid ${isOpen ? primary : border}`,
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: isOpen ? "0 12px 30px rgba(255, 198, 101, 0.15)" : "0 4px 15px rgba(0,0,0,0.4)",
                transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              <button
                onClick={() => toggleFaq(index)}
                style={{
                  width: "100%",
                  padding: "24px 28px",
                  background: "transparent",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  textAlign: "left",
                  outline: "none"
                }}
              >
                <Text
                  variant="h3"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: isOpen ? primary : text,
                    fontSize: "18px",
                    fontWeight: "700",
                    margin: 0,
                    transition: "color 0.35s ease"
                  }}
                >
                  {faq.question}
                </Text>
                <span
                  style={{
                    color: primary,
                    fontSize: "16px",
                    fontWeight: "700",
                    transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    display: "inline-block",
                    marginLeft: "16px"
                  }}
                >
                  ▼
                </span>
              </button>

              {/* Animaçao de Grid CSS de Alta Performance para Abertura/Fechamento Suave e Fluida */}
              <div
                style={{
                  display: "grid",
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                  opacity: isOpen ? 1 : 0,
                  transition: "grid-template-rows 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease"
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <div style={{ padding: "0 28px 24px 28px", borderTop: `1px solid ${border}` }}>
                    <Text variant="body" style={{ color: textMuted, fontSize: "15px", lineHeight: 1.7, margin: "16px 0 0 0" }}>
                      {faq.answer}
                    </Text>
                  </div>
                </div>
              </div>
            </Surface>
          );
        })}
      </div>
    </div>
  );
};
