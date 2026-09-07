import { useEffect, useMemo, useState } from "react";
import { injectThemeTokens } from "@foundation/tokens/resolver";
import { adminThemeManifest } from "@/manifest/theme.manifest";
import { adminRouteAliases, adminRoutes, getRoutePathByAction } from "@/manifest/routes";

export type AdminRouteAction = "list" | "detail" | "create";

export interface AdminRouteState {
  action: AdminRouteAction;
  screenKey: string;
}

export function resolveAdminRouteState(pathname: string): AdminRouteState {
  const cleanPath = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  let action: AdminRouteAction = "list";
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

const getCurrentPathname = () => {
  if (typeof window === "undefined") return adminRoutes.dashboard;
  return window.location.pathname;
};

export function useAdminRuntime() {
  const [routeState, setRouteState] = useState<AdminRouteState>(() => resolveAdminRouteState(getCurrentPathname()));
  const [selectedRow, setSelectedRow] = useState<any>(null);

  useEffect(() => {
    injectThemeTokens("admin", adminThemeManifest);

    const handlePopState = () => {
      setRouteState(resolveAdminRouteState(getCurrentPathname()));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const activeRoutePath = useMemo(
    () => adminRoutes[routeState.screenKey as keyof typeof adminRoutes] || adminRoutes.dashboard,
    [routeState.screenKey]
  );

  const navigate = (routePath: string) => {
    setRouteState(resolveAdminRouteState(routePath));
    setSelectedRow(null);
    window.history.pushState({}, "", routePath);
  };

  const createNew = () => {
    setRouteState((current) => ({ ...current, action: "create" }));
    window.history.pushState({}, "", getRoutePathByAction(routeState.screenKey, "create"));
  };

  const selectRow = (row: any) => {
    setSelectedRow(row);
    setRouteState((current) => ({ ...current, action: "detail" }));
    window.history.pushState({}, "", getRoutePathByAction(routeState.screenKey, "detail"));
  };

  const backToList = () => {
    setSelectedRow(null);
    setRouteState((current) => ({ ...current, action: "list" }));
    window.history.pushState({}, "", getRoutePathByAction(routeState.screenKey, "list"));
  };

  return {
    activeRoutePath,
    activeScreenKey: routeState.screenKey,
    backToList,
    createNew,
    navigate,
    routeAction: routeState.action,
    selectedRow,
    selectRow,
  };
}
