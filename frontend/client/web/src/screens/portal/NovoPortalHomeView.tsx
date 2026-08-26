"use client";

import React, { useEffect, useState } from "react";
import { Badge, Button, Card } from "../../legacy/design-system";
import { PortalHeader, BottomTabBar, Footer } from "../../legacy/app-shell";
import { FlameIcon, StarIcon, CheckIcon } from "../../legacy/design-system/Icons";
import { mockSubscriber } from "@/mocks/subscriber.mock";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";

export interface NovoPortalHomeViewProps {
  onNavigate?: (path: string) => void;
}

export const NovoPortalHomeView: React.FC<NovoPortalHomeViewProps> = ({ onNavigate }) => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("royal_prime_theme");
    if (stored === "dark" || stored === "light") {
      setThemeMode(stored);
    }
    const handleThemeChange = () => {
      const current = localStorage.getItem("royal_prime_theme");
      if (current === "dark" || current === "light") {
        setThemeMode(current);
      }
    };
    window.addEventListener("royal_theme_changed", handleThemeChange);
    return () => window.removeEventListener("royal_theme_changed", handleThemeChange);
  }, []);

  const isDark = themeMode === "dark";
  const tokens = isDark ? themeColorsDefault.dark : themeColorsDefault.light;

  return (
    <div
      style={{
        background: tokens.background,
        color: tokens.text,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
        transition: "background 0.3s ease, color 0.3s ease"
      }}
    >
      {/* 1. Header do Novo Portal reutilizável */}
      <PortalHeader
        activeTab="minha-caixa"
        themeMode={themeMode}
        onToggleTheme={() => {
          const next = themeMode === "dark" ? "light" : "dark";
          setThemeMode(next);
          localStorage.setItem("royal_prime_theme", next);
          window.dispatchEvent(new Event("royal_theme_changed"));
        }}
        onNavigate={onNavigate}
      />

      {/* 2. Conteúdo Mestre do Novo Portal */}
      <main
        style={{
          flex: 1,
          maxWidth: "1440px",
          width: "100%",
          margin: "0 auto",
          padding: "40px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "48px",
          boxSizing: "border-box"
        }}
      >
        {/* Banner Status da Caixa de Setembro */}
        <section
          style={{
            background: tokens.surfaceContainer,
            border: `1px solid ${tokens.copper}`,
            borderRadius: "16px",
            padding: "36px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            boxShadow: "0 12px 32px rgba(184, 115, 51, 0.08)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <Badge variant="copper">
                  {mockSubscriber.nextBox.status === "preparing" ? "EM EMBALAGEM A VÁCUO (-2°C)" : "CONFIRMADO"}
                </Badge>
                <span style={{ fontSize: "14px", color: tokens.textMuted }}>
                  Plano: <strong style={{ color: tokens.text }}>{mockSubscriber.planName}</strong>
                </span>
              </div>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "36px",
                  fontWeight: "700",
                  margin: 0,
                  color: tokens.text
                }}
              >
                Sua Caixa Térmica de Setembro
              </h1>
              <p style={{ fontSize: "15px", color: tokens.textMuted, margin: "6px 0 0 0" }}>
                Previsão de entrega: <strong>{mockSubscriber.nextBox.scheduledDate}</strong> na {mockSubscriber.address}
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              isDark={isDark}
              onClick={() => onNavigate ? onNavigate("/minha-caixa") : (window.location.href = "/minha-caixa")}
            >
              Rastrear Caixa
            </Button>
          </div>

          {/* Grid dos Cortes da Próxima Caixa */}
          <div style={{ borderTop: `1px solid ${tokens.border}`, paddingTop: "20px" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: tokens.copper, display: "block", marginBottom: "12px" }}>
              Cortes Selecionados para esta Edição:
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              {mockSubscriber.nextBox.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: tokens.surface,
                    border: `1px solid ${tokens.border}`,
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                  }}
                >
                  <span style={{ color: tokens.copper, display: "flex" }}>
                    <CheckIcon size={18} />
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: tokens.text }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Atalhos Rápidos do Sócio */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          <Card
            variant="surface"
            bordered
            hoverable
            isDark={isDark}
            onClick={() => onNavigate ? onNavigate("/cortes") : (window.location.href = "/cortes")}
            style={{ padding: "28px", cursor: "pointer", gap: "12px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", color: tokens.copper }}>
                Catálogo Exclusivo
              </span>
              <FlameIcon size={24} color={tokens.copper} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", margin: 0, color: tokens.text }}>
              Adicionar Cortes Avulsos
            </h3>
            <p style={{ fontSize: "14px", color: tokens.textMuted, margin: 0 }}>
              Inclua Wagyu A5 ou Dry Aged 60D na sua caixa de setembro com 20% de desconto de sócio.
            </p>
          </Card>

          <Card
            variant="surface"
            bordered
            hoverable
            isDark={isDark}
            onClick={() => onNavigate ? onNavigate("/minha-assinatura") : (window.location.href = "/minha-assinatura")}
            style={{ padding: "28px", cursor: "pointer", gap: "12px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", color: tokens.copper }}>
                Assinatura Prime
              </span>
              <StarIcon size={24} color={tokens.copper} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", margin: 0, color: tokens.text }}>
              Gerenciar Meu Plano
            </h3>
            <p style={{ fontSize: "14px", color: tokens.textMuted, margin: 0 }}>
              Alterne a frequência, altere cartão ou solicite pausa temporária de envio.
            </p>
          </Card>
        </section>
      </main>

      {/* 3. BottomTabBar Mobile Reutilizável */}
      <BottomTabBar activeTab="minha-caixa" onNavigate={onNavigate} isDark={isDark} />

      {/* 4. Footer do Design System (2026) */}
      <Footer onNavigate={onNavigate} isDark={isDark} />
    </div>
  );
};
