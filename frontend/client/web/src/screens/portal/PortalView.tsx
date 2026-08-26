"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppShell } from "@foundation/shells/appshell";
import { Button } from "@foundation/ui/Button";
import { EmptyState } from "@foundation/ui/EmptyState";
import { MoonIcon, StoreIcon, SunIcon, UserIcon } from "@foundation/ui/Icon/AppIcons";
import { portalNavigation } from "@/navigation/client.navigation";
import { portalAppShellConfig } from "@/manifests/portal/appshell.config";
import { clientRoutes } from "@/manifests/routes";
import { clientPtBR } from "@/locales/pt-BR";
import { AuthModal } from "../../legacy/app-shell";
import { HomeOrientationView } from "./tabs/HomeOrientationView";
import { CortesView } from "./tabs/CortesView";
import { PedidoView } from "./tabs/PedidoView";
import { MinhaCaixaView } from "./tabs/MinhaCaixaView";
import { MeuClubeView } from "./tabs/MeuClubeView";
import { MinhaContaView } from "./tabs/MinhaContaView";

export interface PortalViewProps {
  initialTab?: "home" | "cortes" | "produtos" | "minhaCaixa" | "royalDelivery" | "meuClube" | "minhaConta";
}

export const PortalView: React.FC<PortalViewProps> = ({ initialTab = "home" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [themeMode, setThemeMode] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("royal_prime_theme");
      if (stored === "dark" || stored === "light") return stored;
    }
    return "dark";
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mockAuthenticatedOverride, setMockAuthenticatedOverride] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("royal_prime_mock_authenticated") === "true";
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 768);
    };
    const handleAuthChange = () => {
      setMockAuthenticatedOverride(localStorage.getItem("royal_prime_mock_authenticated") === "true");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("royal_auth_changed", handleAuthChange);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("royal_auth_changed", handleAuthChange);
    };
  }, []);

  const getTabFromPath = (path: string) => {
    if (path === "/cortes") return "cortes";
    if (path === "/produtos") return "produtos";
    if (path === "/minha-caixa") return "minhaCaixa";
    if (path === "/royal-delivery") return "royalDelivery";
    if (path === "/meu-clube" || path === "/minha-assinatura") return "meuClube";
    if (path === "/minha-conta") return "minhaConta";
    if (path === "/home") return "home";
    return "home";
  };

  const [activeScreenKey, setActiveScreenKey] = useState<string>(
    pathname ? getTabFromPath(pathname) : initialTab
  );

  useEffect(() => {
    if (pathname) {
      setActiveScreenKey(getTabFromPath(pathname));
    }
  }, [pathname]);

  const activeRoutePath = clientRoutes[activeScreenKey as keyof typeof clientRoutes] || clientRoutes.home;
  const isMockAuthenticated = isMobileScreen
    ? Boolean(portalAppShellConfig.auth?.mobileMockAuthenticated) || mockAuthenticatedOverride
    : Boolean(portalAppShellConfig.auth?.mockAuthenticated) || mockAuthenticatedOverride;
  const protectedNavKeys = portalAppShellConfig.auth?.protectedNavKeys || [];
  const isProtectedScreen = protectedNavKeys.includes(activeScreenKey);
  const visiblePortalNavigation = isMockAuthenticated
    ? portalNavigation
    : portalNavigation.filter((item) => portalAppShellConfig.auth?.publicNavKeys?.includes(item.key) || item.key === "minhaConta");

  const handleNavigate = (routePath: string) => {
    const found = portalNavigation.find(
      (item) => item.routeKey && clientRoutes[item.routeKey] === routePath
    );
    if (found) {
      setActiveScreenKey(found.key);
    } else {
      setActiveScreenKey(getTabFromPath(routePath));
    }

    if (typeof window !== "undefined" && window.location.pathname !== routePath) {
      router.push(routePath);
    }
  };

  const renderActiveScreenType = () => {
    if (isProtectedScreen && !isMockAuthenticated) {
      return (
        <EmptyState
          title={clientPtBR.authEmptyState.title}
          description={clientPtBR.authEmptyState.description}
          icon={<UserIcon size={28} />}
          actions={
            <Button appearance="solid" tone="primary" size="md" onClick={() => setIsAuthModalOpen(true)}>
              {clientPtBR.navigation.entrar}
            </Button>
          }
          size="spacious"
        />
      );
    }

    switch (activeScreenKey) {
      case "cortes":
        return <CortesView isMember={true} onNavigate={handleNavigate} />;
      case "produtos":
        return <PedidoView onNavigate={handleNavigate} showHeader={false} />;
      case "minhaCaixa":
        return <MinhaCaixaView onNavigate={handleNavigate} />;
      case "royalDelivery":
        return (
          <EmptyState
            title={clientPtBR.royalDelivery.emptyTitle}
            description={clientPtBR.royalDelivery.emptyDescription}
            icon={<StoreIcon size={28} />}
            actions={
              <Button appearance="solid" tone="primary" size="md" onClick={() => handleNavigate(clientRoutes.cortes)}>
                {clientPtBR.authEmptyState.action}
              </Button>
            }
            size="spacious"
          />
        );
      case "meuClube":
        return <MeuClubeView onNavigate={handleNavigate} />;
      case "minhaConta":
        return <MinhaContaView onNavigate={handleNavigate} />;
      case "home":
      default:
        return <HomeOrientationView onNavigate={handleNavigate} showHeader={false} />;
    }
  };

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

  const renderHeaderActions = () => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <Button
        appearance="outline"
        tone="neutral"
        size="sm"
        onClick={toggleTheme}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          {themeMode === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          {themeMode === "dark" ? "Light" : "Dark"}
        </span>
      </Button>
      {isMockAuthenticated ? (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            onClick={() => handleNavigate(clientRoutes.minhaConta)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              minHeight: "42px",
              border: "1px solid var(--theme--color-border, rgba(80, 69, 53, 0.28))",
              borderRadius: "999px",
              background: "var(--theme--color-surfaceContainer, rgba(255, 255, 255, 0.06))",
              color: "var(--theme--color-text, #E8E1DE)",
              padding: "5px 13px 5px 5px",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif"
            }}
          >
            <span
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "999px",
                display: "grid",
                placeItems: "center",
                background: "var(--theme--color-primary, #B87333)",
                color: "#FFFFFF",
                fontWeight: 900,
                fontSize: "13px"
              }}
            >
              F
            </span>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1px", lineHeight: 1 }}>
              <strong style={{ fontSize: "12px" }}>{clientPtBR.authSession.userName}</strong>
              <span style={{ fontSize: "10px", color: "var(--theme--color-textMuted, #A09A92)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {clientPtBR.authSession.userBadge}
              </span>
            </span>
          </button>
        </div>
      ) : (
        <Button appearance="solid" tone="primary" size="sm" onClick={() => setIsAuthModalOpen(true)}>
          {clientPtBR.navigation.entrar}
        </Button>
      )}
    </div>
  );

  return (
    <AppShell
      config={portalAppShellConfig}
      brandName={clientPtBR.brand.name}
      brandLogo="/assets/brand/royal-prime-logo.jpg"
      navItems={visiblePortalNavigation as any}
      activePath={activeRoutePath}
      onNavigate={handleNavigate}
      rightSlot={renderHeaderActions()}
    >
      <div style={{ paddingBottom: "40px" }}>
        {renderActiveScreenType()}
      </div>
      <AuthModal
        open={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={() => {
          setMockAuthenticatedOverride(true);
          handleNavigate(clientRoutes.home);
        }}
        isDark={themeMode === "dark"}
      />
    </AppShell>
  );
};
