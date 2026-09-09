import React, { useEffect, useMemo } from "react";
import { AppShell } from "@foundation/shells/app-shell";
import type { ApiClientConfig } from "@shared-core";
import {
  createAdminAuthApi,
  createAdminDevAuthBypassFetcher,
  readAdminDevAuthBypassAccessToken,
  useAdminDevAuthBypassToken,
  useAdminAuthSession,
} from "@royalprime/admin";
import { adminNavigation } from "@/navigation/admin.navigation";
import { adminAppShellConfig } from "@/manifest/adminAppShell.config";
import { adminRoutes } from "@/manifest/routes";
import { adminPtBR } from "@/locales/pt-BR";

import { dashboardConfig } from "@/manifest/pages/dashboard.config";
import { produtosConfig } from "@/manifest/pages/produtos.config";
import { categoriasConfig } from "@/manifest/pages/categorias.config";
import { colecoesConfig } from "@/manifest/pages/colecoes.config";
import { planosConfig } from "@/manifest/pages/planos.config";
import { assinaturasConfig } from "@/manifest/pages/assinaturas.config";
import { clientesConfig } from "@/manifest/pages/clientes.config";
import { usuariosConfig } from "@/manifest/pages/usuarios.config";
import { pedidosConfig } from "@/manifest/pages/pedidos.config";
import { deliveriesConfig } from "@/manifest/pages/deliveries.config";
import { estoqueConfig } from "@/manifest/pages/estoque.config";
import { pagamentosConfig } from "@/manifest/pages/pagamentos.config";
import { settingsConfig } from "@/manifest/pages/settings.config";

import { DashboardScreen } from "./engines/rendering/screen-types/dashboard/DashboardScreen";
import { StandardScreen } from "./engines/rendering/screen-types/standard/StandardScreen";
import { SettingsPage } from "./engines/rendering/screen-types/settings/SettingsPage";
import { LoginScreen } from "./engines/rendering/screen-types/auth/LoginScreen";
import {
  adminAuthStorage,
  readStoredAdminAccessToken,
  readStoredAdminSession,
} from "./auth/adminAuthStorage";
import styles from "./App.module.css";
import { useAdminRuntime } from "./useAdminRuntime";

const adminAuthBypassEnabled = import.meta.env.VITE_ADMIN_AUTH_DISABLED === "true";
const adminApiBaseUrl = String(import.meta.env.VITE_API_URL || "").replace(/\/api\/v1\/?$/, "");
const localSeedAdminCredentials = {
  email: "admin@royalprime.local",
  password: "RoyalPrime123!",
};
const localDevAuthOptions = {
  baseUrl: adminApiBaseUrl || undefined,
  credentials: localSeedAdminCredentials,
  organizationSlug: "royalprime",
};

export const App: React.FC = () => {
  const {
    activeRoutePath,
    activeScreenKey,
    backToList,
    createNew,
    navigate,
    routeAction,
    selectedRow,
    selectRow,
  } = useAdminRuntime();
  const apiConfig = useMemo<ApiClientConfig>(
    () => ({
      baseUrl: adminApiBaseUrl || undefined,
      fetcher: adminAuthBypassEnabled
        ? createAdminDevAuthBypassFetcher(localDevAuthOptions)
        : undefined,
      getAccessToken: () =>
        adminAuthBypassEnabled ? readAdminDevAuthBypassAccessToken() : readStoredAdminAccessToken(),
      organizationSlug: "royalprime",
    }),
    [],
  );
  const authApi = useMemo(() => createAdminAuthApi(apiConfig), [apiConfig]);
  const auth = useAdminAuthSession({
    api: authApi,
    initialSession: adminAuthBypassEnabled ? null : readStoredAdminSession(),
    storage: adminAuthStorage,
  });
  const devAuth = useAdminDevAuthBypassToken({
    enabled: adminAuthBypassEnabled,
    options: localDevAuthOptions,
  });

  useEffect(() => {
    if (adminAuthBypassEnabled) return;
    if (!auth.session) return;
    void auth.loadCurrentSession().catch(() => {
      void auth.logout();
    });
  }, []);

  const renderActiveScreenEngine = () => {
    // 1. Dashboard (ScreenType: dashboard)
    if (activeScreenKey === "dashboard") {
      return <DashboardScreen apiConfig={apiConfig} config={dashboardConfig as any} onNavigate={navigate} />;
    }

    // 2. Configurações (ScreenType: settings)
    if (activeScreenKey === "configuracoes" || activeScreenKey === "settings") {
      return <SettingsPage config={settingsConfig} />;
    }

    // 3. Entidades Padrão (ScreenType: standard -> produtos, usuarios, assinaturas, pedidos, deliveries)
    let activeConfig: any = null;
    if (activeScreenKey === "pedidos") activeConfig = pedidosConfig;
    if (activeScreenKey === "deliveries") activeConfig = deliveriesConfig;
    if (activeScreenKey === "estoque") activeConfig = estoqueConfig;
    if (activeScreenKey === "produtos") activeConfig = produtosConfig;
    if (activeScreenKey === "categorias") activeConfig = categoriasConfig;
    if (activeScreenKey === "colecoes") activeConfig = colecoesConfig;
    if (activeScreenKey === "planos") activeConfig = planosConfig;
    if (activeScreenKey === "assinaturas") activeConfig = assinaturasConfig;
    if (activeScreenKey === "clientes") activeConfig = clientesConfig;
    if (activeScreenKey === "pagamentos") activeConfig = pagamentosConfig;
    if (activeScreenKey === "usuarios") activeConfig = usuariosConfig;

    if (activeConfig) {
      return (
        <StandardScreen
          apiConfig={apiConfig}
          entityConfig={activeConfig}
          onBackToList={backToList}
          onCreateRow={createNew}
          onEditRow={createNew}
          onSelectRow={selectRow}
          onSubmit={backToList}
          routeAction={routeAction}
          selectedRow={selectedRow}
        />
      );
    }

    return <DashboardScreen apiConfig={apiConfig} config={dashboardConfig as any} onNavigate={navigate} />;
  };

  if (!adminAuthBypassEnabled && !auth.isAuthenticated) {
    return (
      <AppShell
        mode="admin"
        config={adminAppShellConfig}
        brandName={adminPtBR.brand.name}
        brandLogo="/assets/brand/royal-prime-logo.jpg"
        navItems={[]}
        routesMap={adminRoutes as any}
        activePath={activeRoutePath}
        onNavigate={navigate}
      >
        <div className={styles.adminContent}>
          <LoginScreen
            errorMessage={auth.error ? adminPtBR.auth.invalid : null}
            isLoading={auth.isLoading}
            onLogin={auth.login}
          />
        </div>
      </AppShell>
    );
  }

  if (adminAuthBypassEnabled && devAuth.isLoading) {
    return (
      <AppShell
        mode="admin"
        config={adminAppShellConfig}
        brandName={adminPtBR.brand.name}
        brandLogo="/assets/brand/royal-prime-logo.jpg"
        navItems={adminNavigation as any}
        routesMap={adminRoutes as any}
        activePath={activeRoutePath}
        onNavigate={navigate}
      >
        <div className={styles.adminContent}>
          <div className={styles.loadingState}>{adminPtBR.standard.loading}</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      mode="admin"
      config={adminAppShellConfig}
      brandName={adminPtBR.brand.name}
      brandLogo="/assets/brand/royal-prime-logo.jpg"
      navItems={adminNavigation as any}
      routesMap={adminRoutes as any}
      activePath={activeRoutePath}
      onNavigate={navigate}
    >
      <div className={styles.adminContent}>{renderActiveScreenEngine()}</div>
    </AppShell>
  );
};
