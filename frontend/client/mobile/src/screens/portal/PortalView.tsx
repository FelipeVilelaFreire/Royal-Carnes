import React, { useEffect, useMemo, useState } from "react";
import type { NativeAppShellHostComponents } from "../../../../../foundation/shells/app-shell/native";
import { NativeAccessShell } from "../../../../../foundation/shells/access-shell";
import type { ApiClientConfig } from "../../../../../shared-core";
import { useClientPortalAuthSession } from "../../../../shared-core";
import { ClientApiProvider } from "../../../../shared-core/runtime/ClientApiProvider";
import type { ClientAuthStorage } from "../../../../shared-core/types/auth.types";
import { clientPortalAccessShellConfig } from "../../../../shared-core/manifest/portal/access-shell.config";
import type { useClientStrings } from "../../../../shared-core/hooks/useClientStrings";
import { clientRoutes } from "../../../../shared-core/manifest/routes";
import { portalNavigation } from "../../../../shared-core/navigation/client.navigation";
import { AppShell } from "../../shell";
import { createMobileAppShellConfig, type AppThemeMode } from "../../shell/AppShell/config";
import { CortesView } from "./tabs/CortesView";
import { HomeView } from "./tabs/HomeView";
import { MinhaContaView } from "./tabs/MinhaContaView";
import { MeusPedidosView } from "./tabs/MeusPedidosView";
import { PedidoView } from "./tabs/PedidoView";

export interface PortalViewProps {
  authApiConfig?: ApiClientConfig;
  authStorage?: ClientAuthStorage;
  hosts: NativeAppShellHostComponents;
  initialTab?: "cortes" | "home" | "meusPedidos" | "minhaConta" | "produtos";
  strings: ReturnType<typeof useClientStrings>;
  themeMode?: AppThemeMode;
}

export const PortalView: React.FC<PortalViewProps> = ({
  authApiConfig,
  authStorage,
  hosts,
  initialTab = "home",
  strings,
  themeMode = "dark",
}) => {
  const [activeScreenKey, setActiveScreenKey] = useState(initialTab);
  const [isAccessOpen, setIsAccessOpen] = useState(false);
  const apiConfig = useMemo(() => authApiConfig || {}, [authApiConfig]);
  const auth = useClientPortalAuthSession({ apiConfig, storage: authStorage });

  useEffect(() => {
    if (!auth.session) return;
    void auth.loadCurrentSession().catch(() => {
      void auth.logout();
    });
  }, []);
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
  const activePath =
    activeScreenKey === "cortes"
      ? clientRoutes.cortes
      : activeScreenKey === "produtos"
        ? clientRoutes.produtos
        : activeScreenKey === "meusPedidos"
          ? clientRoutes.meusPedidos
          : activeScreenKey === "minhaConta"
              ? clientRoutes.minhaConta
              : clientRoutes.home;

  return (
    <ClientApiProvider config={apiConfig}>
    <AppShell
      activePath={activePath}
      config={createMobileAppShellConfig(themeMode) as any}
      hosts={hosts}
      mode="client"
      navItems={portalNavigation as any}
      onNavigate={(path, item) => {
        if (item.auth === "required" && !auth.isAuthenticated) {
          setIsAccessOpen(true);
          return;
        }
        setActiveScreenKey(
          item.key === "cortes"
            ? "cortes"
            : item.key === "produtos"
              ? "produtos"
              : item.key === "meusPedidos"
                ? "meusPedidos"
                : item.key === "minhaConta"
                    ? "minhaConta"
                    : "home"
        );
      }}
      routesMap={clientRoutes}
      themeMode={themeMode}
    >
      {isAccessOpen ? (
        <NativeAccessShell
          config={clientPortalAccessShellConfig as any}
          errorMessage={auth.error ? strings.accessShell.error : null}
          hosts={hosts}
          isLoading={auth.isLoading}
          onClose={() => setIsAccessOpen(false)}
          onSubmit={async (flow, values) => {
            const email = values.email || "";
            const password = values.password || "";
            if (flow === "register") {
              await auth.register({ email, name: values.name || "", password });
            }
            await auth.login({ email, password });
            setIsAccessOpen(false);
          }}
          strings={accessStrings}
          themeMode={themeMode}
        />
      ) : activeScreenKey === "cortes" ? (
        <CortesView strings={strings} />
      ) : activeScreenKey === "produtos" ? (
        <PedidoView
          activePath={activePath}
          isAuthenticated={auth.isAuthenticated}
          strings={strings}
          themeMode={themeMode}
        />
      ) : activeScreenKey === "meusPedidos" ? (
        <MeusPedidosView activePath={activePath} themeMode={themeMode} />
      ) : activeScreenKey === "minhaConta" ? (
        <MinhaContaView activePath={activePath} strings={strings} themeMode={themeMode} />
      ) : (
        <HomeView activePath={activePath} themeMode={themeMode} />
      )}
    </AppShell>
    </ClientApiProvider>
  );
};
