"use client";

import React, { useEffect, useState } from "react";
import { Badge, Button, Card } from "../../../legacy/design-system";
import { AuthModal, BottomTabBar, PortalHeader } from "../../../legacy/app-shell";
import { CheckIcon, UserIcon } from "../../../legacy/design-system/Icons";
import { themeColorsDefault, themeTokens } from "@foundation/tokens/theme.tokens";
import { OrderDetailModal } from "../../../product-components/ecommerce";
import { clientPtBR } from "@/locales/pt-BR";
import { catalogSubscriptionPlansMock } from "@/mocks/catalog";
import { royalCustomerMock } from "@/mocks/customer.mock";
import { useMyOrders } from "@royalprime/client/hooks/useMyOrders";
import type { PreparedOrderViewModel } from "@royalprime/client/view-models/orders.view-model";

export interface MeusPedidosViewProps {
  onNavigate?: (path: string) => void;
}

export const MeusPedidosView: React.FC<MeusPedidosViewProps> = ({ onNavigate }) => {
  const [themeMode, setThemeMode] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr === "dark" || attr === "light") return attr;
      const stored = localStorage.getItem("royal_prime_theme");
      if (stored === "dark" || stored === "light") return stored;
    }
    return "dark";
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMockAuthenticated, setIsMockAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("royal_prime_mock_authenticated") === "true";
    }
    return false;
  });
  const [selectedOrderVM, setSelectedOrderVM] = useState<PreparedOrderViewModel | null>(null);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  const { viewModels, currentOrderVM, currentSubscriptionOrderVM } = useMyOrders();

  useEffect(() => {
    const handleThemeChange = () => {
      const current = localStorage.getItem("royal_prime_theme");
      if (current === "dark" || current === "light") setThemeMode(current);
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
  const strings = clientPtBR.meusPedidos;
  const currentPlan = catalogSubscriptionPlansMock.find(
    (plan) => plan.key === royalCustomerMock.activeSubscription?.planKey
  );

  const getStatusToneTokens = (tone: "success" | "danger" | "pending" | "active") => {
    if (tone === "success") return { color: themeTokens.colors.statusActive, background: isDark ? "rgba(16, 185, 129, 0.14)" : "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.32)" };
    if (tone === "danger") return { color: themeTokens.colors.statusCanceled, background: isDark ? "rgba(239, 68, 68, 0.14)" : "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.32)" };
    if (tone === "pending") return { color: themeTokens.colors.statusPaused, background: isDark ? "rgba(245, 158, 11, 0.14)" : "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.32)" };
    return { color: tokens.copper, background: isDark ? "rgba(184, 115, 51, 0.14)" : "rgba(184, 115, 51, 0.08)", border: isDark ? "rgba(184, 115, 51, 0.32)" : "rgba(184, 115, 51, 0.26)" };
  };

  const renderStatusPill = (vm: PreparedOrderViewModel) => {
    const statusTokens = getStatusToneTokens(vm.statusTone);
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", width: "fit-content", border: `1px solid ${statusTokens.border}`, borderRadius: "999px", background: statusTokens.background, color: statusTokens.color, padding: "7px 10px", fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        <span style={{ width: "7px", height: "7px", borderRadius: "999px", background: statusTokens.color }} />
        {vm.statusLabel}
      </span>
    );
  };

  const toggleTheme = () => {
    const next = themeMode === "dark" ? "light" : "dark";
    setThemeMode(next);
    localStorage.setItem("royal_prime_theme", next);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", next);
      document.documentElement.style.backgroundColor = next === "dark" ? "#0B0908" : "#FCFBF7";
      document.documentElement.style.color = next === "dark" ? "#E8E1DE" : "#1A1A1A";
    }
    window.dispatchEvent(new Event("royal_theme_changed"));
  };

  const renderOrderActions = (vm: PreparedOrderViewModel) => (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
      <Button variant="outline" size="sm" isDark={isDark} onClick={() => setSelectedOrderVM(vm)}>
        {strings.history.details}
      </Button>
      {vm.canReview && (
        <Button variant="outline" size="sm" isDark={isDark}>
          {strings.history.review}
        </Button>
      )}
    </div>
  );

  return (
    <div style={{ background: tokens.background, color: tokens.text, minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
      <PortalHeader
        activeTab="meus-pedidos"
        themeMode={themeMode}
        onToggleTheme={toggleTheme}
        onNavigate={onNavigate}
      />

      <style>{`
        @keyframes meusPedidosAppear {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .meus-pedidos-main {
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-top: 24px !important;
            padding-bottom: calc(112px + env(safe-area-inset-bottom)) !important;
          }

          .meus-pedidos-current {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }

          .meus-pedidos-order-body {
            grid-template-columns: 1fr !important;
          }

          .meus-pedidos-history-row {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }

          .meus-pedidos-history-actions {
            align-items: flex-start !important;
            justify-content: flex-start !important;
          }
        }

        @media (max-width: 768px) {
          .portal-header {
            display: none !important;
          }
        }
      `}</style>

      {!isMockAuthenticated ? (
        <main className="meus-pedidos-main" style={{ flex: 1, maxWidth: "920px", width: "100%", margin: "0 auto", padding: "72px 32px 120px", boxSizing: "border-box", animation: "meusPedidosAppear 0.34s ease both", display: "grid", placeItems: "center" }}>
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
      <main className="meus-pedidos-main" style={{ flex: 1, maxWidth: "1440px", width: "100%", margin: "0 auto", padding: "46px 32px 120px", boxSizing: "border-box", animation: "meusPedidosAppear 0.34s ease both" }}>
        <header style={{ marginBottom: "26px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(40px, 6vw, 64px)", lineHeight: 1.05, margin: 0, color: tokens.text }}>
            {strings.title}
          </h1>
          <p style={{ margin: "10px 0 0", color: tokens.textMuted, fontSize: "18px", lineHeight: 1.5, maxWidth: "680px" }}>
            {strings.subtitle}
          </p>
        </header>

        {currentOrderVM && (
          <section className="meus-pedidos-current" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.45fr) minmax(320px, 0.55fr)", gap: "24px", marginBottom: "34px", alignItems: "stretch" }}>
            <Card variant="surface" bordered hoverable={false} isDark={isDark} style={{ padding: "28px", borderRadius: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "20px", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "18px", marginBottom: "22px", flexWrap: "wrap" }}>
                <div>
                  <Badge variant="copper">{strings.currentOrder.badge}</Badge>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "30px", margin: "10px 0 0", color: tokens.text }}>
                    {currentOrderVM.code}
                  </h2>
                  <p style={{ margin: "4px 0 0", color: tokens.textMuted }}>{currentOrderVM.kindLabel} - {currentOrderVM.statusLabel}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ display: "block", color: tokens.textMuted, fontSize: "11px", fontWeight: 800, textTransform: "uppercase" }}>{strings.currentOrder.total}</span>
                  <strong style={{ color: tokens.text, fontSize: "24px" }}>{currentOrderVM.moneyLabel}</strong>
                </div>
              </div>

              <div style={{ display: "grid", gap: "18px" }}>
                <div style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${currentOrderVM.timelineSteps.length}, minmax(92px, 1fr))`, gap: "8px", overflowX: "auto", padding: "8px 2px 4px" }}>
                  <span style={{ position: "absolute", left: "18px", right: "18px", top: "18px", height: "2px", background: tokens.border, opacity: 0.7 }} />
                  {currentOrderVM.timelineSteps.map((step, index) => {
                    const isCurrentStep = currentOrderVM.rawOrder.status === step.status;
                    const color = step.completed ? themeTokens.colors.statusActive : isCurrentStep ? tokens.copper : tokens.border;
                    const bg = step.completed
                      ? themeTokens.colors.statusActive
                      : isCurrentStep
                        ? isDark ? "rgba(184, 115, 51, 0.14)" : "rgba(184, 115, 51, 0.08)"
                        : tokens.surfaceContainer;
                    return (
                      <div key={step.status} style={{ position: "relative", zIndex: 1, minWidth: "92px", display: "grid", justifyItems: "center", gap: "7px", textAlign: "center" }}>
                        {index < currentOrderVM.timelineSteps.length - 1 && step.completed ? (
                          <span style={{ position: "absolute", left: "50%", right: "-50%", top: "10px", height: "2px", background: themeTokens.colors.statusActive }} />
                        ) : null}
                        <span style={{ width: "22px", height: "22px", borderRadius: "999px", border: `1px solid ${color}`, background: bg, display: "grid", placeItems: "center", boxShadow: step.completed || isCurrentStep ? `0 0 0 4px ${isDark ? "rgba(16, 185, 129, 0.12)" : "rgba(16, 185, 129, 0.08)"}` : "none", position: "relative", zIndex: 2 }}>
                          {step.completed ? <CheckIcon size={13} color="#FFFFFF" /> : null}
                        </span>
                        <span style={{ color: step.completed ? themeTokens.colors.statusActive : isCurrentStep ? tokens.copper : tokens.textMuted, fontSize: "10px", fontWeight: step.completed || isCurrentStep ? 900 : 700, lineHeight: 1.2, maxWidth: "92px" }}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="meus-pedidos-order-body" style={{ display: "grid", gridTemplateColumns: "minmax(160px, 0.45fr) minmax(0, 1fr)", gap: "18px" }}>
                  <div style={{ background: tokens.background, border: `1px solid ${tokens.border}`, borderRadius: "10px", padding: "18px", textAlign: "center" }}>
                    <span style={{ display: "block", color: tokens.textMuted, fontSize: "11px", fontWeight: 800, textTransform: "uppercase" }}>{strings.currentOrder.deliveryCode}</span>
                    <strong style={{ display: "block", color: tokens.copper, fontSize: "40px", letterSpacing: "0.12em", marginTop: "8px" }}>{currentOrderVM.deliveryCodeLabel}</strong>
                    <span style={{ color: tokens.textMuted, fontSize: "12px" }}>{strings.currentOrder.deliveryCodeHint}</span>
                  </div>

                  <div>
                    <span style={{ display: "block", color: tokens.text, fontSize: "12px", fontWeight: 900, textTransform: "uppercase", marginBottom: "12px" }}>{strings.currentOrder.items}</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {currentOrderVM.rawOrder.items.map((item) => (
                        <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", gap: "14px", borderBottom: `1px solid ${tokens.border}`, paddingBottom: "10px" }}>
                          <span style={{ color: tokens.text, fontWeight: 700 }}>{item.name}</span>
                          <span style={{ color: tokens.textMuted }}>{item.quantity} - {item.unitLabel}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {currentSubscriptionOrderVM && (
              <Card variant="surface" bordered hoverable={false} isDark={isDark} style={{ borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ minHeight: "190px", backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.62), rgba(0,0,0,.08)), url(${currentSubscriptionOrderVM.rawOrder.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "flex-end", padding: "18px", boxSizing: "border-box" }}>
                  <Badge variant="copper">{strings.nextBox.badge}</Badge>
                </div>
                <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", margin: 0, color: tokens.text }}>{strings.nextBox.title}</h3>
                  <strong style={{ color: tokens.copper }}>{currentSubscriptionOrderVM.rawOrder.delivery.estimateLabel}</strong>
                  <p style={{ color: tokens.textMuted, margin: 0, lineHeight: 1.5 }}>{currentSubscriptionOrderVM.rawOrder.summary}</p>
                  {currentPlan && <p style={{ color: tokens.textMuted, margin: 0, fontSize: "13px" }}>Plano vinculado: Royal {currentPlan.name}</p>}
                </div>
              </Card>
            )}
          </section>
        )}

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", margin: `0 0 18px`, borderBottom: `1px solid ${tokens.border}`, paddingBottom: "14px", color: tokens.text }}>
            {strings.history.title}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {viewModels.map((vm) => (
              <Card key={vm.id} variant="surface" bordered hoverable isDark={isDark} className="meus-pedidos-history-row" style={{ padding: "18px", borderRadius: "10px", display: "grid", gridTemplateColumns: "1.35fr .8fr .9fr .7fr 1.2fr", gap: "16px", alignItems: "center" }}>
                <div>
                  <strong style={{ display: "block", color: vm.rawOrder.kind === "subscriptionCycle" ? tokens.copper : tokens.text }}>{vm.kindLabel}</strong>
                  <span style={{ color: tokens.textMuted, fontSize: "12px" }}>{vm.code} - {vm.rawOrder.title}</span>
                </div>
                <span style={{ color: tokens.text }}>{vm.rawOrder.createdAtLabel}</span>
                {renderStatusPill(vm)}
                <strong style={{ color: tokens.text }}>{vm.moneyLabel}</strong>
                <div className="meus-pedidos-history-actions" style={{ display: "flex", justifyContent: "flex-end" }}>
                  {renderOrderActions(vm)}
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
      )}

      <BottomTabBar activeTab="meus-pedidos" onNavigate={onNavigate} isDark={isDark} />
      <OrderDetailModal
        open={Boolean(selectedOrderVM)}
        onClose={() => setSelectedOrderVM(null)}
        order={selectedOrderVM?.rawOrder || null}
        viewModel={selectedOrderVM}
        isDark={isDark}
        isMobile={isMobileScreen}
      />
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
