"use client";

import React from "react";
import { Text } from "../../ui/Text";
import { themeColorsDefault } from "../../tokens/theme.tokens";
import { FlameIcon } from "../../ui/Icon/AppIcons";

export interface FooterProps {
  config?: any;
  brandName?: string;
  brandLogo?: string;
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  brandName = "ROYAL PRIME",
  brandLogo = "/assets/brand/royal-prime-logo.jpg",
  onNavigate
}) => {
  if (config && config.enabled === false) return null;

  const themeColors = config?.theme?.colors || (config?.mode === "admin" ? themeColorsDefault.admin : themeColorsDefault.dark);
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#0B0908",
        borderTop: `1px solid ${themeColors.border}`,
        padding: "48px 32px 32px",
        marginTop: "80px"
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "24px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FlameIcon size={24} color={themeColors.primary} />
          <Text variant="h3" style={{ color: themeColors.primary, margin: 0, fontWeight: "800", fontSize: "20px", fontFamily: "'Playfair Display', serif" }}>
            {brandName}
          </Text>
        </div>

        <Text variant="body" style={{ color: themeColors.textMuted, fontSize: "14px", maxWidth: "560px", margin: 0, lineHeight: 1.6 }}>
          Excellence in every ember. A curadoria definitiva para os apaixonados por fogo e carne.
        </Text>

        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center", margin: "8px 0" }}>
          <a
            href="#clube"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("clube")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{ color: themeColors.textMuted, textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}
          >
            O Clube
          </a>
          <a
            href="#selecao"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("selecao")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{ color: themeColors.textMuted, textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}
          >
            A Seleção
          </a>
          <a
            href="#assinaturas"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("assinaturas")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{ color: themeColors.textMuted, textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}
          >
            Assinaturas
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{ color: themeColors.textMuted, textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}
          >
            FAQ
          </a>
        </div>

        <div
          style={{
            width: "100%",
            paddingTop: "24px",
            borderTop: `1px solid ${themeColors.border}`,
            textAlign: "center"
          }}
        >
          <Text variant="caption" style={{ color: themeColors.textMuted, fontSize: "13px" }}>
            © {currentYear} {brandName}. Excellence in every ember.
          </Text>
        </div>
      </div>
    </footer>
  );
};
