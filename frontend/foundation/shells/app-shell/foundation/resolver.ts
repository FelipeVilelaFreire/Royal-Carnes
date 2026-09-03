import { themeColorsDefault, themeSpacingDefault } from "../../../tokens/theme.tokens";
import type {
  AppShellBrand,
  AppShellConfig,
  AppShellMode,
  AppShellNavigationItem,
  AppShellPlacement,
  ResolvedAppShellModel,
  ResolvedAppShellNavigationItem,
} from "./types";

export interface ResolveAppShellModelInput {
  activePath?: string;
  brand?: AppShellBrand;
  brandLogo?: string;
  brandName?: string;
  config?: AppShellConfig;
  isSidebarCollapsed?: boolean;
  mode?: AppShellMode | string;
  navItems?: AppShellNavigationItem[];
  navigation?: AppShellNavigationItem[];
  routesMap?: Record<string, string>;
}

const fallbackTheme = (mode: AppShellMode) => mode === "admin" ? themeColorsDefault.admin : themeColorsDefault.dark;

const tokenSpacing = (token: string | undefined, fallback: string) => {
  if (!token) return fallback;
  return (themeSpacingDefault as any)[token] || fallback;
};

export const resolveAppShellPlacement = (item: AppShellNavigationItem, placement: AppShellPlacement) => {
  const placements = item.placements;
  if (!placements) return true;
  if (placement === "bottomTabBar" && placements.bottomBar !== undefined) return Boolean(placements.bottomBar);
  return placements[placement] !== false;
};

export const resolveAppShellRoutePath = (item: AppShellNavigationItem, routesMap?: Record<string, string>) => {
  if (item.routePath) return item.routePath;
  if (item.path) return item.path;
  if (item.routeKey && routesMap?.[item.routeKey]) return routesMap[item.routeKey];
  if (item.type === "scroll" && item.targetId) return `#${item.targetId}`;
  return item.key === "dashboard" ? "/" : `/${item.key}`;
};

export const resolveAppShellNavigation = (
  items: AppShellNavigationItem[] = [],
  routesMap?: Record<string, string>
): ResolvedAppShellNavigationItem[] => {
  return [...items]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item) => ({
      ...item,
      label: item.label || item.labelKey || item.key,
      routePath: resolveAppShellRoutePath(item, routesMap),
    }));
};

export const resolveAppShellModel = ({
  activePath = "/",
  brand,
  brandLogo,
  brandName,
  config,
  isSidebarCollapsed = false,
  mode,
  navItems,
  navigation,
  routesMap,
}: ResolveAppShellModelInput): ResolvedAppShellModel => {
  const effectiveMode = (mode || config?.mode || "client") as AppShellMode;
  const themeColors = (config?.theme?.colors || fallbackTheme(effectiveMode)) as Record<string, string>;
  const resolvedNavigation = resolveAppShellNavigation(navigation || navItems || [], routesMap);
  const sidebarEnabled = Boolean(config?.sidebar?.enabled) || effectiveMode === "admin";
  const headerEnabled = config?.header?.enabled !== false;
  const footerEnabled = Boolean(config?.footer?.enabled);
  const bottomTabEnabled = config?.bottomTabBar?.enabled !== false;
  const headerLayout = config?.header?.layoutMode || "attached";
  const sidebarCols = (isSidebarCollapsed ? config?.sidebar?.collapsedCols : config?.sidebar?.expandedCols) || (isSidebarCollapsed ? 1 : 3);
  const sidebarWidth = `${(sidebarCols / 20) * 100}%`;

  return {
    activePath,
    bottomItems: resolvedNavigation.filter((item) => resolveAppShellPlacement(item, "bottomTabBar")),
    bottomTabEnabled,
    brand: {
      name: brand?.name || brandName || config?.header?.brandName || config?.sidebar?.brandName || "App",
      logo: brand?.logo || brandLogo || config?.header?.brandLogo || config?.sidebar?.brandLogo || "",
      kicker: brand?.kicker || config?.header?.brandKicker || "",
      routePath: brand?.routePath || config?.header?.brandRoutePath || "/",
    },
    contentOffsetBottom: bottomTabEnabled ? config?.bottomTabBar?.contentOffsetBottom || "76px" : "0px",
    contentOffsetTop: headerEnabled ? config?.header?.contentOffsetTop || "76px" : "0px",
    cssVars: {
      "--app-shell-accent": themeColors.primary || themeColors.accent || "#B87333",
      "--app-shell-active-bg": themeColors.activeBg || "rgba(255, 198, 101, 0.12)",
      "--app-shell-background": themeColors.background || themeColors.bg || "#080706",
      "--app-shell-border": themeColors.border || "rgba(255,255,255,0.14)",
      "--app-shell-brand-bg": config?.header?.brandSurface === "none" ? "transparent" : themeColors.surfaceContainer || themeColors.surface || "transparent",
      "--app-shell-brand-border": config?.header?.brandSurface === "none" ? "transparent" : themeColors.border || "transparent",
      "--app-shell-color": themeColors.text || "#ffffff",
      "--app-shell-gap": tokenSpacing(config?.header?.gapLateralToken, "12px"),
      "--app-shell-header-bg": config?.header?.surfaceStyle === "glassBlur" ? themeColors.headerBg || "rgba(15, 15, 15, 0.88)" : themeColors.surface || "transparent",
      "--app-shell-header-padding-x": tokenSpacing(config?.header?.paddingXToken, "24px"),
      "--app-shell-header-padding-y": tokenSpacing(config?.header?.paddingYToken, "12px"),
      "--app-shell-muted": themeColors.textMuted || "rgba(255,255,255,0.68)",
      "--app-shell-nav-gap": tokenSpacing(config?.header?.navGapToken, "28px"),
      "--app-shell-panel-bg": themeColors.surfaceContainer || themeColors.surface || "#111111",
      "--app-shell-sidebar-width": sidebarWidth,
      "--app-shell-surface-bg": themeColors.surface || "rgba(255,255,255,0.06)",
    },
    drawerItems: resolvedNavigation.filter((item) => resolveAppShellPlacement(item, "drawer")),
    effectiveMode,
    footerEnabled,
    footerItems: resolvedNavigation.filter((item) => resolveAppShellPlacement(item, "footer")),
    headerEnabled,
    headerItems: resolvedNavigation.filter((item) => resolveAppShellPlacement(item, "header") && !item.hideInHeader),
    isFloatingHeader: headerLayout === "floating",
    nativeTabItems: resolvedNavigation.filter((item) => resolveAppShellPlacement(item, "nativeTabBar")),
    sidebarEnabled,
    sidebarItems: resolvedNavigation.filter((item) => resolveAppShellPlacement(item, "sidebar")),
    sidebarWidth,
    strings: config?.strings || {},
    themeColors,
  };
};
