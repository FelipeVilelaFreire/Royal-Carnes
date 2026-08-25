"use client";

import React from "react";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";

export interface FooterProps {
  onNavigate?: (path: string) => void;
  isDark?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, isDark = false }) => {
  const tokens = isDark ? themeColorsDefault.dark : themeColorsDefault.light;

  return (
    <footer
      style={{
        marginTop: "112px",
        background: tokens.surfaceContainer,
        borderTop: `1px solid ${tokens.border}`,
        padding: "56px 32px 40px 32px",
        fontFamily: "'Inter', sans-serif",
        color: tokens.text,
        transition: "background 0.3s ease, color 0.3s ease"
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "40px"
        }}
      >
        {/* Links em Colunas (Sem a caixa de Newsletter) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "40px"
          }}
        >
          {/* Coluna 1: Marca & Manifesto */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span
              onClick={() => onNavigate ? onNavigate("/hero") : (window.location.href = "/hero")}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "28px",
                fontWeight: "700",
                color: tokens.text,
                cursor: "pointer",
                letterSpacing: "-0.02em"
              }}
            >
              Royal Carnes
            </span>
            <p style={{ fontSize: "14px", color: tokens.textMuted, lineHeight: "1.6", margin: 0 }}>
              A boutique de carnes nobres definitiva para os amantes do churrasco gourmet. Cortes certificados com rastreabilidade completa e entrega refrigerada em embalagem a vácuo (-2°C).
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
              <span
                style={{
                  background: tokens.copper,
                  color: "#FFFFFF",
                  fontSize: "11px",
                  fontWeight: "700",
                  padding: "4px 8px",
                  borderRadius: "2px",
                  letterSpacing: "0.1em"
                }}
              >
                QUALIDADE PRIME CERTIFICADA
              </span>
            </div>
          </div>

          {/* Coluna 2: Cortes Nobres */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.copper, margin: "0 0 4px 0" }}>
              Cortes Nobres
            </h4>
            {[
              { label: "Picanha & Ancho Angus Prime", path: "/cortes" },
              { label: "Wagyu A5 BMS 10+ (Japão)", path: "/cortes" },
              { label: "Tomahawk & Prime Rib Dry Aged", path: "/cortes" },
              { label: "Suínos Duroc & Aves Selecionadas", path: "/cortes" },
              { label: "Kits Master de Churrasco", path: "/cortes" }
            ].map((item, idx) => (
              <span
                key={idx}
                onClick={() => onNavigate ? onNavigate(item.path) : (window.location.href = item.path)}
                style={{ fontSize: "14px", color: tokens.textMuted, cursor: "pointer", transition: "color 0.2s ease" }}
              >
                {item.label}
              </span>
            ))}
          </div>

          {/* Coluna 3: Clube do Sócio */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.copper, margin: "0 0 4px 0" }}>
              Clube do Sócio
            </h4>
            {[
              { label: "Como Funciona a Assinatura", path: "/home" },
              { label: "Planos: Essencial & Wagyu", path: "/home" },
              { label: "Minha Caixa Térmica", path: "/minha-caixa" },
              { label: "Portal do Assinante", path: "/minha-assinatura" },
              { label: "Benefícios & Descontos", path: "/meu-clube" }
            ].map((item, idx) => (
              <span
                key={idx}
                onClick={() => onNavigate ? onNavigate(item.path) : (window.location.href = item.path)}
                style={{ fontSize: "14px", color: tokens.textMuted, cursor: "pointer", transition: "color 0.2s ease" }}
              >
                {item.label}
              </span>
            ))}
          </div>

          {/* Coluna 4: Suporte & Atendimento */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.copper, margin: "0 0 4px 0" }}>
              Atendimento Concierge
            </h4>
            <span style={{ fontSize: "14px", fontWeight: "600", color: tokens.text }}>
              WhatsApp: (11) 99876-5432
            </span>
            <span style={{ fontSize: "14px", color: tokens.textMuted }}>
              Atendimento VIP: Seg a Sáb, 8h às 20h
            </span>
            <span style={{ fontSize: "14px", color: tokens.textMuted, marginTop: "8px" }}>
              Envios para todo o Brasil com selo térmico de transporte seguro.
            </span>
          </div>
        </div>

        {/* Bottom Section: Direitos Autorais 2026 & Links Finais */}
        <div
          style={{
            borderTop: `1px solid ${tokens.border}`,
            paddingTop: "24px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px"
          }}
        >
          <span style={{ fontSize: "13px", color: tokens.textMuted }}>
            © 2026 Royal Carnes Prime. Todos os direitos reservados.
          </span>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: tokens.textMuted, cursor: "pointer" }}>
              Termos de Uso
            </span>
            <span style={{ fontSize: "12px", fontWeight: "600", color: tokens.textMuted, cursor: "pointer" }}>
              Política de Privacidade
            </span>
            <span style={{ fontSize: "12px", fontWeight: "600", color: tokens.textMuted, cursor: "pointer" }}>
              Política de Entrega Refrigerada
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
