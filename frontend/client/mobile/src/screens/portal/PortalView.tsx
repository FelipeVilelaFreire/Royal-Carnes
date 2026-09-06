import React, { useState } from "react";
import type { NativeAppShellHostComponents } from "../../../../../foundation/shells/app-shell/native";
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
  hosts: NativeAppShellHostComponents;
  initialTab?: "cortes" | "home" | "meusPedidos" | "minhaConta" | "produtos";
  themeMode?: AppThemeMode;
}

export const PortalView: React.FC<PortalViewProps> = ({
  hosts,
  initialTab = "home",
  themeMode = "dark",
}) => {
  const [activeScreenKey, setActiveScreenKey] = useState(initialTab);
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
    <AppShell
      activePath={activePath}
      config={createMobileAppShellConfig(themeMode) as any}
      hosts={hosts}
      mode="client"
      navItems={portalNavigation as any}
      onNavigate={(path, item) => {
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
      {activeScreenKey === "cortes" ? (
        <CortesView activePath={activePath} themeMode={themeMode} />
      ) : activeScreenKey === "produtos" ? (
        <PedidoView activePath={activePath} themeMode={themeMode} />
      ) : activeScreenKey === "meusPedidos" ? (
        <MeusPedidosView activePath={activePath} themeMode={themeMode} />
      ) : activeScreenKey === "minhaConta" ? (
        <MinhaContaView activePath={activePath} themeMode={themeMode} />
      ) : (
        <HomeView activePath={activePath} themeMode={themeMode} />
      )}
    </AppShell>
  );
};
