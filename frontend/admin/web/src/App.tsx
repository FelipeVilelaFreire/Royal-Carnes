import React, { useEffect, useMemo } from "react";
import { AccessShell } from "@foundation/shells/access-shell";
import { AppShell } from "@foundation/shells/app-shell";
import type { ApiClientConfig } from "@shared-core";
import {
  createAdminAuthApi,
  createAdminDevAuthBypassFetcher,
  readAdminDevAuthBypassAccessToken,
  useAdminAuthSession,
  useAdminDevAuthBypassToken,
} from "@royalprime/admin";
import { adminAccessShellConfig } from "@/manifest/access-shell.config";
import { adminAppShellConfig } from "@/manifest/adminAppShell.config";
import { adminPtBR } from "@/locales/pt-BR";
import { adminRoutes } from "@/manifest/routes";
import { adminNavigation } from "@/navigation/admin.navigation";
import {
  adminAuthStorage,
  readStoredAdminAccessToken,
  readStoredAdminSession,
} from "./auth/adminAuthStorage";
import styles from "./App.module.css";
import { renderAdminScreen } from "./engines/rendering/screenRegistry";
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

  const activeScreen = renderAdminScreen({
    activeScreenKey,
    apiConfig,
    backToList,
    createNew,
    navigate,
    routeAction,
    selectedRow,
    selectRow,
  });

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
          <AccessShell
            config={adminAccessShellConfig as any}
            errorMessage={auth.error ? adminPtBR.auth.invalid : null}
            isLoading={auth.isLoading}
            onSubmit={(_flow, values) =>
              auth.login({
                email: values.email || "",
                password: values.password || "",
              })
            }
            strings={adminPtBR.accessShell}
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
      <div className={styles.adminContent}>{activeScreen}</div>
    </AppShell>
  );
};
