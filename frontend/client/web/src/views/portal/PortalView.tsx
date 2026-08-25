"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppShell } from "@foundation/shells/appshell";
import { Button } from "@foundation/ui/Button";
import { EmptyState } from "@foundation/ui/EmptyState";
import { MoonIcon, StoreIcon, SunIcon, UserIcon } from "@foundation/ui/Icon/AppIcons";
import { portalNavigation } from "@/manifest/navigation";
import { portalAppShellConfig } from "@/manifest/portal/appshell.config";
import { clientRoutes } from "@/manifest/routes";
import { clientPtBR } from "@/manifest/locales/pt-BR";
import { HomeView } from "./tabs/HomeView";
import { CortesView } from "./tabs/CortesView";
import { MinhaCaixaView } from "./tabs/MinhaCaixaView";
import { MeuClubeView } from "./tabs/MeuClubeView";

export interface PortalViewProps {
  initialTab?: "home" | "cortes" | "produtos" | "minhaCaixa" | "royalDelivery" | "meuClube";
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getTabFromPath = (path: string) => {
    if (path === "/cortes") return "cortes";
    if (path === "/produtos") return "produtos";
    if (path === "/minha-caixa") return "minhaCaixa";
    if (path === "/royal-delivery") return "royalDelivery";
    if (path === "/meu-clube" || path === "/minha-assinatura") return "meuClube";
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
    ? Boolean(portalAppShellConfig.auth?.mobileMockAuthenticated)
    : Boolean(portalAppShellConfig.auth?.mockAuthenticated);
  const protectedNavKeys = portalAppShellConfig.auth?.protectedNavKeys || [];
  const isProtectedScreen = protectedNavKeys.includes(activeScreenKey);

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
            <Button appearance="solid" tone="primary" size="md" onClick={() => handleNavigate(clientRoutes.cortes)}>
              {clientPtBR.authEmptyState.action}
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
        return <MinhaCaixaView onNavigate={handleNavigate} />;
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
      case "home":
      default:
        return <HomeView onNavigate={handleNavigate} />;
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
      <Button appearance="solid" tone="primary" size="sm" onClick={() => undefined}>
        {clientPtBR.navigation.entrar}
      </Button>
    </div>
  );

  return (
    <AppShell
      config={portalAppShellConfig}
      brandName={clientPtBR.brand.name}
      brandLogo="/assets/brand/royal-prime-logo.jpg"
      navItems={portalNavigation as any}
      activePath={activeRoutePath}
      onNavigate={handleNavigate}
      rightSlot={renderHeaderActions()}
    >
      <div style={{ paddingBottom: "40px" }}>
        {renderActiveScreenType()}
      </div>
    </AppShell>
  );
};
