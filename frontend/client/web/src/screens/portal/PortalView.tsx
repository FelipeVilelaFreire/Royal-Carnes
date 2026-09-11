"use client";

import React, { useEffect, useMemo } from "react";
import { AccessShell } from "@foundation/shells/access-shell";
import { AppShell } from "@foundation/shells/app-shell";
import { Button } from "@foundation/ui/web/Button";
import { EmptyState } from "@foundation/ui/web/EmptyState";
import { MoonIcon, SunIcon, UserIcon } from "@foundation/ui/web/Icon/AppIcons";
import { clientRoutes } from "@/manifest/routes";
import { useClientPortalAuthSession } from "@royalprime/client/hooks/useClientPortalAuthSession";
import { ClientApiProvider } from "@royalprime/client/runtime/ClientApiProvider";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import type { ApiClientConfig } from "../../../../../shared-core";
import type { PortalScreenKey } from "@royalprime/client/manifest/portal/routes.config";
import { clientPortalAccessShellConfig } from "@/manifest/portal/access-shell.config";
import { clientAuthStorage, readStoredClientSession } from "../../auth/clientAuthStorage";
import styles from "./PortalView.module.css";
import { HomeView } from "./Home/HomeView";
import { CortesView } from "./Cortes/CortesView";
import { MontarBoxView } from "./MontarBox/MontarBoxView";
import { PerfilView } from "./Perfil/PerfilView";
import { MeusPedidosView } from "./MeusPedidos/MeusPedidosView";
import { usePortalRuntime } from "./usePortalRuntime";

export interface PortalViewProps {
  initialTab?: PortalScreenKey;
}

const clientApiBaseUrl = String(process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/v1\/?$/, "");

export const PortalView: React.FC<PortalViewProps> = ({ initialTab = "home" }) => {
  const strings = useClientStrings();
  const apiConfig = useMemo<ApiClientConfig>(
    () => ({
      baseUrl: clientApiBaseUrl || undefined,
      getAccessToken: () => readStoredClientSession()?.token.accessToken || "",
      organizationSlug: "royalprime",
    }),
    [],
  );
  const auth = useClientPortalAuthSession({
    apiConfig,
    initialSession: readStoredClientSession(),
    storage: clientAuthStorage,
  });
  const {
    activeRoutePath,
    activeScreenKey,
    isAuthModalOpen,
    isAuthenticated,
    isProtectedScreen,
    navigate,
    portalShellConfig,
    setIsAuthModalOpen,
    themeMode,
    toggleTheme,
    visiblePortalNavigation,
  } = usePortalRuntime(initialTab, auth.isAuthenticated);
  const profileName = auth.session?.user.name || strings.authSession.userName;
  const profileInitial = profileName.trim().slice(0, 1).toUpperCase();
  const isProfileActionActive = activeScreenKey === "minhaConta";
  const accessStrings = {
    callout: {
      badge: strings.accessShell.portal.badge,
      description: strings.accessShell.portal.calloutDescription,
      title: strings.accessShell.portal.calloutTitle,
    },
    close: strings.accessShell.close,
    fields: strings.accessShell.fields,
    flows: strings.accessShell.portal,
    forgotPassword: strings.accessShell.forgotPassword,
    legal: strings.accessShell.legal,
    placeholders: strings.accessShell.placeholders,
    registerHint: strings.accessShell.registerHint,
    tabs: strings.accessShell.tabs,
  };

  useEffect(() => {
    if (!auth.session) return;
    void auth.loadCurrentSession().catch(() => {
      void auth.logout();
    });
  }, []);

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
    if (isProtectedScreen && !isAuthenticated) return renderProtectedGate();

    switch (activeScreenKey) {
      case "cortes":
        return <CortesView />;
      case "produtos":
        return <MontarBoxView isAuthenticated={isAuthenticated} onRequestAccess={() => setIsAuthModalOpen(true)} />;
      case "meusPedidos":
        return <MeusPedidosView onNavigate={navigate} showShell={false} />;
      case "minhaConta":
        return <PerfilView onNavigate={navigate} showShell={false} />;
      case "home":
      default:
        return <HomeView isAuthenticated={isAuthenticated} onNavigate={navigate} />;
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
      {isAuthenticated ? (
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
              <strong className={styles.profileName}>{profileName}</strong>
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
    <ClientApiProvider config={apiConfig}>
    <AppShell
      activePath={activeRoutePath}
      brandLogo="/assets/brand/royal-prime-logo.jpg"
      config={{ ...portalShellConfig, strings: strings.appShell }}
      navItems={visiblePortalNavigation as any}
      onNavigate={navigate}
      rightSlot={renderHeaderActions()}
      routesMap={clientRoutes}
    >
      <div className={styles.portalContent}>{renderActiveScreenType()}</div>
      <AccessShell
        config={clientPortalAccessShellConfig as any}
        errorMessage={auth.error ? strings.accessShell.error : null}
        isLoading={auth.isLoading}
        onClose={() => setIsAuthModalOpen(false)}
        open={isAuthModalOpen}
        onSubmit={async (flow, values) => {
          const email = values.email || "";
          const password = values.password || "";
          if (flow === "register") {
            await auth.register({ email, name: values.name || "", password });
          }
          await auth.login({ email, password });
          setIsAuthModalOpen(false);
          navigate(clientRoutes.home);
        }}
        strings={accessStrings}
      />
    </AppShell>
    </ClientApiProvider>
  );
};
