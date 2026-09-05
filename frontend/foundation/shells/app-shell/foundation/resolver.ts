import { themeColorsDefault } from "../../../tokens/theme.tokens";
import type {
  AppShellBrand,
  AppShellConfig,
  AppShellLayoutRegion,
  AppShellLayoutViewport,
  AppShellMode,
  AppShellNavigationGroup,
  AppShellNavigationPlacementRule,
  AppShellNavigationItem,
  AppShellPlacement,
  ResolvedAppShellNavigationGroup,
  ResolvedAppShellModel,
  ResolvedAppShellNavigationItem,
} from "./types";

export interface ResolveAppShellModelInput {
  activePath?: string;
  brand?: AppShellBrand;
  brandLogo?: string;
  brandName?: string;
  config?: AppShellConfig;
  isMobileScreen?: boolean;
  isSidebarCollapsed?: boolean;
  mode?: AppShellMode | string;
  navItems?: AppShellNavigationItem[];
  navigation?: AppShellNavigationItem[];
  routesMap?: Record<string, string>;
}

const fallbackTheme = (mode: AppShellMode) => mode === "admin" ? themeColorsDefault.admin : themeColorsDefault.dark;

const normalizeToken = (scale: string, token: string) => {
  if (scale !== "spacing") return token;
  if (token === "2xs") return "space2xs";
  if (token === "xs") return "spaceXs";
  if (token === "sm") return "spaceSm";
  if (token === "md") return "spaceMd";
  if (token === "lg") return "spaceLg";
  if (token === "xl") return "spaceXl";
  if (token === "2xl") return "space2xl";
  if (token === "3xl") return "space3xl";
  return token;
};

const tokenVar = (scale: string, token: string | undefined, fallbackToken: string) => {
  const resolvedToken = token || fallbackToken;
  return `var(--theme--${scale}-${normalizeToken(scale, resolvedToken)})`;
};

const resolveStringPath = (source: Record<string, any> | undefined, path: string | undefined) => {
  if (!source || !path) return undefined;
  return path.split(".").reduce<any>((value, segment) => value?.[segment], source);
};

const defaultLayoutRegion = (overrides?: AppShellLayoutRegion): AppShellLayoutRegion => ({
  align: "between",
  gutter: "none",
  width: "full",
  ...overrides,
});

const defaultViewportLayout = (viewport: AppShellLayoutViewport) => ({
  bottomTabBar: defaultLayoutRegion({ gutter: viewport === "desktop" ? "none" : "page", width: "full" }),
  content: defaultLayoutRegion({ gutter: "none", width: "full" }),
  drawer: defaultLayoutRegion({ gutter: "none", width: "full" }),
  footer: defaultLayoutRegion({ gutter: "page", width: "wide" }),
  header: defaultLayoutRegion({ gutter: "none", width: "full" }),
});

export const resolveAppShellViewportLayout = (
  config: AppShellConfig | undefined,
  viewport: AppShellLayoutViewport,
  visited: AppShellLayoutViewport[] = []
) => {
  const viewportConfig = config?.layout?.viewports?.[viewport];
  const inheritedViewport = viewportConfig?.inheritFrom as AppShellLayoutViewport | undefined;
  const base = inheritedViewport && !visited.includes(inheritedViewport)
    ? resolveAppShellViewportLayout(config, inheritedViewport, [...visited, viewport])
    : defaultViewportLayout(viewport);

  return {
    bottomTabBar: defaultLayoutRegion({ ...base.bottomTabBar, ...viewportConfig?.bottomTabBar }),
    content: defaultLayoutRegion({ ...base.content, ...viewportConfig?.content }),
    drawer: defaultLayoutRegion({ ...base.drawer, ...viewportConfig?.drawer }),
    footer: defaultLayoutRegion({ ...base.footer, ...viewportConfig?.footer }),
    header: defaultLayoutRegion({ ...base.header, ...viewportConfig?.header }),
    inheritFrom: viewportConfig?.inheritFrom,
  };
};

const resolveLegacyPlacementValue = (item: AppShellNavigationItem, placement: AppShellPlacement) => {
  const placements = item.placements;
  if (!placements) return undefined;
  if (placement === "bottomTabBar" && placements.bottomBar !== undefined) return Boolean(placements.bottomBar);
  return placements[placement];
};

const matchesPlacementRule = (item: AppShellNavigationItem, rule: AppShellNavigationPlacementRule) => {
  const includeKeys = rule.keys || [];
  const includeRouteKeys = rule.routeKeys || [];
  const excludeKeys = rule.excludeKeys || [];
  const excludeRouteKeys = rule.excludeRouteKeys || [];

  if (excludeKeys.includes(item.key)) return false;
  if (item.routeKey && excludeRouteKeys.includes(item.routeKey)) return false;
  if (includeKeys.length === 0 && includeRouteKeys.length === 0) return rule.enabled !== false;

  return includeKeys.includes(item.key) || Boolean(item.routeKey && includeRouteKeys.includes(item.routeKey));
};

const appShellPlacements: AppShellPlacement[] = ["header", "sidebar", "drawer", "bottomTabBar", "nativeTabBar", "footer"];

const resolveInheritedPlacement = (placement: string | undefined) => {
  return appShellPlacements.includes(placement as AppShellPlacement) ? placement as AppShellPlacement : undefined;
};

export const resolveAppShellPlacement = (
  item: AppShellNavigationItem,
  placement: AppShellPlacement,
  config?: AppShellConfig,
  visited: AppShellPlacement[] = []
) => {
  const explicitPlacement = resolveLegacyPlacementValue(item, placement);
  if (explicitPlacement === false) return false;

  const rule = config?.navigationPlacements?.[placement];
  if (rule?.enabled === false) return false;
  const inheritedPlacement = resolveInheritedPlacement(rule?.inheritFrom);
  if (inheritedPlacement && !visited.includes(inheritedPlacement)) {
    const inherited = resolveAppShellPlacement(item, inheritedPlacement, config, [...visited, placement]);
    return explicitPlacement === true || inherited;
  }
  if (rule) return explicitPlacement === true || matchesPlacementRule(item, rule);
  if (explicitPlacement !== undefined) return Boolean(explicitPlacement);
  return true;
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
  routesMap?: Record<string, string>,
  strings?: Record<string, any>
): ResolvedAppShellNavigationItem[] => {
  return [...items]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item) => ({
      ...item,
      label: item.label || resolveStringPath(strings, item.labelKey) || item.labelKey || item.key,
      routePath: resolveAppShellRoutePath(item, routesMap),
    }));
};

export const resolveAppShellNavigationGroups = (
  items: ResolvedAppShellNavigationItem[],
  groups: AppShellNavigationGroup[] = [],
  placement: AppShellPlacement,
  strings?: Record<string, any>
): ResolvedAppShellNavigationGroup[] => {
  const groupConfigByKey = new Map(groups.map((group) => [group.key, group]));
  const grouped = new Map<string, ResolvedAppShellNavigationItem[]>();

  items.forEach((item) => {
    const key = item.groupKey || "__primary";
    grouped.set(key, [...(grouped.get(key) || []), item]);
  });

  return [...grouped.entries()]
    .map(([key, groupItems]) => {
      const firstItem = groupItems[0];
      const config = groupConfigByKey.get(key);
      const label =
        config?.label ||
        resolveStringPath(strings, config?.labelKey) ||
        firstItem.groupLabel ||
        resolveStringPath(strings, firstItem.groupLabelKey) ||
        "";

      return {
        key,
        label,
        order: config?.order ?? firstItem.groupOrder ?? 0,
        items: groupItems,
      };
    })
    .filter((group) => {
      const config = groupConfigByKey.get(group.key);
      return config?.placements?.[placement] !== false;
    })
    .sort((a, b) => a.order - b.order);
};

export const resolveAppShellModel = ({
  activePath = "/",
  brand,
  brandLogo,
  brandName,
  config,
  isMobileScreen = false,
  isSidebarCollapsed = false,
  mode,
  navItems,
  navigation,
  routesMap,
}: ResolveAppShellModelInput): ResolvedAppShellModel => {
  const effectiveMode = (mode || config?.mode || "client") as AppShellMode;
  const themeColors = (config?.theme?.colors || fallbackTheme(effectiveMode)) as Record<string, string>;
  const strings = config?.strings || {};
  const resolvedNavigation = resolveAppShellNavigation(navigation || navItems || [], routesMap, strings);
  const sidebarEnabled = Boolean(config?.sidebar?.enabled) || effectiveMode === "admin";
  const headerEnabled = config?.header?.enabled !== false && !(isMobileScreen && config?.header?.mobile?.enabled === false);
  const footerEnabled = Boolean(config?.footer?.enabled);
  const bottomTabEnabled = config?.bottomTabBar?.enabled !== false;
  const headerLayout = config?.header?.layoutMode || "attached";
  const sidebarCols = (isSidebarCollapsed ? config?.sidebar?.collapsedCols : config?.sidebar?.expandedCols) || (isSidebarCollapsed ? 1 : 3);
  const sidebarWidth = `${(sidebarCols / 20) * 100}%`;
  const drawerItems = resolvedNavigation.filter((item) => resolveAppShellPlacement(item, "drawer", config));
  const sidebarItems = resolvedNavigation.filter((item) => resolveAppShellPlacement(item, "sidebar", config));
  const currentLayout = resolveAppShellViewportLayout(config, isMobileScreen ? "mobile" : "desktop");

  return {
    activePath,
    bottomItems: resolvedNavigation.filter((item) => resolveAppShellPlacement(item, "bottomTabBar", config)),
    bottomTabEnabled,
    brand: {
      name:
        brand?.name ||
        brandName ||
        resolveStringPath(strings, config?.header?.brandNameKey) ||
        config?.header?.brandName ||
        resolveStringPath(strings, config?.sidebar?.brandNameKey) ||
        config?.sidebar?.brandName ||
        "App",
      logo: brand?.logo || brandLogo || config?.header?.brandLogo || config?.sidebar?.brandLogo || "",
      kicker:
        brand?.kicker ||
        resolveStringPath(strings, config?.header?.brandKickerKey) ||
        config?.header?.brandKicker ||
        "",
      routePath: brand?.routePath || config?.header?.brandRoutePath || "/",
    },
    contentOffsetBottom: bottomTabEnabled ? config?.bottomTabBar?.contentOffsetBottom || "var(--theme--dimensions-height-3xl)" : "0",
    contentOffsetTop: headerEnabled ? config?.header?.contentOffsetTop || "var(--theme--dimensions-height-3xl)" : "0",
    cssVars: {
      "--app-shell-accent": themeColors.accent || themeColors.primary || "var(--theme--color-accent)",
      "--app-shell-accent-contrast": themeColors.accentContrast || themeColors.background || "var(--theme--color-accent-contrast)",
      "--app-shell-active-bg": themeColors.activeBg || "color-mix(in srgb, var(--app-shell-accent) 15%, transparent)",
      "--app-shell-background": themeColors.background || themeColors.bg || "var(--theme--color-background)",
      "--app-shell-border": themeColors.border || "var(--theme--color-border)",
      "--app-shell-brand-bg": config?.header?.brandSurface === "none" ? "transparent" : themeColors.surfaceContainer || themeColors.surface || "transparent",
      "--app-shell-brand-border": config?.header?.brandSurface === "none" ? "transparent" : themeColors.border || "transparent",
      "--app-shell-color": themeColors.text || "var(--theme--color-text)",
      "--app-shell-gap": tokenVar("spacing", config?.header?.gapLateralToken, "spaceSm"),
      "--app-shell-header-bg": config?.header?.surfaceStyle === "glassBlur" ? themeColors.headerBg || "color-mix(in srgb, var(--theme--color-background) 90%, transparent)" : themeColors.surface || "transparent",
      "--app-shell-header-max-width": tokenVar("layout", config?.header?.maxWidthToken, "containerXl"),
      "--app-shell-header-padding-x": tokenVar("spacing", config?.header?.paddingXToken, "spaceLg"),
      "--app-shell-header-padding-y": tokenVar("spacing", config?.header?.paddingYToken, "spaceSm"),
      "--app-shell-muted": themeColors.textMuted || "var(--theme--color-text-muted)",
      "--app-shell-nav-gap": tokenVar("spacing", config?.header?.navGapToken, "spaceLg"),
      "--app-shell-panel-bg": themeColors.surfaceContainer || themeColors.surface || "var(--theme--color-surface-container)",
      "--app-shell-sidebar-width": sidebarWidth,
      "--app-shell-surface-bg": themeColors.surface || "var(--theme--color-surface)",
    },
    currentLayout,
    drawerItems,
    drawerGroups: resolveAppShellNavigationGroups(drawerItems, config?.navigationGroups, "drawer", strings),
    effectiveMode,
    footerEnabled,
    footerItems: resolvedNavigation.filter((item) => resolveAppShellPlacement(item, "footer", config)),
    headerEnabled,
    headerItems: resolvedNavigation.filter((item) => resolveAppShellPlacement(item, "header", config) && !item.hideInHeader),
    isFloatingHeader: headerLayout === "floating",
    nativeTabItems: resolvedNavigation.filter((item) => resolveAppShellPlacement(item, "nativeTabBar", config)),
    sidebarEnabled,
    sidebarItems,
    sidebarGroups: resolveAppShellNavigationGroups(sidebarItems, config?.navigationGroups, "sidebar", strings),
    sidebarWidth,
    strings,
    themeColors,
  };
};
