"use client";

import React, { useEffect, useState } from "react";
import { PortalHeader, BottomTabBar, Button, Card, Badge, Footer } from "../../../design-system";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";
import { CreditCardIcon, EditIcon, GiftIcon, TruckIcon, StarIcon, CheckIcon } from "../../../design-system/Icons";

export interface MinhaContaViewProps {
  onNavigate?: (path: string) => void;
}

export const MinhaContaView: React.FC<MinhaContaViewProps> = ({ onNavigate }) => {
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState<string>("painel");

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

  const sidebarLinks = [
    { id: "painel", label: "Painel Geral" },
    { id: "dados", label: "Seus Dados" },
    { id: "enderecos", label: "Endereços" },
    { id: "pagamentos", label: "Pagamentos" },
    { id: "notificacoes", label: "Notificações" },
    { id: "privacidade", label: "Privacidade" },
    { id: "termos", label: "Termos" }
  ];

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
      {/* 1. Header Único Logado */}
      <PortalHeader
        activeTab="meu-clube"
        themeMode={themeMode}
        onToggleTheme={() => {
          const next = themeMode === "dark" ? "light" : "dark";
          setThemeMode(next);
          localStorage.setItem("royal_prime_theme", next);
          window.dispatchEvent(new Event("royal_theme_changed"));
        }}
        onNavigate={onNavigate}
      />

      {/* 2. Conteúdo Principal "Minha Conta" */}
      <main
        style={{
          flex: 1,
          maxWidth: "1440px",
          width: "100%",
          margin: "0 auto",
          padding: "48px 32px",
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "48px",
          boxSizing: "border-box"
        }}
        className="grid-responsive"
      >
        <style>{`
          @media (max-width: 900px) {
            .grid-responsive {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        {/* Sidebar / Menu da Conta */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "700", margin: "0 0 8px 0", color: tokens.text }}>
              Minha Conta
            </h1>
            <p style={{ fontSize: "14px", color: tokens.textMuted, lineHeight: "1.5", margin: 0 }}>
              Olá, Felipe.<br />Gerencie sua experiência Royal Carnes.
            </p>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "12px", borderLeft: `2px solid ${tokens.border}`, paddingLeft: "16px" }}>
            {sidebarLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    textAlign: "left",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "12px",
                    fontWeight: "700",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: isActive ? tokens.copper : tokens.textMuted,
                    cursor: "pointer",
                    padding: "4px 0",
                    transition: "color 0.2s ease"
                  }}
                >
                  {link.label}
                </button>
              );
            })}

            <div style={{ height: "1px", background: tokens.border, margin: "8px 0" }} />

            <button
              onClick={() => onNavigate ? onNavigate("/") : (window.location.href = "/")}
              style={{
                background: "transparent",
                border: "none",
                textAlign: "left",
                fontFamily: "'Inter', sans-serif",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#EF4444",
                cursor: "pointer",
                padding: "4px 0"
              }}
            >
              Sair da conta
            </button>
          </nav>
        </aside>

        {/* Área Central de Configurações da Conta */}
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {/* Seção 01: Status da Royal Box */}
          <Card variant="surface" bordered hoverable={false} isDark={isDark} style={{ padding: "36px", borderRadius: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, minWidth: "280px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.textMuted }}>
                  SUA EXPERIÊNCIA ROYAL
                </span>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "700", margin: 0, color: tokens.text }}>
                    Royal Box
                  </h2>
                  <Badge variant="copper">ATIVA</Badge>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "20px", marginTop: "8px" }}>
                  <div>
                    <span style={{ fontSize: "11px", color: tokens.textMuted, textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.08em" }}>
                      Próxima Caixa
                    </span>
                    <p style={{ fontSize: "15px", fontWeight: "600", color: tokens.text, margin: "4px 0 0 0" }}>
                      12 de Setembro
                    </p>
                  </div>

                  <div>
                    <span style={{ fontSize: "11px", color: tokens.textMuted, textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.08em" }}>
                      Frequência
                    </span>
                    <p style={{ fontSize: "15px", fontWeight: "600", color: tokens.text, margin: "4px 0 0 0" }}>
                      Mensal
                    </p>
                  </div>

                  <div>
                    <span style={{ fontSize: "11px", color: tokens.textMuted, textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.08em" }}>
                      Valor
                    </span>
                    <p style={{ fontSize: "18px", fontWeight: "700", color: tokens.copper, margin: "2px 0 0 0" }}>
                      R$ 875 <span style={{ fontSize: "13px", fontWeight: "400", color: tokens.textMuted }}>/ mês</span>
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "220px" }}>
                <Button variant="accent" size="md" onClick={() => onNavigate ? onNavigate("/minha-caixa") : (window.location.href = "/minha-caixa")}>
                  Ver minha caixa
                </Button>
                <Button variant="outline" size="md" isDark={isDark} onClick={() => onNavigate ? onNavigate("/minha-caixa") : (window.location.href = "/minha-caixa")}>
                  Gerenciar assinatura
                </Button>
              </div>
            </div>
          </Card>

          {/* Seção 02: Seus Benefícios */}
          <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "12px" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: 0, color: tokens.text }}>
                Seus Benefícios
              </h3>
            </div>

            {/* Progresso do Benefício */}
            <div
              style={{
                background: tokens.surfaceContainer,
                border: `1px solid ${tokens.border}`,
                borderRadius: "16px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.textMuted, display: "block", marginBottom: "4px" }}>
                    PRÓXIMO BENEFÍCIO
                  </span>
                  <h4 style={{ fontSize: "18px", fontWeight: "700", margin: 0, color: tokens.text }}>
                    Brinde Royal Exclusivo (Faca Artesanal)
                  </h4>
                </div>
                <span style={{ fontSize: "14px", color: tokens.textMuted }}>
                  Faltam <strong style={{ color: tokens.copper }}>R$ 87</strong> para desbloquear
                </span>
              </div>

              <div style={{ width: "100%", height: "8px", background: tokens.border, borderRadius: "9999px", overflow: "hidden" }}>
                <div style={{ width: "85%", height: "100%", background: tokens.copper, borderRadius: "9999px" }} />
              </div>
            </div>

            {/* Grid dos 4 Cards de Benefício */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
              <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "20px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
                <GiftIcon size={24} color={tokens.copper} />
                <h5 style={{ fontSize: "15px", fontWeight: "600", margin: 0, color: tokens.text }}>Brindes Especiais</h5>
                <Badge variant="copper">Desbloqueado</Badge>
              </Card>

              <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "20px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
                <TruckIcon size={24} color={tokens.copper} />
                <h5 style={{ fontSize: "15px", fontWeight: "600", margin: 0, color: tokens.text }}>Entrega Prioritária</h5>
                <Badge variant="copper">Disponível</Badge>
              </Card>

              <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "20px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
                <StarIcon size={24} color={tokens.textMuted} />
                <h5 style={{ fontSize: "15px", fontWeight: "600", margin: 0, color: tokens.text }}>Acesso Antecipado</h5>
                <Badge variant="limited">Em breve</Badge>
              </Card>

              <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "20px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
                <StarIcon size={24} color={tokens.textMuted} />
                <h5 style={{ fontSize: "15px", fontWeight: "600", margin: 0, color: tokens.text }}>Condições Exclusivas</h5>
                <Badge variant="limited">Em breve</Badge>
              </Card>
            </div>
          </section>

          {/* Seção 03: Pedidos Recentes */}
          <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "12px" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: 0, color: tokens.text }}>
                Pedidos Recentes
              </h3>
              <a href="#" style={{ fontSize: "13px", fontWeight: "700", color: tokens.copper, textDecoration: "none" }}>
                Ver todos os pedidos
              </a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Pedido 1 */}
              <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "20px 24px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: tokens.textMuted }}>
                    ROYAL DELIVERY • 24 AGO 2026
                  </span>
                  <span style={{ fontSize: "16px", fontWeight: "700", color: tokens.text }}>
                    Pedido #RD-8492
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "9999px", background: tokens.surfaceContainer, border: `1px solid ${tokens.border}` }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22C55E" }} />
                    <span style={{ fontSize: "13px", fontWeight: "600", color: tokens.text }}>Entregue</span>
                  </div>
                  <Button variant="outline" size="sm" isDark={isDark}>
                    Ver pedido
                  </Button>
                </div>
              </Card>

              {/* Pedido 2 */}
              <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "20px 24px", borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase", color: tokens.textMuted }}>
                    ROYAL BOX • 12 AGO 2026
                  </span>
                  <span style={{ fontSize: "16px", fontWeight: "700", color: tokens.text }}>
                    Caixa de Agosto
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "9999px", background: tokens.surfaceContainer, border: `1px solid ${tokens.border}` }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22C55E" }} />
                    <span style={{ fontSize: "13px", fontWeight: "600", color: tokens.text }}>Entregue</span>
                  </div>
                  <Button variant="outline" size="sm" isDark={isDark}>
                    Ver caixa
                  </Button>
                </div>
              </Card>
            </div>
          </section>

          {/* Seção 04: Endereços e Pagamentos */}
          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {/* Endereço Principal */}
            <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "24px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700", margin: 0, color: tokens.text }}>
                  Endereço Principal
                </h4>
                <button style={{ background: "transparent", border: "none", color: tokens.copper, cursor: "pointer" }}>
                  <EditIcon size={18} color={tokens.copper} />
                </button>
              </div>

              <div style={{ fontSize: "14px", color: tokens.textMuted, lineHeight: "1.6" }}>
                <p style={{ fontWeight: "700", color: tokens.text, margin: "0 0 4px 0" }}>Casa</p>
                <p style={{ margin: 0 }}>Av. Visconde de Albuquerque, 1200, Apto 302</p>
                <p style={{ margin: 0 }}>Leblon, Rio de Janeiro - RJ</p>
                <p style={{ margin: 0 }}>CEP: 22450-000</p>
              </div>
            </Card>

            {/* Pagamento Padrão */}
            <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "24px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700", margin: 0, color: tokens.text }}>
                  Pagamento Padrão
                </h4>
                <button style={{ background: "transparent", border: "none", color: tokens.copper, cursor: "pointer" }}>
                  <EditIcon size={18} color={tokens.copper} />
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "36px",
                    borderRadius: "8px",
                    background: tokens.surfaceContainer,
                    border: `1px solid ${tokens.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  <CreditCardIcon size={20} color={tokens.copper} />
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "700", color: tokens.text, margin: "0 0 2px 0" }}>
                    Mastercard final 4821
                  </p>
                  <p style={{ fontSize: "13px", color: tokens.textMuted, margin: 0 }}>
                    Expira em 10/2027
                  </p>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </main>

      {/* 3. BottomTabBar Mobile */}
      <BottomTabBar activeTab="meu-clube" onNavigate={onNavigate} isDark={isDark} />

      {/* 4. Footer */}
      <Footer onNavigate={onNavigate} isDark={isDark} />
    </div>
  );
};
