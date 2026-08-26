import React, { useEffect, useState } from "react";
import { AppShell } from "@foundation/shells/appshell";
import { injectThemeTokens } from "@foundation/tokens/resolver";
import { adminThemeManifest } from "@/manifests/theme.manifest";
import { adminNavigation } from "@/navigation/admin.navigation";
import { adminAppShellConfig } from "@/manifests/adminAppShell.config";
import { adminRoutes, adminRouteAliases, getRoutePathByAction } from "@/manifests/routes";
import { adminPtBR } from "@/locales/pt-BR";

import { dashboardConfig } from "@/manifests/pages/dashboard.config";
import { produtosConfig } from "@/manifests/pages/produtos.config";
import { usuariosConfig } from "@/manifests/pages/usuarios.config";
import { assinaturasConfig } from "@/manifests/pages/assinaturas.config";
import { pedidosConfig } from "@/manifests/pages/pedidos.config";
import { deliveriesConfig } from "@/manifests/pages/deliveries.config";
import { settingsConfig } from "@/manifests/pages/settings.config";

import { DashboardPage } from "./engines/rendering/screen-types/dashboard/DashboardPage";
import { ListPage } from "./engines/rendering/screen-types/standard/pages/ListPage";
import { AddPage } from "./engines/rendering/screen-types/standard/pages/AddPage";
import { DetailPage } from "./engines/rendering/screen-types/standard/pages/DetailPage";
import { SettingsPage } from "./engines/rendering/screen-types/settings/SettingsPage";

function resolveScreenKeyFromPath(pathname: string): { screenKey: string; action: "list" | "detail" | "create" } {
  const cleanPath = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  
  let action: "list" | "detail" | "create" = "list";
  let basePath = cleanPath;

  if (cleanPath.endsWith("/novo")) {
    action = "create";
    basePath = cleanPath.replace(/\/novo$/, "");
  } else if (cleanPath.endsWith("/detalhes")) {
    action = "detail";
    basePath = cleanPath.replace(/\/detalhes$/, "");
  }

  if (adminRouteAliases[basePath]) {
    return { screenKey: adminRouteAliases[basePath], action };
  }

  for (const [alias, screenKey] of Object.entries(adminRouteAliases)) {
    if (alias !== "/" && basePath.startsWith(alias)) {
      return { screenKey, action };
    }
  }

  return { screenKey: "dashboard", action };
}

export const App: React.FC = () => {
  const initialResolved = resolveScreenKeyFromPath(window.location.pathname);
  const [activeScreenKey, setActiveScreenKey] = useState<string>(initialResolved.screenKey);
  const [routeAction, setRouteAction] = useState<"list" | "detail" | "create">(initialResolved.action);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const activeRoutePath = adminRoutes[activeScreenKey as keyof typeof adminRoutes] || adminRoutes.dashboard;

  useEffect(() => {
    // Injeta automaticamente os tokens do manifesto do Admin no :root do navegador
    injectThemeTokens("admin", adminThemeManifest);

    const handlePopState = () => {
      const resolved = resolveScreenKeyFromPath(window.location.pathname);
      setActiveScreenKey(resolved.screenKey);
      setRouteAction(resolved.action);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleNavigate = (routePath: string) => {
    const resolved = resolveScreenKeyFromPath(routePath);
    setActiveScreenKey(resolved.screenKey);
    setRouteAction(resolved.action);
    setSelectedRow(null);
    window.history.pushState({}, "", routePath);
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
      mode="admin"
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
