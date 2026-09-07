import React from "react";
import { AppShell } from "@foundation/shells/app-shell";
import { adminNavigation } from "@/navigation/admin.navigation";
import { adminAppShellConfig } from "@/manifest/adminAppShell.config";
import { adminRoutes } from "@/manifest/routes";
import { adminPtBR } from "@/locales/pt-BR";

import { dashboardConfig } from "@/manifest/pages/dashboard.config";
import { produtosConfig } from "@/manifest/pages/produtos.config";
import { usuariosConfig } from "@/manifest/pages/usuarios.config";
import { assinaturasConfig } from "@/manifest/pages/assinaturas.config";
import { pedidosConfig } from "@/manifest/pages/pedidos.config";
import { deliveriesConfig } from "@/manifest/pages/deliveries.config";
import { settingsConfig } from "@/manifest/pages/settings.config";

import { DashboardPage } from "./engines/rendering/screen-types/dashboard/DashboardPage";
import { ListPage } from "./engines/rendering/screen-types/standard/pages/ListPage";
import { AddPage } from "./engines/rendering/screen-types/standard/pages/AddPage";
import { DetailPage } from "./engines/rendering/screen-types/standard/pages/DetailPage";
import { SettingsPage } from "./engines/rendering/screen-types/settings/SettingsPage";
import styles from "./App.module.css";
import { useAdminRuntime } from "./useAdminRuntime";

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

  const renderActiveScreenEngine = () => {
    // 1. Dashboard (ScreenType: dashboard)
    if (activeScreenKey === "dashboard") {
      return <DashboardPage config={dashboardConfig as any} />;
    }

    // 2. Configurações (ScreenType: settings)
    if (activeScreenKey === "configuracoes" || activeScreenKey === "settings") {
      return <SettingsPage config={settingsConfig} />;
    }

    // 3. Entidades Padrão (ScreenType: standard -> produtos, usuarios, assinaturas, pedidos, deliveries)
    let activeConfig: any = null;
    if (activeScreenKey === "produtos") activeConfig = produtosConfig;
    if (activeScreenKey === "usuarios") activeConfig = usuariosConfig;
    if (activeScreenKey === "assinaturas") activeConfig = assinaturasConfig;
    if (activeScreenKey === "pedidos") activeConfig = pedidosConfig;
    if (activeScreenKey === "deliveries") activeConfig = deliveriesConfig;

    if (activeConfig) {
      if (routeAction === "create") {
        return (
          <AddPage
            entityName={activeConfig.entityName}
            formConfig={activeConfig.form}
            onBack={backToList}
            onSubmit={backToList}
          />
        );
      }

      if (routeAction === "detail" && selectedRow) {
        return (
          <DetailPage
            entityName={activeConfig.entityName}
            row={selectedRow}
            onBack={backToList}
            onEdit={createNew}
          />
        );
      }

      return (
        <ListPage
          entityConfig={activeConfig}
          onCreateRow={createNew}
          onSelectRow={selectRow}
        />
      );
    }

    return <DashboardPage config={dashboardConfig as any} />;
  };

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
