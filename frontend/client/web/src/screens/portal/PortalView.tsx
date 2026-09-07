"use client";

import React from "react";
import { AppShell } from "@foundation/shells/app-shell";
import { Button } from "@foundation/ui/Button";
import { EmptyState } from "@foundation/ui/EmptyState";
import { MoonIcon, StoreIcon, SunIcon, UserIcon } from "@foundation/ui/Icon/AppIcons";
import { clientRoutes } from "@/manifest/routes";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import type { PortalScreenKey } from "@royalprime/client/manifest/portal/routes.config";
import { AuthModal } from "./AuthModal";
import styles from "./PortalView.module.css";
import { HomeVitrineView } from "./tabs/HomeVitrineView";
import { CortesView } from "./tabs/CortesView";
import { PedidoView } from "./tabs/PedidoView";
import { MinhaCaixaView } from "./tabs/MinhaCaixaView";
import { MeuClubeView } from "./tabs/MeuClubeView";
import { MinhaContaView } from "./tabs/MinhaContaView";
import { MeusPedidosView } from "./tabs/MeusPedidosView";
import { usePortalRuntime } from "./usePortalRuntime";

export interface PortalViewProps {
  initialTab?: PortalScreenKey;
}

export const PortalView: React.FC<PortalViewProps> = ({ initialTab = "home" }) => {
  const strings = useClientStrings();
  const {
    activeRoutePath,
    activeScreenKey,
    isAuthModalOpen,
    isMockAuthenticated,
    isProtectedScreen,
    navigate,
    portalShellConfig,
    setIsAuthModalOpen,
    setMockAuthenticatedOverride,
    themeMode,
    toggleTheme,
    visiblePortalNavigation,
  } = usePortalRuntime(initialTab);
  const profileInitial = strings.authSession.userName.trim().slice(0, 1).toUpperCase();
  const isProfileActionActive = activeScreenKey === "minhaConta";

  const renderProtectedGate = () => (
    <EmptyState
      className={styles.portalEmptyState}
      description={strings.authEmptyState.description}
      framed
      icon={<UserIcon size={28} />}
      actions={
        <Button
          appearance="solid"
          className={styles.portalPrimaryAction}
          onClick={() => setIsAuthModalOpen(true)}
          size="md"
          tone="neutral"
        >
          {strings.navigation.entrar}
        </Button>
      }
      size="spacious"
      title={strings.authEmptyState.title}
    />
  );

  const renderActiveScreenType = () => {
    if (isProtectedScreen && !isMockAuthenticated) return renderProtectedGate();

    switch (activeScreenKey) {
      case "cortes":
        return <CortesView />;
      case "produtos":
        return <PedidoView />;
      case "minhaCaixa":
        return <MinhaCaixaView onNavigate={navigate} showShell={false} />;
      case "royalDelivery":
        return (
          <EmptyState
            className={styles.portalEmptyState}
            description={strings.royalDelivery.emptyDescription}
            framed
            icon={<StoreIcon size={28} />}
            actions={
              <Button
                appearance="solid"
                className={styles.portalPrimaryAction}
                onClick={() => navigate(clientRoutes.cortes)}
                size="md"
                tone="neutral"
              >
                {strings.authEmptyState.action}
              </Button>
            }
            size="spacious"
            title={strings.royalDelivery.emptyTitle}
          />
        );
      case "meuClube":
        return <MeuClubeView onNavigate={navigate} />;
      case "meusPedidos":
        return <MeusPedidosView onNavigate={navigate} showShell={false} />;
      case "minhaConta":
        return <MinhaContaView onNavigate={navigate} showShell={false} />;
      case "home":
      default:
        return <HomeVitrineView isAuthenticated={isMockAuthenticated} onNavigate={navigate} />;
    }
  };

  const renderHeaderActions = () => (
    <div className={styles.headerActions}>
      <Button
        appearance="soft"
        className={styles.themeButton}
        icon={themeMode === "dark" ? <SunIcon /> : <MoonIcon />}
        onClick={toggleTheme}
        size="sm"
        tone="neutral"
      >
        {themeMode === "dark" ? strings.authSession.themeLight : strings.authSession.themeDark}
      </Button>
      {isMockAuthenticated ? (
        <Button
          appearance="soft"
          aria-current={isProfileActionActive ? "page" : undefined}
          className={[styles.profileButton, isProfileActionActive ? styles.profileButtonActive : ""].filter(Boolean).join(" ")}
          onClick={() => navigate(clientRoutes.minhaConta)}
          size="sm"
          tone="neutral"
        >
          <span className={styles.profileContent}>
            <span className={styles.profileAvatar}>{profileInitial}</span>
            <span className={styles.profileText}>
              <strong className={styles.profileName}>{strings.authSession.userName}</strong>
              <span className={styles.profileBadge}>{strings.authSession.userBadge}</span>
            </span>
          </span>
        </Button>
      ) : (
        <Button
          appearance="solid"
          className={styles.portalPrimaryAction}
          onClick={() => setIsAuthModalOpen(true)}
          size="sm"
          tone="neutral"
        >
          {strings.navigation.entrar}
        </Button>
      )}
    </div>
  );

  return (
    <AppShell
      activePath={activeRoutePath}
      brandLogo="/assets/brand/royal-prime-logo.jpg"
      config={portalShellConfig}
      navItems={visiblePortalNavigation as any}
      onNavigate={navigate}
      rightSlot={renderHeaderActions()}
      routesMap={clientRoutes}
    >
      <div className={styles.portalContent}>{renderActiveScreenType()}</div>
      <AuthModal
        isDark={themeMode === "dark"}
        onAuthenticated={() => {
          setMockAuthenticatedOverride(true);
          navigate(clientRoutes.home);
        }}
        onClose={() => setIsAuthModalOpen(false)}
        open={isAuthModalOpen}
      />
    </AppShell>
  );
};
