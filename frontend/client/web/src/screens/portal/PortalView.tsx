"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppShell } from "@foundation/shells/app-shell";
import { Button } from "@foundation/ui/Button";
import { EmptyState } from "@foundation/ui/EmptyState";
import { MoonIcon, StoreIcon, SunIcon, UserIcon } from "@foundation/ui/Icon/AppIcons";
import { portalNavigation } from "@/navigation/client.navigation";
import { portalAppShellConfig } from "@/manifest/portal/appshell.config";
import { clientRoutes } from "@/manifest/routes";
import { clientPtBR } from "@/locales/pt-BR";
import { AuthModal } from "../../legacy/app-shell";
import styles from "./PortalView.module.css";
import { HomeOrientationView } from "./tabs/HomeOrientationView";
import { CortesView } from "./tabs/CortesView";
import { PedidoView } from "./tabs/PedidoView";
import { MinhaCaixaView } from "./tabs/MinhaCaixaView";
import { MeuClubeView } from "./tabs/MeuClubeView";
import { MinhaContaView } from "./tabs/MinhaContaView";
import { MeusPedidosView } from "./tabs/MeusPedidosView";

export interface PortalViewProps {
  initialTab?: "home" | "cortes" | "produtos" | "minhaCaixa" | "royalDelivery" | "meuClube" | "meusPedidos" | "minhaConta";
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
    if (path === "/cortes" || path === "/portal-cortes") return "cortes";
    if (path === "/produtos" || path === "/montar-box") return "produtos";
    if (path === "/minha-caixa" || path === "/portal-minha-caixa") return "minhaCaixa";
    if (path === "/royal-delivery") return "royalDelivery";
    if (path === "/meu-clube" || path === "/minha-assinatura") return "meuClube";
    if (path === "/meus-pedidos") return "meusPedidos";
    if (path === "/minha-conta" || path === "/portal-minha-conta" || path === "/perfil") return "minhaConta";
    if (path === "/home" || path === "/portal-home") return "home";
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
  const activeThemeColors =
    portalAppShellConfig.theme?.modes?.[themeMode] ||
    portalAppShellConfig.theme?.colors;
  const portalShellConfig = useMemo(() => {
    return {
      ...portalAppShellConfig,
      theme: {
        ...portalAppShellConfig.theme,
        colors: activeThemeColors,
      },
    };
  }, [activeThemeColors]);

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
        return <CortesView isMember={true} onNavigate={handleNavigate} showShell={false} />;
      case "produtos":
        return <PedidoView onNavigate={handleNavigate} showHeader={false} />;
      case "minhaCaixa":
        return <MinhaCaixaView onNavigate={handleNavigate} showShell={false} />;
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
      case "meusPedidos":
        return <MeusPedidosView onNavigate={handleNavigate} showShell={false} />;
      case "minhaConta":
        return <MinhaContaView onNavigate={handleNavigate} showShell={false} />;
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
      const nextThemeColors =
        portalAppShellConfig.theme?.modes?.[next] ||
        portalAppShellConfig.theme?.colors;
      document.documentElement.style.backgroundColor = nextThemeColors.background;
      document.documentElement.style.color = nextThemeColors.text;
    }
    localStorage.setItem("royal_prime_theme", next);
    window.dispatchEvent(new Event("royal_theme_changed"));
  };

  const headerActionButtonStyle = {
    "--ui-surface-bg": "var(--app-shell-surface-bg)",
    "--ui-surface-border": "var(--app-shell-border)",
    "--ui-surface-border-width": "var(--theme--borders-hairline)",
    "--ui-surface-color": "var(--app-shell-color)",
    "--ui-surface-radius": "var(--theme--radius-full)",
    "--ui-button-height": "var(--theme--dimensions-height-lg)",
    "--ui-button-min-width": "var(--theme--dimensions-minWidth-sm)",
    "--ui-button-padding-x": "var(--theme--spacing-spaceSm)",
    "--ui-button-padding-y": "var(--theme--spacing-space2xs)"
  } as React.CSSProperties;
  const profileInitial = clientPtBR.authSession.userName.trim().slice(0, 1).toUpperCase();

  const renderHeaderActions = () => (
    <div className={styles.headerActions}>
      <Button
        appearance="soft"
        tone="neutral"
        size="sm"
        className={styles.themeButton}
        onClick={toggleTheme}
        icon={themeMode === "dark" ? <SunIcon /> : <MoonIcon />}
        style={headerActionButtonStyle}
      >
        {themeMode === "dark" ? clientPtBR.authSession.themeLight : clientPtBR.authSession.themeDark}
      </Button>
      {isMockAuthenticated ? (
        <Button
          appearance="soft"
          tone="neutral"
          size="sm"
          className={styles.profileButton}
          onClick={() => handleNavigate(clientRoutes.minhaConta)}
          style={headerActionButtonStyle}
        >
          <span className={styles.profileContent}>
            <span className={styles.profileAvatar}>
              {profileInitial}
            </span>
            <span className={styles.profileText}>
              <strong className={styles.profileName}>{clientPtBR.authSession.userName}</strong>
              <span className={styles.profileBadge}>
                {clientPtBR.authSession.userBadge}
              </span>
            </span>
          </span>
        </Button>
      ) : (
        <Button appearance="solid" tone="primary" size="sm" onClick={() => setIsAuthModalOpen(true)}>
          {clientPtBR.navigation.entrar}
        </Button>
      )}
    </div>
  );

  return (
    <AppShell
      config={portalShellConfig}
      brandLogo="/assets/brand/royal-prime-logo.jpg"
      navItems={visiblePortalNavigation as any}
      activePath={activeRoutePath}
      onNavigate={handleNavigate}
      rightSlot={renderHeaderActions()}
      routesMap={clientRoutes}
    >
      <div className={styles.portalContent}>
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
