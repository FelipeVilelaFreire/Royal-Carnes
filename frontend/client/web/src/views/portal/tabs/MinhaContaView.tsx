"use client";

import React, { useEffect, useState } from "react";
import { PortalHeader, BottomTabBar, Button, Card, Badge, Footer } from "../../../design-system";
import { themeColorsDefault } from "@foundation/tokens/theme.tokens";
import { CreditCardIcon, EditIcon, GiftIcon, TruckIcon, StarIcon, CheckIcon } from "../../../design-system/Icons";

export interface MinhaContaViewProps {
  onNavigate?: (path: string) => void;
}

export const MinhaContaView: React.FC<MinhaContaViewProps> = ({ onNavigate }) => {
  const [themeMode, setThemeMode] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr === "dark" || attr === "light") return attr;
      const stored = localStorage.getItem("royal_prime_theme");
      if (stored === "dark" || stored === "light") return stored;
    }
    return "dark";
  });
  const [activeTab, setActiveTab] = useState<string>("painel");

  // Estado do Plano de Assinatura & Modal
  const [currentPlan, setCurrentPlan] = useState<"essential" | "pro" | "elite">("pro");
  const [isPlansModalOpen, setIsPlansModalOpen] = useState<boolean>(false);
  const [selectedPlanModal, setSelectedPlanModal] = useState<"essential" | "pro" | "elite">("pro");
  const [planSuccessMessage, setPlanSuccessMessage] = useState<string>("");

  // Estado dos dados do perfil
  const [personalData, setPersonalData] = useState({
    name: "Felipe Vilela",
    email: "felipe@royalcarnes.com.br",
    phone: "(11) 99999-8888",
    cpf: "348.910.482-00",
    birthdate: "1992-06-15",
    preferredDoneness: "Ao Ponto para Mal Passado"
  });
  const [isSavedData, setIsSavedData] = useState<boolean>(false);

  // Estado das notificacoes
  const [notifications, setNotifications] = useState({
    whatsapp: true,
    email: true,
    sms: false,
    offers: true
  });

  useEffect(() => {
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
    { id: "assinatura", label: "Minha Assinatura" },
    { id: "dados", label: "Seus Dados" },
    { id: "enderecos", label: "Endereços" },
    { id: "pagamentos", label: "Pagamentos" },
    { id: "notificacoes", label: "Notificações" },
    { id: "privacidade", label: "Privacidade" },
    { id: "termos", label: "Termos" }
  ];

  const handleSaveData = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedData(true);
    setTimeout(() => setIsSavedData(false), 3000);
  };

  const handleConfirmPlanChange = () => {
    setCurrentPlan(selectedPlanModal);
    setPlanSuccessMessage(`Plano alterado para ROYAL ${selectedPlanModal.toUpperCase()} com sucesso!`);
    setTimeout(() => {
      setPlanSuccessMessage("");
      setIsPlansModalOpen(false);
    }, 2000);
  };

  const planDetails = {
    essential: {
      name: "ROYAL ESSENTIAL",
      price: "490,00",
      cuts: "3 cortes por caixa",
      weight: "Até 3.0kg total",
      acc: "1 complemento",
      benefits: ["Frete Refrigerado Standard", "Acesso aos Cortes Prime", "Atendimento via Chat"]
    },
    pro: {
      name: "ROYAL PRO",
      price: "875,00",
      cuts: "6 cortes por caixa",
      weight: "Até 5.0kg total",
      acc: "3 complementos",
      benefits: ["Frete Refrigerado Prioritário", "Acesso Antecipado Wagyu A5", "Brinde Faca Artesanal", "Desconto de 15% em Utensílios"]
    },
    elite: {
      name: "ROYAL ELITE",
      price: "1.450,00",
      cuts: "10 cortes por caixa",
      weight: "Até 8.0kg total",
      acc: "5 complementos + Vinho",
      benefits: ["Frete Semanal ou Mensal VIP", "Concierge Mestre Assador Dedicado", "Todos os Brindes Desbloqueados", "20% OFF em Utensílios"]
    }
  };

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
      {/* 1. Header Único Logado do Portal */}
      <PortalHeader
        activeTab="portal-minha-conta"
        themeMode={themeMode}
        onToggleTheme={() => {
          const next = themeMode === "dark" ? "light" : "dark";
          setThemeMode(next);
          if (typeof document !== "undefined") {
            document.documentElement.setAttribute("data-theme", next);
            document.documentElement.style.backgroundColor = next === "dark" ? "#0B0908" : "#FCFBF7";
            document.documentElement.style.color = next === "dark" ? "#E8E1DE" : "#1A1A1A";
          }
          localStorage.setItem("royal_prime_theme", next);
          window.dispatchEvent(new Event("royal_theme_changed"));
        }}
        onNavigate={onNavigate}
      />

      {/* 2. Conteúdo Principal da Conta: Sidebar Esquerda + Área Direita Dinâmica */}
      <main
        style={{
          flex: 1,
          maxWidth: "1440px",
          width: "100%",
          margin: "0 auto",
          padding: "48px 32px 80px 32px",
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
              gap: 32px !important;
            }
          }
        `}</style>

        {/* Sidebar Lateral Esquerda com Links das Abas e Resumo do Plano */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div>
            <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper }}>
              ÁREA DE MEMBRO VIP
            </span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: "700", margin: "4px 0 8px 0", color: tokens.text }}>
              Minha Conta
            </h1>
            <p style={{ fontSize: "14px", color: tokens.textMuted, lineHeight: "1.5", margin: 0 }}>
              Olá, {personalData.name.split(" ")[0]}.<br />Gerencie seu plano e caixas do Royal Delivery.
            </p>
          </div>

          {/* Card Resumo do Plano Ativo na Sidebar */}
          <div
            style={{
              background: tokens.surfaceContainer,
              border: `1px solid ${tokens.border}`,
              borderRadius: "14px",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: tokens.textMuted }}>
                Seu Plano Ativo
              </span>
              <Badge variant="copper">ROYAL {currentPlan.toUpperCase()}</Badge>
            </div>
            <p style={{ fontSize: "14px", fontWeight: "700", color: tokens.text, margin: 0 }}>
              R$ {planDetails[currentPlan].price} / mês
            </p>
            <button
              onClick={() => setIsPlansModalOpen(true)}
              style={{
                background: "transparent",
                border: "none",
                textAlign: "left",
                padding: 0,
                fontSize: "12px",
                fontWeight: "700",
                color: tokens.copper,
                cursor: "pointer"
              }}
            >
              Ver todos os planos ➔
            </button>
          </div>

          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              borderLeft: `2px solid ${tokens.border}`,
              paddingLeft: "16px"
            }}
          >
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
                    fontSize: "13px",
                    fontWeight: isActive ? "700" : "500",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: isActive ? tokens.copper : tokens.textMuted,
                    cursor: "pointer",
                    padding: "8px 0",
                    transition: "color 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  {isActive && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: tokens.copper }} />}
                  {link.label}
                </button>
              );
            })}

            <div style={{ height: "1px", background: tokens.border, margin: "12px 0" }} />

            <button
              onClick={() => onNavigate ? onNavigate("/") : (window.location.href = "/")}
              style={{
                background: "transparent",
                border: "none",
                textAlign: "left",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#EF4444",
                cursor: "pointer",
                padding: "8px 0",
                transition: "opacity 0.2s ease"
              }}
            >
              Sair da conta
            </button>
          </nav>
        </aside>

        {/* Conteúdo Dinâmico na Direita (Muda conforme a Tab Selecionada) */}
        <section style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          
          {/* TAB 1: PAINEL GERAL */}
          {activeTab === "painel" && (
            <>
              {/* Card Status do Plano */}
              <Card variant="surface" bordered hoverable={false} isDark={isDark} style={{ padding: "36px", borderRadius: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "24px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, minWidth: "280px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.textMuted }}>
                      SEU PLANO MESTRE ATIVO
                    </span>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: "700", margin: 0, color: tokens.text }}>
                        ROYAL {currentPlan.toUpperCase()}
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
                          R$ {planDetails[currentPlan].price} <span style={{ fontSize: "13px", fontWeight: "400", color: tokens.textMuted }}>/ mês</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "220px" }}>
                    <Button variant="accent" size="md" onClick={() => onNavigate ? onNavigate("/portal-minha-caixa") : (window.location.href = "/portal-minha-caixa")}>
                      Ver minha caixa
                    </Button>
                    <Button variant="outline" size="md" isDark={isDark} onClick={() => setIsPlansModalOpen(true)}>
                      Gerenciar assinatura
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Card Uso Neste Ciclo */}
              <div
                style={{
                  background: tokens.surfaceContainer,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: "20px",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
                      USO DO CICLO DE SETEMBRO
                    </span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: "700", margin: 0, color: tokens.text }}>
                      Uso & Capacidade da Caixa
                    </h3>
                  </div>
                  <span style={{ fontSize: "14px", color: tokens.textMuted }}>
                    Você ainda pode adicionar <strong style={{ color: tokens.copper }}>2 cortes</strong> à sua próxima caixa.
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: tokens.text }}>
                        🥩 Cortes Utilizados
                      </span>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: tokens.copper }}>
                        4 / 6 cortes
                      </span>
                    </div>
                    <div style={{ width: "100%", height: "10px", background: tokens.border, borderRadius: "9999px", overflow: "hidden" }}>
                      <div style={{ width: "66%", height: "100%", background: tokens.copper, borderRadius: "9999px" }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: tokens.text }}>
                        ⚖️ Capacidade de Peso
                      </span>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: tokens.copper }}>
                        3.8kg / 5.0kg
                      </span>
                    </div>
                    <div style={{ width: "100%", height: "10px", background: tokens.border, borderRadius: "9999px", overflow: "hidden" }}>
                      <div style={{ width: "76%", height: "100%", background: tokens.copper, borderRadius: "9999px" }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: tokens.text }}>
                        🔪 Complementos
                      </span>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: tokens.copper }}>
                        2 / 3 complementos
                      </span>
                    </div>
                    <div style={{ width: "100%", height: "10px", background: tokens.border, borderRadius: "9999px", overflow: "hidden" }}>
                      <div style={{ width: "66%", height: "100%", background: tokens.copper, borderRadius: "9999px" }} />
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: isDark ? "rgba(184, 115, 51, 0.1)" : "rgba(184, 115, 51, 0.05)",
                    border: `1px solid ${tokens.copper}`,
                    borderRadius: "14px",
                    padding: "16px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px"
                  }}
                >
                  <span style={{ fontSize: "14px", color: tokens.text }}>
                    Precisa de mais cortes e peso por ciclo? Conheça os planos superiores.
                  </span>
                  <Button variant="accent" size="sm" onClick={() => setIsPlansModalOpen(true)}>
                    Fazer Upgrade ➔
                  </Button>
                </div>
              </div>

              {/* Pedidos Recentes Gourmet — ALINHADOS À ESQUERDA & MENOS CENTRALIZADOS */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "12px" }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: 0, color: tokens.text }}>
                    Pedidos Recentes
                  </h3>
                  <span
                    onClick={() => onNavigate ? onNavigate("/portal-minha-caixa") : (window.location.href = "/portal-minha-caixa")}
                    style={{ fontSize: "13px", fontWeight: "700", color: tokens.copper, cursor: "pointer" }}
                  >
                    Ver histórico completo ➔
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Pedido 1 (Alinhado à esquerda) */}
                  <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "20px 24px", borderRadius: "16px", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "24px", alignItems: "flex-start" }}>
                    <div style={{ width: "72px", height: "72px", borderRadius: "12px", overflow: "hidden", border: `1px solid ${tokens.border}`, background: tokens.surfaceContainer, flexShrink: 0 }}>
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTWZZGOFHbj0Sh572RQ-2vs3emWIEGZWsTB1lYtPYcSjPGcOa9mDPiwX1GCl8gPBNEHqbv95kZnUF7gTwJASw-4aHOZWp1IUKwwTioZC70OM608r9UjPQKMk5Jw4B1qibJodt1tlgo4WyBhdw3iIDeBFHpi2CQBi4BqAaFV2b7RZGuMUPGAkZOHP76xP0TR6KM5dqPFvrumlSXF85A9N100tBX7rkGd__CupxrUAHLYbt5YnwVk0e-"
                        alt="Pedido #RD-8492"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "left" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.copper }}>
                        ROYAL DELIVERY • 24 AGO 2026
                      </span>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: "700", margin: 0, color: tokens.text }}>
                        Pedido #RD-8492 — Selection Wagyu & Angus
                      </h4>
                      <span style={{ fontSize: "13px", color: tokens.textMuted, lineHeight: "1.4" }}>
                        3 itens • 4.2kg • Tomahawk Prime & Wagyu A5 BMB 10+
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                      <span style={{ fontSize: "18px", fontWeight: "700", color: tokens.text }}>
                        R$ 489,00
                      </span>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 8px #22C55E" }} />
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#22C55E" }}>Entregue</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        isDark={isDark}
                        onClick={() => onNavigate ? onNavigate("/portal-minha-caixa") : (window.location.href = "/portal-minha-caixa")}
                      >
                        Ver detalhes
                      </Button>
                    </div>
                  </Card>

                  {/* Pedido 2 (Alinhado à esquerda) */}
                  <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "20px 24px", borderRadius: "16px", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "24px", alignItems: "flex-start" }}>
                    <div style={{ width: "72px", height: "72px", borderRadius: "12px", overflow: "hidden", border: `1px solid ${tokens.border}`, background: tokens.surfaceContainer, flexShrink: 0 }}>
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEyZehgZTv-CyocAVQn0YBZaQ9k5T1yspu9TOTY_a2Ecdie4GqgKNWW_cnd5ZAUuPMshFRWia6eq5Ej3-UQ2L2nImpVVKTr0yfEodgUEJQUsZVZLYiBoQliyrqEezNzVT5XxtmK1ozhqsDd4j-LQyV7RlT1CqQedpMs5qhbesB5PDF1_G10G7rQDZ3U7cedVIHcBedWSA27GA_gQjpXRlZttOTKwJI8hFUgSAUtoBMQmTuk7GfbhUo"
                        alt="Caixa de Agosto"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "left" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.copper }}>
                        ROYAL DELIVERY • 12 AGO 2026 (RECORRÊNCIA)
                      </span>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: "700", margin: 0, color: tokens.text }}>
                        Caixa de Agosto — Master Churrasco
                      </h4>
                      <span style={{ fontSize: "13px", color: tokens.textMuted, lineHeight: "1.4" }}>
                        5 itens • 6.0kg • Picanha Steakhouse, Ancho & Brinde Faca
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                      <span style={{ fontSize: "18px", fontWeight: "700", color: tokens.text }}>
                        R$ 875,00
                      </span>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 8px #22C55E" }} />
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#22C55E" }}>Entregue</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        isDark={isDark}
                        onClick={() => onNavigate ? onNavigate("/portal-minha-caixa") : (window.location.href = "/portal-minha-caixa")}
                      >
                        Ver detalhes
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}

          {/* TAB DEDICADA: MINHA ASSINATURA & COMPARATIVO DE PLANOS */}
          {activeTab === "assinatura" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
                  GERENCIAMENTO DO CLUBE
                </span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "700", margin: 0, color: tokens.text }}>
                  Sua Assinatura & Planos Royal Carnes
                </h3>
              </div>

              {/* Status do Plano Ativo */}
              <Card variant="surface" bordered hoverable={false} isDark={isDark} style={{ padding: "32px", borderRadius: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.copper }}>
                      PLANO VINCULADO
                    </span>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: "4px 0 0 0", color: tokens.text }}>
                      {planDetails[currentPlan].name}
                    </h4>
                    <p style={{ fontSize: "14px", color: tokens.textMuted, margin: "4px 0 0 0" }}>
                      Renovação automática em 12 de Setembro de 2026 por <strong style={{ color: tokens.copper }}>R$ {planDetails[currentPlan].price} / mês</strong>
                    </p>
                  </div>
                  <Button variant="accent" size="md" onClick={() => setIsPlansModalOpen(true)}>
                    Gerenciar ou Alterar Plano ➔
                  </Button>
                </div>
              </Card>

              {/* Comparativo de Planos */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
                {(["essential", "pro", "elite"] as const).map((planKey) => {
                  const p = planDetails[planKey];
                  const isCurrent = currentPlan === planKey;
                  return (
                    <Card
                      key={planKey}
                      variant="surface"
                      bordered
                      hoverable={false}
                      isDark={isDark}
                      style={{
                        padding: "28px",
                        borderRadius: "18px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        border: isCurrent ? `2px solid ${tokens.copper}` : `1px solid ${tokens.border}`,
                        background: isCurrent ? (isDark ? "rgba(184, 115, 51, 0.08)" : "rgba(184, 115, 51, 0.04)") : tokens.surfaceContainer
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", color: tokens.copper }}>
                            PLANO CLUBE
                          </span>
                          {isCurrent && <Badge variant="copper">ATUAL</Badge>}
                        </div>

                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", margin: 0, color: tokens.text }}>
                          {p.name}
                        </h4>

                        <span style={{ fontSize: "26px", fontWeight: "700", color: tokens.text }}>
                          <span style={{ fontSize: "14px", marginRight: "2px" }}>R$</span>
                          {p.price}
                          <span style={{ fontSize: "12px", color: tokens.textMuted, fontWeight: "400" }}> /mês</span>
                        </span>

                        <div style={{ borderTop: `1px solid ${tokens.border}`, paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: tokens.text }}>
                          <p style={{ margin: 0, fontWeight: "700" }}>🥩 {p.cuts}</p>
                          <p style={{ margin: 0 }}>⚖️ {p.weight}</p>
                          <p style={{ margin: 0 }}>🔪 {p.acc}</p>
                        </div>

                        <ul style={{ paddingLeft: "16px", margin: "8px 0 0 0", fontSize: "12px", color: tokens.textMuted, display: "flex", flexDirection: "column", gap: "6px" }}>
                          {p.benefits.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ marginTop: "24px" }}>
                        {isCurrent ? (
                          <Button variant="outline" size="sm" isDark={isDark} style={{ width: "100%", opacity: 0.6, cursor: "default" }}>
                            Seu Plano Atual
                          </Button>
                        ) : (
                          <Button
                            variant="accent"
                            size="sm"
                            style={{ width: "100%" }}
                            onClick={() => {
                              setSelectedPlanModal(planKey);
                              setIsPlansModalOpen(true);
                            }}
                          >
                            Migrar para este plano
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SEUS DADOS */}
          {activeTab === "dados" && (
            <Card variant="surface" bordered hoverable={false} isDark={isDark} style={{ padding: "36px", borderRadius: "20px" }}>
              <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px", marginBottom: "28px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: "0 0 6px 0", color: tokens.text }}>
                  Seus Dados Pessoais
                </h3>
                <p style={{ fontSize: "14px", color: tokens.textMuted, margin: 0 }}>
                  Mantenha suas informações cadastrais atualizadas para entregas e comunicação.
                </p>
              </div>

              <form onSubmit={handleSaveData} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: tokens.text }}>Nome Completo</label>
                  <input
                    type="text"
                    value={personalData.name}
                    onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                    style={{
                      background: tokens.surfaceContainer,
                      color: tokens.text,
                      border: `1px solid ${tokens.border}`,
                      borderRadius: "10px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      outline: "none"
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: tokens.text }}>E-mail de Acesso</label>
                  <input
                    type="email"
                    value={personalData.email}
                    onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                    style={{
                      background: tokens.surfaceContainer,
                      color: tokens.text,
                      border: `1px solid ${tokens.border}`,
                      borderRadius: "10px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      outline: "none"
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: tokens.text }}>WhatsApp / Celular</label>
                  <input
                    type="text"
                    value={personalData.phone}
                    onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                    style={{
                      background: tokens.surfaceContainer,
                      color: tokens.text,
                      border: `1px solid ${tokens.border}`,
                      borderRadius: "10px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      outline: "none"
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: tokens.text }}>CPF</label>
                  <input
                    type="text"
                    value={personalData.cpf}
                    disabled
                    style={{
                      background: tokens.surfaceContainer,
                      color: tokens.textMuted,
                      border: `1px solid ${tokens.border}`,
                      borderRadius: "10px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      cursor: "not-allowed"
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: tokens.text }}>Data de Nascimento</label>
                  <input
                    type="date"
                    value={personalData.birthdate}
                    onChange={(e) => setPersonalData({ ...personalData, birthdate: e.target.value })}
                    style={{
                      background: tokens.surfaceContainer,
                      color: tokens.text,
                      border: `1px solid ${tokens.border}`,
                      borderRadius: "10px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      outline: "none"
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: tokens.text }}>Ponto de Carne Preferido</label>
                  <select
                    value={personalData.preferredDoneness}
                    onChange={(e) => setPersonalData({ ...personalData, preferredDoneness: e.target.value })}
                    style={{
                      background: tokens.surfaceContainer,
                      color: tokens.text,
                      border: `1px solid ${tokens.border}`,
                      borderRadius: "10px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      outline: "none"
                    }}
                  >
                    <option value="Mal Passado">Mal Passado (Selado & Vermelho)</option>
                    <option value="Ao Ponto para Mal Passado">Ao Ponto para Mal Passado (Ideal)</option>
                    <option value="Ao Ponto">Ao Ponto (Centro Rosado)</option>
                    <option value="Bem Passado">Bem Passado</option>
                  </select>
                </div>

                <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "16px", marginTop: "12px" }}>
                  <Button variant="accent" size="md" type="submit">
                    Salvar Alterações
                  </Button>
                  {isSavedData && (
                    <span style={{ fontSize: "14px", color: "#22C55E", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                      <CheckIcon size={16} color="#22C55E" /> Dados salvos com sucesso!
                    </span>
                  )}
                </div>
              </form>
            </Card>
          )}

          {/* TAB 3: ENDEREÇOS */}
          {activeTab === "enderecos" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px" }}>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: "0 0 6px 0", color: tokens.text }}>
                    Meus Endereços
                  </h3>
                  <p style={{ fontSize: "14px", color: tokens.textMuted, margin: 0 }}>
                    Gerencie os locais de entrega para seus pedidos do Royal Delivery e compras avulsas.
                  </p>
                </div>
                <Button variant="accent" size="sm">
                  + Adicionar Endereço
                </Button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "28px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700", margin: 0, color: tokens.text }}>
                        Casa
                      </h4>
                      <Badge variant="copper">PRINCIPAL</Badge>
                    </div>
                    <EditIcon size={18} color={tokens.copper} style={{ cursor: "pointer" }} />
                  </div>

                  <div style={{ fontSize: "14px", color: tokens.textMuted, lineHeight: "1.6" }}>
                    <p style={{ fontWeight: "700", color: tokens.text, margin: "0 0 4px 0" }}>Felipe Vilela</p>
                    <p style={{ margin: 0 }}>Av. Visconde de Albuquerque, 1200, Apto 302</p>
                    <p style={{ margin: 0 }}>Leblon, Rio de Janeiro - RJ</p>
                    <p style={{ margin: 0 }}>CEP: 22450-000 • Tel: (11) 99999-8888</p>
                  </div>
                </Card>

                <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "28px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700", margin: 0, color: tokens.text }}>
                      Escritório / Trabalho
                    </h4>
                    <EditIcon size={18} color={tokens.copper} style={{ cursor: "pointer" }} />
                  </div>

                  <div style={{ fontSize: "14px", color: tokens.textMuted, lineHeight: "1.6" }}>
                    <p style={{ fontWeight: "700", color: tokens.text, margin: "0 0 4px 0" }}>Felipe Vilela</p>
                    <p style={{ margin: 0 }}>Av. das Américas, 4200, Bloco 2, Sala 304</p>
                    <p style={{ margin: 0 }}>Barra da Tijuca, Rio de Janeiro - RJ</p>
                    <p style={{ margin: 0 }}>CEP: 22640-102</p>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 4: PAGAMENTOS */}
          {activeTab === "pagamentos" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px" }}>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: "0 0 6px 0", color: tokens.text }}>
                    Formas de Pagamento
                  </h3>
                  <p style={{ fontSize: "14px", color: tokens.textMuted, margin: 0 }}>
                    Cartões de crédito e chaves PIX cadastradas para a sua assinatura.
                  </p>
                </div>
                <Button variant="accent" size="sm">
                  + Novo Cartão
                </Button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "28px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <CreditCardIcon size={24} color={tokens.copper} />
                      <h4 style={{ fontSize: "18px", fontWeight: "700", margin: 0, color: tokens.text }}>
                        Mastercard
                      </h4>
                    </div>
                    <Badge variant="copper">PADRÃO</Badge>
                  </div>

                  <div>
                    <p style={{ fontSize: "18px", fontWeight: "700", letterSpacing: "2px", color: tokens.text, margin: "0 0 4px 0" }}>
                      •••• •••• •••• 4821
                    </p>
                    <p style={{ fontSize: "13px", color: tokens.textMuted, margin: 0 }}>
                      Validade: 10/2028 • Titular: FELIPE V FREIRE
                    </p>
                  </div>
                </Card>

                <Card variant="surface" bordered hoverable isDark={isDark} style={{ padding: "28px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <CreditCardIcon size={24} color={tokens.textMuted} />
                      <h4 style={{ fontSize: "18px", fontWeight: "700", margin: 0, color: tokens.text }}>
                        Visa Infinite
                      </h4>
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: "18px", fontWeight: "700", letterSpacing: "2px", color: tokens.text, margin: "0 0 4px 0" }}>
                      •••• •••• •••• 9012
                    </p>
                    <p style={{ fontSize: "13px", color: tokens.textMuted, margin: 0 }}>
                      Validade: 04/2029 • Titular: FELIPE V FREIRE
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFICAÇÕES */}
          {activeTab === "notificacoes" && (
            <Card variant="surface" bordered hoverable={false} isDark={isDark} style={{ padding: "36px", borderRadius: "20px" }}>
              <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px", marginBottom: "28px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: "0 0 6px 0", color: tokens.text }}>
                  Preferências de Notificação
                </h3>
                <p style={{ fontSize: "14px", color: tokens.textMuted, margin: 0 }}>
                  Escolha como deseja ser avisado sobre o envio das suas caixas e novidades dos mestres.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: `1px solid ${tokens.border}` }}>
                  <div>
                    <h4 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 4px 0", color: tokens.text }}>
                      Alertas de Envio por WhatsApp
                    </h4>
                    <p style={{ fontSize: "13px", color: tokens.textMuted, margin: 0 }}>
                      Receba avisos em tempo real quando sua caixa sair para entrega com código de rastreamento.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.whatsapp}
                    onChange={(e) => setNotifications({ ...notifications, whatsapp: e.target.checked })}
                    style={{ width: "20px", height: "20px", accentColor: tokens.copper, cursor: "pointer" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: `1px solid ${tokens.border}` }}>
                  <div>
                    <h4 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 4px 0", color: tokens.text }}>
                      Curadoria Mensal por E-mail
                    </h4>
                    <p style={{ fontSize: "13px", color: tokens.textMuted, margin: 0 }}>
                      Ficha técnica dos cortes da sua próxima caixa e receitas exclusivas dos mestres.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                    style={{ width: "20px", height: "20px", accentColor: tokens.copper, cursor: "pointer" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 4px 0", color: tokens.text }}>
                      Lotes Especiais & Cortes Raros (SMS)
                    </h4>
                    <p style={{ fontSize: "13px", color: tokens.textMuted, margin: 0 }}>
                      Alertas prioritários para pré-venda de lotes exclusivos de Wagyu A5.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                    style={{ width: "20px", height: "20px", accentColor: tokens.copper, cursor: "pointer" }}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* TAB 6: PRIVACIDADE */}
          {activeTab === "privacidade" && (
            <Card variant="surface" bordered hoverable={false} isDark={isDark} style={{ padding: "36px", borderRadius: "20px" }}>
              <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px", marginBottom: "28px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: "0 0 6px 0", color: tokens.text }}>
                  Privacidade & Segurança
                </h3>
                <p style={{ fontSize: "14px", color: tokens.textMuted, margin: 0 }}>
                  Controle a segurança da sua conta, credenciais de acesso e dados pessoais.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "20px", borderBottom: `1px solid ${tokens.border}` }}>
                  <div>
                    <h4 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 4px 0", color: tokens.text }}>
                      Alterar Senha de Acesso
                    </h4>
                    <p style={{ fontSize: "13px", color: tokens.textMuted, margin: 0 }}>
                      Recomendamos alterar sua senha periodicamente para manter a conta segura.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" isDark={isDark}>
                    Alterar Senha
                  </Button>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "20px", borderBottom: `1px solid ${tokens.border}` }}>
                  <div>
                    <h4 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 4px 0", color: tokens.text }}>
                      Exportar Meus Dados (LGPD)
                    </h4>
                    <p style={{ fontSize: "13px", color: tokens.textMuted, margin: 0 }}>
                      Faça o download de um relatório completo com todas as suas compras e histórico.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" isDark={isDark}>
                    Baixar Dados (.JSON)
                  </Button>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 4px 0", color: "#EF4444" }}>
                      Encerrar Conta Royal Prime
                    </h4>
                    <p style={{ fontSize: "13px", color: tokens.textMuted, margin: 0 }}>
                      Solicitar a exclusão permanente dos seus dados e cancelamento total da assinatura.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" style={{ borderColor: "#EF4444", color: "#EF4444" }}>
                    Excluir Conta
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 7: TERMOS */}
          {activeTab === "termos" && (
            <Card variant="surface" bordered hoverable={false} isDark={isDark} style={{ padding: "36px", borderRadius: "20px" }}>
              <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px", marginBottom: "28px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: "0 0 6px 0", color: tokens.text }}>
                  Termos & Condições de Uso
                </h3>
                <p style={{ fontSize: "14px", color: tokens.textMuted, margin: 0 }}>
                  Regulamento do Clube de Assinaturas e Política de Privacidade Royal Carnes (Versão 2026.1).
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px", fontSize: "14px", color: tokens.textMuted, lineHeight: "1.7" }}>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "700", color: tokens.text, margin: "0 0 8px 0" }}>
                    1. Condições de Assinatura & Recorrência
                  </h4>
                  <p style={{ margin: 0 }}>
                    A assinatura do Clube Royal Carnes é renovada automaticamente a cada 30 dias na modalidade mensal. O sócio tem total liberdade para pausar a entrega ou cancelar o plano a qualquer momento sem cobrança de multa ou fidelidade.
                  </p>
                </div>

                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "700", color: tokens.text, margin: "0 0 8px 0" }}>
                    2. Garantia de Frio & Controle de Qualidade
                  </h4>
                  <p style={{ margin: 0 }}>
                    Todas as caixas do Royal Delivery são despachadas com embalagem térmica de alta densidade e placas de gel refrigerante atóxico que mantêm a temperatura das carnes a -2°C por até 48 horas de transporte.
                  </p>
                </div>

                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "700", color: tokens.text, margin: "0 0 8px 0" }}>
                    3. Política de Privacidade & LGPD
                  </h4>
                  <p style={{ margin: 0 }}>
                    Os dados cadastrais e de pagamento são protegidos por criptografia de ponta a ponta e armazenados sob rigorosos padrões da Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
                  </p>
                </div>
              </div>
            </Card>
          )}

        </section>
      </main>

      {/* MODAL EXECUTIVO DE COMPARAÇÃO & TROCA DE PLANOS */}
      {isPlansModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px"
          }}
          onClick={() => setIsPlansModalOpen(false)}
        >
          <div
            style={{
              background: tokens.surfaceContainer,
              border: `1px solid ${tokens.border}`,
              borderRadius: "24px",
              padding: "40px",
              maxWidth: "1000px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper }}>
                  GERENCIAMENTO DE ASSINATURA ROYAL CARNES
                </span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "700", margin: "4px 0 0 0", color: tokens.text }}>
                  Escolha o Plano Perfeito para o seu Churrasco
                </h2>
              </div>
              <button
                onClick={() => setIsPlansModalOpen(false)}
                style={{
                  background: "transparent",
                  border: `1px solid ${tokens.border}`,
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  color: tokens.text,
                  fontSize: "18px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                ✕
              </button>
            </div>

            {planSuccessMessage && (
              <div style={{ padding: "14px 20px", background: "rgba(34, 197, 94, 0.15)", border: "1px solid #22C55E", borderRadius: "12px", color: "#22C55E", fontSize: "14px", fontWeight: "700" }}>
                ✓ {planSuccessMessage}
              </div>
            )}

            {/* Grid dos 3 Planos no Modal */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
              {(["essential", "pro", "elite"] as const).map((planKey) => {
                const p = planDetails[planKey];
                const isSelected = selectedPlanModal === planKey;
                const isCurrent = currentPlan === planKey;
                return (
                  <div
                    key={planKey}
                    onClick={() => setSelectedPlanModal(planKey)}
                    style={{
                      background: isSelected ? (isDark ? "rgba(184, 115, 51, 0.12)" : "rgba(184, 115, 51, 0.06)") : tokens.background,
                      border: `2px solid ${isSelected ? tokens.copper : tokens.border}`,
                      borderRadius: "18px",
                      padding: "28px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", color: tokens.copper }}>
                          {planKey === "pro" ? "MAIS POPULAR" : planKey === "elite" ? "EXCLUSIVO VIP" : "INICIAL"}
                        </span>
                        {isCurrent && <Badge variant="copper">ATUAL</Badge>}
                      </div>

                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", margin: 0, color: tokens.text }}>
                        {p.name}
                      </h4>

                      <span style={{ fontSize: "28px", fontWeight: "700", color: tokens.copper }}>
                        <span style={{ fontSize: "14px", marginRight: "2px" }}>R$</span>
                        {p.price}
                        <span style={{ fontSize: "12px", color: tokens.textMuted, fontWeight: "400" }}> /mês</span>
                      </span>

                      <div style={{ borderTop: `1px solid ${tokens.border}`, paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: tokens.text }}>
                        <p style={{ margin: 0, fontWeight: "700" }}>🥩 {p.cuts}</p>
                        <p style={{ margin: 0 }}>⚖️ {p.weight}</p>
                        <p style={{ margin: 0 }}>🔪 {p.acc}</p>
                      </div>

                      <ul style={{ paddingLeft: "16px", margin: "8px 0 0 0", fontSize: "12px", color: tokens.textMuted, display: "flex", flexDirection: "column", gap: "6px" }}>
                        {p.benefits.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ marginTop: "24px" }}>
                      <input
                        type="radio"
                        name="plan_selection"
                        checked={isSelected}
                        onChange={() => setSelectedPlanModal(planKey)}
                        style={{ accentColor: tokens.copper, width: "18px", height: "18px" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ações do Modal */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px", borderTop: `1px solid ${tokens.border}`, paddingTop: "24px" }}>
              <Button variant="outline" size="md" isDark={isDark} onClick={() => setIsPlansModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="accent" size="md" onClick={handleConfirmPlanChange}>
                {selectedPlanModal === currentPlan ? "Manter Plano Atual" : `Confirmar Troca para ROYAL ${selectedPlanModal.toUpperCase()}`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. BottomTabBar Mobile */}
      <BottomTabBar activeTab="portal-minha-conta" onNavigate={onNavigate} isDark={isDark} />

      {/* 4. Footer */}
      <Footer onNavigate={onNavigate} isDark={isDark} />
    </div>
  );
};
