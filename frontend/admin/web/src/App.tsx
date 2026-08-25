import React, { useEffect, useState } from "react";
import { AppShell } from "@foundation/shells/appshell";
import { injectThemeTokens } from "@foundation/tokens/resolver";
import { adminThemeManifest } from "@/manifest/theme.manifest";
import { adminNavigation } from "@/manifest/navigation";
import { adminAppShellConfig } from "@/manifest/adminAppShell.config";
import { adminRoutes, getRoutePathByAction } from "@/manifest/routes";
import { adminPtBR } from "@/manifest/locales/pt-BR";

import { dashboardConfig } from "@/manifest/pages/dashboard.config";
import { cortesConfig } from "@/manifest/pages/cortes.config";
import { caixasConfig } from "@/manifest/pages/caixas.config";
import { sociosConfig } from "@/manifest/pages/socios.config";

import { DashboardPage } from "./engines/rendering/screen-types/dashboard/DashboardPage";
import { ListPage } from "./engines/rendering/screen-types/standard/pages/ListPage";
import { AddPage } from "./engines/rendering/screen-types/standard/pages/AddPage";
import { DetailPage } from "./engines/rendering/screen-types/standard/pages/DetailPage";
import { HistoryPage } from "./engines/rendering/screen-types/history/HistoryPage";
import { TrashPage } from "./engines/rendering/screen-types/trash/TrashPage";
import { SettingsPage } from "./engines/rendering/screen-types/settings/SettingsPage";

export const App: React.FC = () => {
  const [activeScreenKey, setActiveScreenKey] = useState<string>("dashboard");
  const [routeAction, setRouteAction] = useState<"list" | "detail" | "create">("list");
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const activeRoutePath = adminRoutes[activeScreenKey as keyof typeof adminRoutes] || adminRoutes.dashboard;

  useEffect(() => {
    // Injeta automaticamente os tokens do manifesto do Admin no :root do navegador
    injectThemeTokens("admin", adminThemeManifest);

    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.endsWith("/novo")) {
        setRouteAction("create");
      } else if (path.endsWith("/detalhes")) {
        setRouteAction("detail");
      } else {
        setRouteAction("list");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleNavigate = (routePath: string) => {
    setRouteAction("list");
    setSelectedRow(null);

    const foundByPath = adminNavigation.find(
      (item) => item.routeKey && adminRoutes[item.routeKey] === routePath
    );
    if (foundByPath) {
      setActiveScreenKey(foundByPath.key);
      window.history.pushState({}, "", routePath);
      return;
    }

    const foundByKey = adminNavigation.find(
      (item) => item.key === routePath || `/${item.key}` === routePath
    );
    if (foundByKey) {
      setActiveScreenKey(foundByKey.key);
      const targetPath = adminRoutes[foundByKey.routeKey as keyof typeof adminRoutes] || routePath;
      window.history.pushState({}, "", targetPath);
    }
  };

  const handleCreateNew = () => {
    setRouteAction("create");
    const targetPath = getRoutePathByAction(activeScreenKey, "create");
    window.history.pushState({}, "", targetPath);
  };

  const handleSelectRow = (row: any) => {
    setSelectedRow(row);
    setRouteAction("detail");
    const targetPath = getRoutePathByAction(activeScreenKey, "detail");
    window.history.pushState({}, "", targetPath);
  };

  const handleBackToList = () => {
    setRouteAction("list");
    setSelectedRow(null);
    const targetPath = getRoutePathByAction(activeScreenKey, "list");
    window.history.pushState({}, "", targetPath);
  };

  const renderActiveScreenEngine = () => {
    if (activeScreenKey === "dashboard") {
      return <DashboardPage config={dashboardConfig as any} />;
    }

    if (activeScreenKey === "history" || activeScreenKey === "historico") {
      return <HistoryPage />;
    }

    if (activeScreenKey === "trash" || activeScreenKey === "lixeira") {
      return <TrashPage />;
    }

    if (activeScreenKey === "configuracoes") {
      return <SettingsPage />;
    }

    // Resolution para entidades Standard
    let activeConfig: any = null;
    if (activeScreenKey === "cortes") activeConfig = cortesConfig;
    if (activeScreenKey === "caixas") activeConfig = caixasConfig;
    if (activeScreenKey === "socios") activeConfig = sociosConfig;

    if (activeConfig) {
      if (routeAction === "create") {
        return (
          <AddPage
            entityName={activeConfig.entityName}
            formConfig={activeConfig.form}
            onBack={handleBackToList}
            onSubmit={handleBackToList}
          />
        );
      }

      if (routeAction === "detail" && selectedRow) {
        return (
          <DetailPage
            entityName={activeConfig.entityName}
            row={selectedRow}
            onBack={handleBackToList}
            onEdit={handleCreateNew}
          />
        );
      }

      return (
        <ListPage
          entityConfig={activeConfig}
          onCreateRow={handleCreateNew}
          onSelectRow={handleSelectRow}
        />
      );
    }

    return <DashboardPage config={dashboardConfig as any} />;
  };

  return (
    <AppShell
      config={adminAppShellConfig}
      brandName={adminPtBR.brand.name}
      brandLogo="/assets/brand/royal-prime-logo.jpg"
      navItems={adminNavigation as any}
      routesMap={adminRoutes as any}
      activePath={activeRoutePath}
      onNavigate={handleNavigate}
    >
      <div style={{ minHeight: "100vh", background: "var(--theme--color-bg, #080706)" }}>
        {renderActiveScreenEngine()}
      </div>
    </AppShell>
  );
};
