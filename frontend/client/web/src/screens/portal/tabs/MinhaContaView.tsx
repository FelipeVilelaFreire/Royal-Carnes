"use client";

import React, { useEffect, useState } from "react";
import { Badge, Button, Card } from "../../../legacy/design-system";
import { AuthModal, PortalHeader, BottomTabBar, Footer } from "../../../legacy/app-shell";
import { themeColorsDefault, themeTokens } from "@foundation/tokens/theme.tokens";
import { CreditCardIcon, EditIcon, GiftIcon, TruckIcon, StarIcon, CheckIcon, CutMeatIcon, ScaleIcon, KnifeIcon, UserIcon } from "../../../legacy/design-system/Icons";
import { OrderDetailModal } from "../../../product-components/ecommerce";
import {
  royalCustomerMock,
  royalCustomerPaymentHistoryMock
} from "@/mocks/customer.mock";
import type { RoyalCustomerOrder } from "@royalprime/client/contracts/order.contract";
import { useMyOrders } from "@royalprime/client/hooks/useMyOrders";
import { prepareOrderViewModel, type PreparedOrderViewModel } from "@royalprime/client/view-models/orders.view-model";
import { catalogSubscriptionPlansMock, type SubscriptionPlanMock, type SubscriptionTier } from "@/mocks/catalog";
import { clientPtBR } from "@/locales/pt-BR";

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMockAuthenticated, setIsMockAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("royal_prime_mock_authenticated") === "true";
    }
    return false;
  });
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RoyalCustomerOrder | null>(null);

  // Estado do Plano de Assinatura & Modal
  const [currentPlan, setCurrentPlan] = useState<SubscriptionTier>(royalCustomerMock.activeSubscription?.planKey || "pro");
  const [isPlansModalOpen, setIsPlansModalOpen] = useState<boolean>(false);
  const [selectedPlanModal, setSelectedPlanModal] = useState<SubscriptionTier>(royalCustomerMock.activeSubscription?.planKey || "pro");
  const [planSuccessMessage, setPlanSuccessMessage] = useState<string>("");

  // Estado dos dados do perfil
  const [personalData, setPersonalData] = useState({
    name: royalCustomerMock.name,
    email: royalCustomerMock.email,
    phone: royalCustomerMock.phone,
    cpf: royalCustomerMock.cpf,
    birthdate: royalCustomerMock.birthdate,
    preferredDoneness: royalCustomerMock.preferredDoneness
  });
  const [isSavedData, setIsSavedData] = useState<boolean>(false);

  // Estado das notificacoes
  const [notifications, setNotifications] = useState({
    ...royalCustomerMock.notifications
  });

  useEffect(() => {
    const handleThemeChange = () => {
      const current = localStorage.getItem("royal_prime_theme");
      if (current === "dark" || current === "light") {
        setThemeMode(current);
      }
    };
    const handleAuthChange = () => {
      setIsMockAuthenticated(localStorage.getItem("royal_prime_mock_authenticated") === "true");
    };
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("royal_theme_changed", handleThemeChange);
    window.addEventListener("royal_auth_changed", handleAuthChange);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("royal_theme_changed", handleThemeChange);
      window.removeEventListener("royal_auth_changed", handleAuthChange);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isDark = themeMode === "dark";
  const tokens = isDark ? themeColorsDefault.dark : themeColorsDefault.light;

  const toggleTheme = () => {
    const next = themeMode === "dark" ? "light" : "dark";
    setThemeMode(next);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", next);
      document.documentElement.style.backgroundColor = next === "dark" ? "#0B0908" : "#FCFBF7";
      document.documentElement.style.color = next === "dark" ? "#E8E1DE" : "#1A1A1A";
    }
    localStorage.setItem("royal_prime_theme", next);
    window.dispatchEvent(new Event("royal_theme_changed"));
  };

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const sidebarLinks = [
    { id: "painel", label: "Painel Geral" },
    { id: "assinatura", label: clientPtBR.minhaConta.tabs.subscription },
    { id: "dados", label: clientPtBR.minhaConta.tabs.personalData },
    { id: "enderecos", label: clientPtBR.minhaConta.tabs.addresses },
    { id: "pagamentos", label: clientPtBR.minhaConta.tabs.payment },
    { id: "notificacoes", label: clientPtBR.minhaConta.tabs.preferences },
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

  const planDetails = catalogSubscriptionPlansMock;
  const currentPlanDetails = planDetails.find((plan) => plan.key === currentPlan) || planDetails[0];
  const { viewModels: orderVMs, currentOrderVM: activeOrderVM, currentSubscriptionOrderVM: activeSubVM } = useMyOrders();
  const paymentHistory = royalCustomerPaymentHistoryMock;
  const recentOrderVMs = orderVMs.slice(0, 3);
  const currentOrderVM = activeOrderVM;
  const currentOrder = currentOrderVM?.rawOrder;
  const currentSubscriptionOrder = activeSubVM?.rawOrder;
  const cycleUsage = currentSubscriptionOrder?.cycleUsage;
  const formatPlanPrice = (plan: SubscriptionPlanMock) => plan.monthlyPrice.toLocaleString("pt-BR");
  const getStatusToneTokens = (tone: "success" | "danger" | "pending" | "active") => {
    if (tone === "success") return { color: themeTokens.colors.statusActive, background: isDark ? "rgba(16, 185, 129, 0.14)" : "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.32)" };
    if (tone === "danger") return { color: themeTokens.colors.statusCanceled, background: isDark ? "rgba(239, 68, 68, 0.14)" : "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.32)" };
    if (tone === "pending") return { color: themeTokens.colors.statusPaused, background: isDark ? "rgba(245, 158, 11, 0.14)" : "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.32)" };
    return { color: tokens.copper, background: isDark ? "rgba(184, 115, 51, 0.14)" : "rgba(184, 115, 51, 0.08)", border: isDark ? "rgba(184, 115, 51, 0.32)" : "rgba(184, 115, 51, 0.26)" };
  };
  const renderStatusPillFromVM = (vm: PreparedOrderViewModel) => {
    const statusTokens = getStatusToneTokens(vm.statusTone);
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", width: "fit-content", border: `1px solid ${statusTokens.border}`, borderRadius: "999px", background: statusTokens.background, color: statusTokens.color, padding: "6px 10px", fontSize: "12px", fontWeight: 800 }}>
        <span style={{ width: "7px", height: "7px", borderRadius: "999px", background: statusTokens.color, boxShadow: `0 0 8px ${statusTokens.color}` }} />
        {vm.statusLabel}
      </span>
    );
  };
  const usagePercent = (used: number, limit: number) => Math.round((used / limit) * 100);
  const getPlanLabel = (plan: SubscriptionPlanMock) => `Royal ${plan.name}`;
  const getPlanCapacitySummary = (plan: SubscriptionPlanMock) => [
    `${plan.proteinKgLimit}kg de carnes`,
    `${plan.charcoalKgLimit}kg de carvao`,
    plan.utensilSelectionLimit > 0 ? `${plan.utensilSelectionLimit} utensilio Royal` : `${plan.seasoningSelectionLimit} tempero${plan.seasoningSelectionLimit > 1 ? "s" : ""} base`
  ];
  const effectiveCycleUsage = cycleUsage || {
    cycleLabel: "Atual",
    cutsUsed: 0,
    cutsLimit: currentPlanDetails.productSelectionLimit,
    weightKgUsed: 0,
    weightKgLimit: currentPlanDetails.proteinKgLimit,
    charcoalKgUsed: 0,
    charcoalKgLimit: currentPlanDetails.charcoalKgLimit,
    complementsUsed: 0,
    complementsLimit: currentPlanDetails.seasoningSelectionLimit + currentPlanDetails.sideSelectionLimit,
    seasoningsUsed: 0,
    seasoningsLimit: currentPlanDetails.seasoningSelectionLimit,
    sidesUsed: 0,
    sidesLimit: currentPlanDetails.sideSelectionLimit,
    utensilsUsed: 0,
    utensilsLimit: currentPlanDetails.utensilSelectionLimit
  };
  const cutsPercent = usagePercent(effectiveCycleUsage.cutsUsed, effectiveCycleUsage.cutsLimit);
  const weightPercent = usagePercent(effectiveCycleUsage.weightKgUsed, effectiveCycleUsage.weightKgLimit);
  const charcoalPercent = usagePercent(effectiveCycleUsage.charcoalKgUsed, effectiveCycleUsage.charcoalKgLimit);
  const complementsPercent = usagePercent(effectiveCycleUsage.complementsUsed, effectiveCycleUsage.complementsLimit);
  const utensilsPercent = effectiveCycleUsage.utensilsLimit > 0 ? usagePercent(effectiveCycleUsage.utensilsUsed, effectiveCycleUsage.utensilsLimit) : 0;

  return (
    <div
      className="minha-conta-root"
      style={{
        background: tokens.background,
        color: tokens.text,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
        transition: "background 0.3s ease, color 0.3s ease"
      }}
    >
      {/* 1. Header Único Logado do Portal */}
      <PortalHeader
        activeTab="portal-minha-conta"
        themeMode={themeMode}
        onToggleTheme={toggleTheme}
        onNavigate={onNavigate}
      />

      <style>{`
        .minha-conta-root {
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
        }

        .minha-conta-root * {
          box-sizing: border-box;
          min-width: 0;
        }

        .minha-conta-desktop-footer {
          display: block;
        }

        @media (max-width: 900px) {
          .minha-conta-auth-main {
            padding: 24px 16px calc(112px + env(safe-area-inset-bottom)) !important;
          }

          .minha-conta-content {
            gap: 24px !important;
            width: 100% !important;
            overflow-x: hidden !important;
          }

          .minha-conta-content button,
          .minha-conta-sidebar button {
            max-width: 100% !important;
            white-space: normal !important;
          }

          .minha-conta-content h1,
          .minha-conta-content h2,
          .minha-conta-content h3,
          .minha-conta-content h4,
          .minha-conta-sidebar h1 {
            overflow-wrap: anywhere;
          }
        }

        @media (max-width: 768px) {
          .portal-header,
          .minha-conta-desktop-footer {
            display: none !important;
          }
        }
      `}</style>

      {!isMockAuthenticated ? (
        <main
          className="minha-conta-auth-main"
          style={{
            flex: 1,
            maxWidth: "920px",
            width: "100%",
            margin: "0 auto",
            padding: "72px 32px 120px",
            display: "grid",
            placeItems: "center",
            boxSizing: "border-box"
          }}
        >
          <Card variant="surface" bordered hoverable={false} isDark={isDark} style={{ width: "100%", padding: "42px", borderRadius: "18px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "18px", display: "grid", placeItems: "center", background: isDark ? "rgba(184, 115, 51, 0.14)" : "rgba(184, 115, 51, 0.08)", border: `1px solid ${tokens.border}` }}>
              <UserIcon size={26} color={tokens.copper} />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "34px", margin: 0, color: tokens.text }}>
                {clientPtBR.authEmptyState.title}
              </h1>
              <p style={{ margin: "10px auto 0", color: tokens.textMuted, fontSize: "15px", lineHeight: 1.6, maxWidth: "560px" }}>
                {clientPtBR.authEmptyState.description}
              </p>
            </div>
            <Button variant="accent" size="md" onClick={() => setIsAuthModalOpen(true)}>
              {clientPtBR.navigation.entrar}
            </Button>
          </Card>
        </main>
      ) : (
      <>

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
          @keyframes minhaContaAppear {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @media (max-width: 900px) {
            .grid-responsive {
              grid-template-columns: 1fr !important;
              gap: 24px !important;
              padding: 24px 16px calc(116px + env(safe-area-inset-bottom)) !important;
              animation: minhaContaAppear 0.34s ease both;
            }

            .minha-conta-sidebar {
              gap: 18px !important;
            }

            .minha-conta-tabs {
              flex-direction: row !important;
              gap: 8px !important;
              border-left: none !important;
              border-bottom: 1px solid ${tokens.border} !important;
              padding-left: 0 !important;
              padding-bottom: 10px !important;
              overflow-x: auto !important;
              scrollbar-width: none;
            }

            .minha-conta-tabs::-webkit-scrollbar {
              display: none;
            }

            .minha-conta-tabs button {
              flex: 0 0 auto !important;
              white-space: nowrap !important;
            }

            .cycle-usage-grid {
              grid-template-columns: 1fr !important;
            }

            .minha-conta-current-order,
            .minha-conta-order-row {
              grid-template-columns: 1fr !important;
            }

            .minha-conta-order-row {
              gap: 14px !important;
            }

            .minha-conta-order-side {
              align-items: flex-start !important;
            }
          }

          .cycle-usage-grid {
            align-items: stretch;
          }

          .cycle-usage-grid > div {
            min-height: 156px !important;
            justify-content: space-between !important;
          }

          .cycle-usage-grid > div > div:first-child {
            min-height: 36px;
          }

          .cycle-usage-grid > div > div:nth-child(2) {
            min-height: 34px;
          }

          @media (min-width: 901px) and (max-width: 1280px) {
            .cycle-usage-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 768px) {
            .portal-header {
              display: none !important;
            }
          }
        `}</style>

        {/* Sidebar Lateral Esquerda com Links das Abas e Resumo do Plano */}
        <aside className="minha-conta-sidebar" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
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
              <Badge variant="copper">{getPlanLabel(currentPlanDetails).toUpperCase()}</Badge>
            </div>
            <p style={{ fontSize: "14px", fontWeight: "700", color: tokens.text, margin: 0 }}>
              R$ {formatPlanPrice(currentPlanDetails)} / mês
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
            className="minha-conta-tabs"
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
                  onClick={() => handleTabSelect(link.id)}
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
        <section className="minha-conta-content" style={{ display: "flex", flexDirection: "column", gap: "40px", minWidth: 0 }}>
          
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
                        {getPlanLabel(currentPlanDetails)}
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
                          R$ {formatPlanPrice(currentPlanDetails)} <span style={{ fontSize: "13px", fontWeight: "400", color: tokens.textMuted }}>/ mês</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "220px" }}>
                    <Button variant="accent" size="md" onClick={() => onNavigate ? onNavigate("/portal-minha-caixa") : (window.location.href = "/portal-minha-caixa")}>
                      Ver minha caixa
                    </Button>
                    <Button variant="outline" size="md" isDark={isDark} onClick={() => setIsPlansModalOpen(true)}>
                      Gerenciar assinatura
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Card "USO DO CICLO DE SETEMBRO" (Com Medidores Nobres e Sem Quebras) */}
              <div
                style={{
                  background: tokens.surfaceContainer,
                  border: `1px solid ${tokens.border}`,
                  borderRadius: "20px",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "28px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
                      USO DO CICLO DE {effectiveCycleUsage.cycleLabel.toUpperCase()}
                    </span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: 0, color: tokens.text }}>
                      Uso & Capacidade da Assinatura
                    </h3>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: tokens.copper }}>
                    Renova em {royalCustomerMock.activeSubscription?.nextBillingLabel}
                  </span>
                </div>

                {/* Grid de Medidores de Capacidade com Layout Espaçoso */}
                <div className="cycle-usage-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "12px" }}>
                  
                  {/* Item 1: Cortes Utilizados */}
                  <div
                    style={{
                      background: tokens.background,
                      border: `1px solid ${tokens.border}`,
                      borderRadius: "16px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.03)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(184, 115, 51, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <CutMeatIcon size={18} color={tokens.copper} />
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: tokens.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1.25 }}>
                        Cortes
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: "24px", fontWeight: "800", color: tokens.text }}>
                        {effectiveCycleUsage.cutsUsed} <span style={{ fontSize: "13px", fontWeight: "600", color: tokens.textMuted }}>/ {effectiveCycleUsage.cutsLimit} cortes</span>
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: tokens.copper }}>
                        {cutsPercent}%
                      </span>
                    </div>

                    <div style={{ width: "100%", height: "8px", background: tokens.surfaceContainer, borderRadius: "9999px", overflow: "hidden", border: `1px solid ${tokens.border}` }}>
                      <div style={{ width: `${cutsPercent}%`, height: "100%", background: `linear-gradient(90deg, ${tokens.copper} 0%, #D4AF37 100%)`, borderRadius: "9999px", transition: "width 0.5s ease" }} />
                    </div>
                  </div>

                  {/* Item 2: Capacidade de Peso */}
                  <div
                    style={{
                      background: tokens.background,
                      border: `1px solid ${tokens.border}`,
                      borderRadius: "16px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.03)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(184, 115, 51, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <ScaleIcon size={18} color={tokens.copper} />
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: tokens.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1.25 }}>
                        Peso
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: "24px", fontWeight: "800", color: tokens.text }}>
                        {effectiveCycleUsage.weightKgUsed}kg <span style={{ fontSize: "13px", fontWeight: "600", color: tokens.textMuted }}>/ {effectiveCycleUsage.weightKgLimit.toFixed(1)}kg</span>
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: tokens.copper }}>
                        {weightPercent}%
                      </span>
                    </div>

                    <div style={{ width: "100%", height: "8px", background: tokens.surfaceContainer, borderRadius: "9999px", overflow: "hidden", border: `1px solid ${tokens.border}` }}>
                      <div style={{ width: `${weightPercent}%`, height: "100%", background: `linear-gradient(90deg, ${tokens.copper} 0%, #D4AF37 100%)`, borderRadius: "9999px", transition: "width 0.5s ease" }} />
                    </div>
                  </div>

                  {/* Item 3: Complementos */}
                  <div
                    style={{
                      background: tokens.background,
                      border: `1px solid ${tokens.border}`,
                      borderRadius: "16px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.03)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(184, 115, 51, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <KnifeIcon size={18} color={tokens.copper} />
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: tokens.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1.25 }}>
                        Compl.
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: "24px", fontWeight: "800", color: tokens.text }}>
                        {effectiveCycleUsage.complementsUsed} <span style={{ fontSize: "13px", fontWeight: "600", color: tokens.textMuted }}>/ {effectiveCycleUsage.complementsLimit} compl.</span>
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: tokens.copper }}>
                        {complementsPercent}%
                      </span>
                    </div>

                    <div style={{ width: "100%", height: "8px", background: tokens.surfaceContainer, borderRadius: "9999px", overflow: "hidden", border: `1px solid ${tokens.border}` }}>
                      <div style={{ width: `${complementsPercent}%`, height: "100%", background: `linear-gradient(90deg, ${tokens.copper} 0%, #D4AF37 100%)`, borderRadius: "9999px", transition: "width 0.5s ease" }} />
                    </div>
                  </div>

                  <div
                    style={{
                      background: tokens.background,
                      border: `1px solid ${tokens.border}`,
                      borderRadius: "16px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.03)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(184, 115, 51, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <TruckIcon size={18} color={tokens.copper} />
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: tokens.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1.25 }}>
                        Carvao
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: "24px", fontWeight: "800", color: tokens.text }}>
                        {effectiveCycleUsage.charcoalKgUsed}kg <span style={{ fontSize: "13px", fontWeight: "600", color: tokens.textMuted }}>/ {effectiveCycleUsage.charcoalKgLimit}kg</span>
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: tokens.copper }}>
                        {charcoalPercent}%
                      </span>
                    </div>

                    <div style={{ width: "100%", height: "8px", background: tokens.surfaceContainer, borderRadius: "9999px", overflow: "hidden", border: `1px solid ${tokens.border}` }}>
                      <div style={{ width: `${charcoalPercent}%`, height: "100%", background: `linear-gradient(90deg, ${tokens.copper} 0%, #D4AF37 100%)`, borderRadius: "9999px", transition: "width 0.5s ease" }} />
                    </div>
                  </div>

                  <div
                    style={{
                      background: tokens.background,
                      border: `1px solid ${tokens.border}`,
                      borderRadius: "16px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.03)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(184, 115, 51, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <KnifeIcon size={18} color={tokens.copper} />
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: tokens.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1.25 }}>
                        Utensilio
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: "24px", fontWeight: "800", color: tokens.text }}>
                        {effectiveCycleUsage.utensilsUsed} <span style={{ fontSize: "13px", fontWeight: "600", color: tokens.textMuted }}>/ {effectiveCycleUsage.utensilsLimit} item</span>
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: tokens.copper }}>
                        {utensilsPercent}%
                      </span>
                    </div>

                    <div style={{ width: "100%", height: "8px", background: tokens.surfaceContainer, borderRadius: "9999px", overflow: "hidden", border: `1px solid ${tokens.border}` }}>
                      <div style={{ width: `${utensilsPercent}%`, height: "100%", background: `linear-gradient(90deg, ${tokens.copper} 0%, #D4AF37 100%)`, borderRadius: "9999px", transition: "width 0.5s ease" }} />
                    </div>
                  </div>

                </div>

                {/* Banner de Upgrade Executivo */}
                <div
                  style={{
                    background: isDark ? "rgba(184, 115, 51, 0.1)" : "rgba(184, 115, 51, 0.05)",
                    border: `1px solid ${tokens.copper}`,
                    borderRadius: "14px",
                    padding: "18px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px"
                  }}
                >
                  <span style={{ fontSize: "14px", color: tokens.text, fontWeight: "500" }}>
                    Precisa de mais cortes e peso por ciclo? Conheça os planos superiores.
                  </span>
                  <Button variant="accent" size="sm" onClick={() => setIsPlansModalOpen(true)}>
                    Fazer Upgrade ➔
                  </Button>
                </div>
              </div>

              {/* Pedido atual e historico lidos dos mocks do cliente */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "12px", gap: "16px", flexWrap: "wrap" }}>
                  <div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: 0, color: tokens.text }}>
                      Pedidos e entregas
                    </h3>
                    <p style={{ margin: "6px 0 0", color: tokens.textMuted, fontSize: "14px" }}>
                      Royal Delivery e ciclos de assinatura vinculados a sua conta.
                    </p>
                  </div>
                  <span
                    onClick={() => onNavigate ? onNavigate("/meus-pedidos") : (window.location.href = "/meus-pedidos")}
                    style={{ fontSize: "13px", fontWeight: "700", color: tokens.copper, cursor: "pointer" }}
                  >
                    Ver acompanhamento completo
                  </span>
                </div>

                {currentOrderVM && currentOrder && (
                  <Card className="minha-conta-current-order" variant="surface" bordered hoverable={false} isDark={isDark} style={{ padding: "24px", borderRadius: "18px", display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(240px, 0.6fr)", gap: "24px", alignItems: "stretch" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                        <Badge variant="copper">{currentOrderVM.kindLabel}</Badge>
                        <span style={{ color: tokens.textMuted, fontSize: "12px", fontWeight: 800 }}>{currentOrderVM.code}</span>
                      </div>
                      <div>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "700", margin: 0, color: getStatusToneTokens(currentOrderVM.statusTone).color }}>
                          {currentOrderVM.statusLabel}
                        </h4>
                        <p style={{ margin: "6px 0 0", color: tokens.textMuted, fontSize: "14px", lineHeight: 1.5 }}>
                          {currentOrder.title} - {currentOrder.summary}
                        </p>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "12px" }}>
                        <div>
                          <span style={{ display: "block", color: tokens.textMuted, fontSize: "11px", fontWeight: 800, textTransform: "uppercase" }}>Previsao</span>
                          <strong style={{ color: tokens.text, fontSize: "13px" }}>{currentOrder.delivery.estimateLabel}</strong>
                        </div>
                        <div>
                          <span style={{ display: "block", color: tokens.textMuted, fontSize: "11px", fontWeight: 800, textTransform: "uppercase" }}>Codigo</span>
                          <strong style={{ color: tokens.copper, fontSize: "18px", letterSpacing: "0.08em" }}>{currentOrderVM.deliveryCodeLabel}</strong>
                        </div>
                        <div>
                          <span style={{ display: "block", color: tokens.textMuted, fontSize: "11px", fontWeight: 800, textTransform: "uppercase" }}>Total</span>
                          <strong style={{ color: tokens.text, fontSize: "13px" }}>{currentOrderVM.moneyLabel}</strong>
                        </div>
                      </div>
                      <div>
                        <Button variant="outline" size="sm" isDark={isDark} onClick={() => setSelectedOrder(currentOrder)}>
                          Ver detalhes
                        </Button>
                      </div>
                    </div>
                    <div style={{ border: `1px solid ${tokens.border}`, borderRadius: "14px", padding: "14px", display: "grid", alignContent: "center", background: tokens.background, minWidth: 0 }}>
                      <div style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${currentOrderVM.timelineSteps.length}, minmax(82px, 1fr))`, gap: "6px", overflowX: "auto", padding: "8px 2px 2px" }}>
                        <span style={{ position: "absolute", left: "16px", right: "16px", top: "17px", height: "2px", background: tokens.border, opacity: 0.7 }} />
                        {currentOrderVM.timelineSteps.map((step, index) => {
                          const isCurrentStep = currentOrder.status === step.status;
                          const color = step.completed ? themeTokens.colors.statusActive : isCurrentStep ? tokens.copper : tokens.border;
                          const bg = step.completed
                            ? themeTokens.colors.statusActive
                            : isCurrentStep
                              ? isDark ? "rgba(184, 115, 51, 0.14)" : "rgba(184, 115, 51, 0.08)"
                              : tokens.surfaceContainer;
                          return (
                            <div key={step.status} style={{ position: "relative", zIndex: 1, minWidth: "82px", display: "grid", justifyItems: "center", gap: "7px", textAlign: "center" }}>
                              {index < currentOrderVM.timelineSteps.length - 1 && step.completed ? (
                                <span style={{ position: "absolute", left: "50%", right: "-50%", top: "9px", height: "2px", background: themeTokens.colors.statusActive }} />
                              ) : null}
                              <span style={{ width: "20px", height: "20px", borderRadius: "999px", border: `1px solid ${color}`, background: bg, display: "grid", placeItems: "center", boxShadow: step.completed || isCurrentStep ? `0 0 0 4px ${isDark ? "rgba(16, 185, 129, 0.12)" : "rgba(16, 185, 129, 0.08)"}` : "none", position: "relative", zIndex: 2 }}>
                                {step.completed ? <CheckIcon size={12} color="#FFFFFF" /> : null}
                              </span>
                              <span style={{ color: step.completed ? themeTokens.colors.statusActive : isCurrentStep ? tokens.copper : tokens.textMuted, fontSize: "10px", fontWeight: step.completed || isCurrentStep ? 900 : 700, lineHeight: 1.2, maxWidth: "82px" }}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {recentOrderVMs.map((vm) => (
                    <Card key={vm.id} className="minha-conta-order-row" variant="surface" bordered hoverable isDark={isDark} style={{ padding: "20px 24px", borderRadius: "16px", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "24px", alignItems: "flex-start" }}>
                      <div style={{ width: "72px", height: "72px", borderRadius: "12px", overflow: "hidden", border: `1px solid ${tokens.border}`, background: tokens.surfaceContainer, flexShrink: 0 }}>
                        <img src={vm.rawOrder.imageUrl} alt={vm.rawOrder.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "left" }}>
                        <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.copper }}>
                          {vm.kindLabel} - {vm.rawOrder.createdAtLabel}
                        </span>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: "700", margin: 0, color: tokens.text }}>
                          {vm.code} - {vm.rawOrder.title}
                        </h4>
                        <span style={{ fontSize: "13px", color: tokens.textMuted, lineHeight: "1.4" }}>
                          {vm.rawOrder.summary}
                        </span>
                      </div>

                      <div className="minha-conta-order-side" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
                        <span style={{ fontSize: "18px", fontWeight: "700", color: tokens.text }}>
                          {vm.moneyLabel}
                        </span>
                        {renderStatusPillFromVM(vm)}
                        <Button variant="outline" size="sm" isDark={isDark} onClick={() => setSelectedOrder(vm.rawOrder)}>
                          Ver detalhes
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

            </>
          )}

          {/* TAB DEDICADA: MINHA ASSINATURA */}
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
                      {getPlanLabel(currentPlanDetails)}
                    </h4>
                    <p style={{ fontSize: "14px", color: tokens.textMuted, margin: "4px 0 0 0" }}>
                      Renovação automática em {royalCustomerMock.activeSubscription?.nextBillingLabel} por <strong style={{ color: tokens.copper }}>R$ {formatPlanPrice(currentPlanDetails)} / mês</strong>
                    </p>
                  </div>
                  <Button variant="accent" size="md" onClick={() => setIsPlansModalOpen(true)}>
                    Gerenciar ou Alterar Plano ➔
                  </Button>
                </div>
              </Card>

              {/* Comparativo de Planos */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
                {planDetails.map((p) => {
                  const isCurrent = currentPlan === p.key;
                  return (
                    <Card
                      key={p.key}
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
                          {getPlanLabel(p)}
                        </h4>

                        <span style={{ fontSize: "26px", fontWeight: "700", color: tokens.text }}>
                          <span style={{ fontSize: "14px", marginRight: "2px" }}>R$</span>
                          {formatPlanPrice(p)}
                          <span style={{ fontSize: "12px", color: tokens.textMuted, fontWeight: "400" }}> /mês</span>
                        </span>

                        <div style={{ borderTop: `1px solid ${tokens.border}`, paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: tokens.text }}>
                          {getPlanCapacitySummary(p).map((item) => (
                            <p key={item} style={{ margin: 0, fontWeight: item.includes("carnes") ? "700" : "400" }}>{item}</p>
                          ))}
                        </div>

                        <ul style={{ paddingLeft: "16px", margin: "8px 0 0 0", fontSize: "12px", color: tokens.textMuted, display: "flex", flexDirection: "column", gap: "6px" }}>
                          {p.features.map((b, i) => (
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
                              setSelectedPlanModal(p.key);
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

          {/* TAB 3: ENDERECOS */}
          {activeTab === "enderecos" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px", gap: "16px", flexWrap: "wrap" }}>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: "0 0 6px 0", color: tokens.text }}>
                    Meus Enderecos
                  </h3>
                  <p style={{ fontSize: "14px", color: tokens.textMuted, margin: 0 }}>
                    Locais salvos para Royal Delivery e ciclos de assinatura.
                  </p>
                </div>
                <Button variant="accent" size="sm">
                  Adicionar endereco
                </Button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                {royalCustomerMock.addresses.map((address) => (
                  <Card key={address.id} variant="surface" bordered hoverable isDark={isDark} style={{ padding: "28px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700", margin: 0, color: tokens.text }}>
                          {address.label}
                        </h4>
                        {address.isPrimary && <Badge variant="copper">PRINCIPAL</Badge>}
                      </div>
                      <EditIcon size={18} color={tokens.copper} style={{ cursor: "pointer" }} />
                    </div>

                    <div style={{ fontSize: "14px", color: tokens.textMuted, lineHeight: "1.6" }}>
                      <p style={{ fontWeight: "700", color: tokens.text, margin: "0 0 4px 0" }}>{address.recipientName}</p>
                      <p style={{ margin: 0 }}>{address.streetLine}</p>
                      <p style={{ margin: 0 }}>{address.neighborhoodLine}</p>
                      <p style={{ margin: 0 }}>CEP: {address.zipCode}{address.phone ? ` - Tel: ${address.phone}` : ""}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PAGAMENTOS COM HISTÓRICO DE FATURAS E MENSALIDADES */}
          {activeTab === "pagamentos" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
              {/* Formas de Pagamento Cadastradas */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px" }}>
                  <div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: "0 0 6px 0", color: tokens.text }}>
                      Formas de Pagamento
                    </h3>
                    <p style={{ fontSize: "14px", color: tokens.textMuted, margin: 0 }}>
                      Cartões de crédito e chaves PIX cadastradas para a cobrança da sua assinatura.
                    </p>
                  </div>
                  <Button variant="accent" size="sm">
                    + Novo Cartão
                  </Button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                  {royalCustomerMock.paymentMethods.map((paymentMethod) => (
                    <Card key={paymentMethod.id} variant="surface" bordered hoverable isDark={isDark} style={{ padding: "28px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <CreditCardIcon size={24} color={paymentMethod.isDefault ? tokens.copper : tokens.textMuted} />
                          <h4 style={{ fontSize: "18px", fontWeight: "700", margin: 0, color: tokens.text }}>
                            {paymentMethod.brand}
                          </h4>
                        </div>
                        {paymentMethod.isDefault && <Badge variant="copper">PADRAO</Badge>}
                      </div>

                      <div>
                        <p style={{ fontSize: "18px", fontWeight: "700", letterSpacing: "2px", color: tokens.text, margin: "0 0 4px 0" }}>
                          Final {paymentMethod.last4}
                        </p>
                        <p style={{ fontSize: "13px", color: tokens.textMuted, margin: 0 }}>
                          Validade: {paymentMethod.expiresAt} - Titular: {paymentMethod.holderName}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>

              </div>

              {/* Histórico Completo de Faturas & Pagamentos Mensais */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ borderBottom: `1px solid ${tokens.border}`, paddingBottom: "16px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.copper, display: "block", marginBottom: "4px" }}>
                    REGISTRO DE COBRANÇAS
                  </span>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", margin: 0, color: tokens.text }}>
                    Histórico de Faturas & Mensalidades
                  </h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {paymentHistory.map((invoice) => (
                    <Card
                      key={invoice.id}
                      variant="surface"
                      bordered
                      hoverable={false}
                      isDark={isDark}
                      style={{
                        padding: "20px 24px",
                        borderRadius: "16px",
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        boxSizing: "border-box",
                        gap: "20px"
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: "left", alignItems: "flex-start", flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: "700", margin: 0, color: tokens.text, textAlign: "left" }}>
                            {invoice.description}
                          </h4>
                          <span style={{ fontSize: "11px", fontWeight: "700", color: "#22C55E", background: "rgba(34, 197, 94, 0.12)", padding: "3px 10px", borderRadius: "6px", letterSpacing: "0.05em" }}>
                            {invoice.status}
                          </span>
                        </div>
                        <span style={{ fontSize: "13px", color: tokens.textMuted, textAlign: "left" }}>
                          {invoice.date} • Cobrado no {invoice.paymentMethodLabel} • Id: {invoice.id}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: 0 }}>
                        <span style={{ fontSize: "20px", fontWeight: "700", color: tokens.copper }}>
                          R$ {invoice.amountLabel}
                        </span>

                        <Button variant="outline" size="sm" isDark={isDark}>
                          Baixar Comprovante PDF
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
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
                      Ficha tecnica dos cortes do seu proximo ciclo e receitas exclusivas dos mestres.
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
      </>
      )}

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
                <span style={{ position: "relative", width: "14px", height: "14px", display: "block" }}>
                  <span style={{ position: "absolute", top: "6px", left: 0, width: "14px", height: "2px", background: "currentColor", transform: "rotate(45deg)" }} />
                  <span style={{ position: "absolute", top: "6px", left: 0, width: "14px", height: "2px", background: "currentColor", transform: "rotate(-45deg)" }} />
                </span>
              </button>
            </div>

            {planSuccessMessage && (
              <div style={{ padding: "14px 20px", background: "rgba(34, 197, 94, 0.15)", border: "1px solid #22C55E", borderRadius: "12px", color: "#22C55E", fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckIcon size={16} color="#22C55E" />
                {planSuccessMessage}
              </div>
            )}

            {/* Grid dos 3 Planos no Modal */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
              {planDetails.map((p) => {
                const isSelected = selectedPlanModal === p.key;
                const isCurrent = currentPlan === p.key;
                return (
                  <div
                    key={p.key}
                    onClick={() => setSelectedPlanModal(p.key)}
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
                          {p.key === "premium" ? "MAIS EQUILIBRADO" : p.key === "pro" ? "EXPERIENCIA COMPLETA" : "INICIAL"}
                        </span>
                        {isCurrent && <Badge variant="copper">ATUAL</Badge>}
                      </div>

                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", margin: 0, color: tokens.text }}>
                        {getPlanLabel(p)}
                      </h4>

                      <span style={{ fontSize: "28px", fontWeight: "700", color: tokens.copper }}>
                        <span style={{ fontSize: "14px", marginRight: "2px" }}>R$</span>
                        {formatPlanPrice(p)}
                        <span style={{ fontSize: "12px", color: tokens.textMuted, fontWeight: "400" }}> /mês</span>
                      </span>

                      <div style={{ borderTop: `1px solid ${tokens.border}`, paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: tokens.text }}>
                        {getPlanCapacitySummary(p).map((item) => (
                          <p key={item} style={{ margin: 0, fontWeight: item.includes("carnes") ? "700" : "400" }}>{item}</p>
                        ))}
                      </div>

                      <ul style={{ paddingLeft: "16px", margin: "8px 0 0 0", fontSize: "12px", color: tokens.textMuted, display: "flex", flexDirection: "column", gap: "6px" }}>
                        {p.features.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ marginTop: "24px" }}>
                      <input
                        type="radio"
                        name="plan_selection"
                        checked={isSelected}
                        onChange={() => setSelectedPlanModal(p.key)}
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
                {selectedPlanModal === currentPlan ? "Manter Plano Atual" : `Confirmar Troca para ${getPlanLabel(planDetails.find((plan) => plan.key === selectedPlanModal) || currentPlanDetails)}`}
              </Button>
            </div>
          </div>
        </div>
      )}

      <OrderDetailModal
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        isDark={isDark}
        isMobile={isMobileScreen}
      />

      {/* 3. BottomTabBar Mobile */}
      <BottomTabBar activeTab="portal-minha-conta" onNavigate={onNavigate} isDark={isDark} />

      {/* 4. Footer */}
      <div className="minha-conta-desktop-footer">
        <Footer onNavigate={onNavigate} isDark={isDark} />
      </div>
      <AuthModal
        open={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={() => {
          setIsMockAuthenticated(true);
          setIsAuthModalOpen(false);
        }}
        isDark={isDark}
        context="portal"
      />
    </div>
  );
};
