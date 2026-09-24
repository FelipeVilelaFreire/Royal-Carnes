"use client";

import React, { useEffect, useMemo } from "react";
import { AccessShell } from "@foundation/shells/access-shell";
import { AppShell } from "@foundation/shells/app-shell";
import { Button } from "@foundation/ui/web/Button";
import { UserIcon } from "@foundation/ui/web/Icon/AppIcons";
import { clientRoutes } from "@/manifest/routes";
import { useClientPortalAuthSession } from "@royalprime/client/hooks/useClientPortalAuthSession";
import { ClientApiProvider } from "@royalprime/client/runtime/ClientApiProvider";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import type { ApiClientConfig } from "../../../../../shared-core";
import type { PortalScreenKey } from "@royalprime/client/manifest/portal/routes.config";
import { clientPortalAccessShellConfig } from "@/manifest/portal/access-shell.config";
import { clientAuthStorage, readStoredClientSession } from "../../auth/clientAuthStorage";
import styles from "./PortalView.module.css";
import { EmptyStateScreen } from "./feedback/EmptyStateScreen/EmptyStateScreen";
import { HomeView } from "./Home/HomeView";
import { CatalogoTeste1View } from "./Experiments/CatalogoTeste1/CatalogoTeste1View";
import { HomeTeste1View } from "./Experiments/HomeTeste1/HomeTeste1View";
import { HomeTeste2View } from "./Experiments/HomeTeste2/HomeTeste2View";
import { HomeTeste3View } from "./Experiments/HomeTeste3/HomeTeste3View";
import { HomeTeste4View } from "./Experiments/HomeTeste4/HomeTeste4View";
import { HomeTeste5View } from "./Experiments/HomeTeste5/HomeTeste5View";
import { HomeTeste6View } from "./Experiments/HomeTeste6/HomeTeste6View";
import { HomeTeste7View } from "./Experiments/HomeTeste7/HomeTeste7View";
import { HomeTeste8View } from "./Experiments/HomeTeste8/HomeTeste8View";
import { MeusPedidosTeste1View } from "./Experiments/MeusPedidosTeste1/MeusPedidosTeste1View";
import { MeusPedidosTeste2View } from "./Experiments/MeusPedidosTeste2/MeusPedidosTeste2View";
import { MeusPedidosTeste3View } from "./Experiments/MeusPedidosTeste3/MeusPedidosTeste3View";
import { MeusPedidosTeste4View } from "./Experiments/MeusPedidosTeste4/MeusPedidosTeste4View";
import { MeusPedidosTeste5View } from "./Experiments/MeusPedidosTeste5/MeusPedidosTeste5View";
import { LandingTeste1View } from "./Experiments/LandingTeste1/LandingTeste1View";
import { LandingTeste2View } from "./Experiments/LandingTeste2/LandingTeste2View";
import { LandingTeste3View } from "./Experiments/LandingTeste3/LandingTeste3View";
import { LandingTeste4View } from "./Experiments/LandingTeste4/LandingTeste4View";
import { LandingTeste5View } from "./Experiments/LandingTeste5/LandingTeste5View";
import { LibraryView } from "./Library/LibraryView";
import { CatalogoView } from "./Catalogo/CatalogoView/CatalogoView";
import { CheckoutView } from "./Checkout/CheckoutView";
import { PerfilView } from "./Perfil/PerfilView";
import { MeusPedidosView } from "./MeusPedidos/MeusPedidosView";
import { usePortalRuntime } from "./usePortalRuntime";

export interface PortalViewProps {
  initialTab?: PortalScreenKey;
}

const clientApiBaseUrl = String(process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/v1\/?$/, "");

export const PortalView: React.FC<PortalViewProps> = ({ initialTab = "home" }) => {
  const strings = useClientStrings();
  const authApiConfig = useMemo<ApiClientConfig>(
    () => ({
      baseUrl: clientApiBaseUrl || undefined,
      organizationSlug: "royalprime",
    }),
    [],
  );
  const auth = useClientPortalAuthSession({
    apiConfig: authApiConfig,
    deferStoredSession: true,
    storage: clientAuthStorage,
  });
  const apiConfig = useMemo<ApiClientConfig>(
    () => ({
      ...authApiConfig,
      getAccessToken: () => auth.session?.token.accessToken || readStoredClientSession()?.token.accessToken || "",
    }),
    [auth.session, authApiConfig],
  );
  const {
    activeRoutePath,
    activeScreenKey,
    isAuthModalOpen,
    isAuthenticated,
    isProtectedScreen,
    navigate,
    portalShellConfig,
    setIsAuthModalOpen,
    visiblePortalNavigation,
  } = usePortalRuntime(initialTab, auth.isAuthenticated);
  const profileName = auth.session?.user.name || strings.authSession.userName;
  const profileInitial = profileName.trim().slice(0, 1).toUpperCase();
  const isProfileActionActive = activeScreenKey === "minhaConta";
  const isProtectedGate = isProtectedScreen && !isAuthenticated;
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
    providers: strings.accessShell.providers,
    registerHint: strings.accessShell.registerHint,
    switcher: strings.accessShell.switcher,
    tabs: strings.accessShell.tabs,
  };

  useEffect(() => {
    const storedSession = auth.session || readStoredClientSession();
    if (!storedSession) return;

    void auth.loadCurrentSession(storedSession.token.accessToken).catch(() => {
      void auth.logout();
    });
  }, []);

  const renderProtectedGate = () => {
    const content = activeScreenKey === "meusPedidos"
      ? strings.authEmptyState.orders
      : activeScreenKey === "minhaConta"
        ? strings.authEmptyState.profile
        : strings.authEmptyState;

    return <EmptyStateScreen
      description={content.description}
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
      title={content.title}
    />
  };

  const renderActiveScreenType = () => {
    if (isProtectedGate) return renderProtectedGate();

    switch (activeScreenKey) {
      case "homeTeste1":
        return <HomeTeste1View />;
      case "homeTeste2":
        return <HomeTeste2View />;
      case "homeTeste3":
        return <HomeTeste3View />;
      case "homeTeste4":
        return <HomeTeste4View />;
      case "homeTeste5":
        return <HomeTeste5View />;
      case "homeTeste6":
        return <HomeTeste6View />;
      case "homeTeste7":
        return <HomeTeste7View />;
      case "homeTeste8":
        return <HomeTeste8View />;
      case "meusPedidosTeste1":
        return <MeusPedidosTeste1View />;
      case "meusPedidosTeste2":
        return <MeusPedidosTeste2View />;
      case "meusPedidosTeste3":
        return <MeusPedidosTeste3View />;
      case "meusPedidosTeste4":
        return <MeusPedidosTeste4View />;
      case "meusPedidosTeste5":
        return <MeusPedidosTeste5View />;
      case "landingTeste1":
        return <LandingTeste1View />;
      case "landingTeste2":
        return <LandingTeste2View />;
      case "landingTeste3":
        return <LandingTeste3View />;
      case "landingTeste4":
        return <LandingTeste4View />;
      case "landingTeste5":
        return <LandingTeste5View />;
      case "catalogoTeste1":
        return <CatalogoTeste1View />;
      case "library":
        return <LibraryView />;
      case "catalogo":
        return <CatalogoView />;
      case "produtos":
        return (
          <CheckoutView
            isAuthenticated={isAuthenticated}
            onOrderCreated={() => navigate(clientRoutes.meusPedidos)}
            onRequestAccess={() => setIsAuthModalOpen(true)}
          />
        );
      case "meusPedidos":
        return <MeusPedidosView onNavigate={navigate} showShell={false} />;
      case "minhaConta":
        return (
          <PerfilView
            onLogout={async () => {
              await auth.logout();
              navigate(clientRoutes.home);
            }}
            onNavigate={navigate}
            showShell={false}
          />
        );
      case "home":
      default:
        return <HomeView isAuthenticated={isAuthenticated} onNavigate={navigate} />;
    }
  };

  const renderHeaderActions = () => (
    <div className={styles.headerActions}>
      {/* Theme toggle temporarily hidden while the access experience is being refined. */}
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
      config={{
        ...portalShellConfig,
        strings: strings.appShell,
      }}
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
        }}
        strings={accessStrings}
      />
    </AppShell>
    </ClientApiProvider>
  );
};
