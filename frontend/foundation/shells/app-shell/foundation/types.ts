import type { ReactNode } from "react";

export type AppShellMode = "client" | "admin";
export type AppShellPlacement = "header" | "sidebar" | "drawer" | "bottomTabBar" | "nativeTabBar" | "footer";

export interface AppShellNavigationGroup {
  key: string;
  label?: string;
  labelKey?: string;
  order?: number;
  placements?: Partial<Record<AppShellPlacement, boolean>>;
}

export interface AppShellNavigationPlacementRule {
  enabled?: boolean;
  inheritFrom?: AppShellPlacement | string;
  keys?: string[];
  routeKeys?: string[];
  excludeKeys?: string[];
  excludeRouteKeys?: string[];
}

export interface AppShellNavigationItem {
  key: string;
  label?: string;
  labelKey?: string;
  groupKey?: string;
  groupLabel?: string;
  groupLabelKey?: string;
  groupOrder?: number;
  icon?: ReactNode;
  iconIntent?: string;
  iconName?: string;
  order?: number;
  routeKey?: string;
  routePath?: string;
  path?: string;
  type?: "route" | "scroll";
  targetId?: string;
  placements?: Partial<Record<AppShellPlacement, boolean>> & { bottomBar?: boolean };
  hideInHeader?: boolean;
  auth?: "public" | "required" | "guest";
}

export interface AppShellStrings {
  closeDrawerAriaLabel?: string;
  collapseSidebar?: string;
  openDrawerAriaLabel?: string;
  searchPlaceholder?: string;
}

export interface AppShellBrand {
  name?: string;
  logo?: string;
  kicker?: string;
  routePath?: string;
}

export type AppShellLayoutViewport = "desktop" | "mobile" | "native";
export type AppShellLayoutWidth = "compact" | "comfortable" | "wide" | "full";
export type AppShellLayoutGutter = "none" | "page";

export interface AppShellLayoutRegion {
  align?: "around" | "between" | "center" | "end" | "evenly" | "start" | string;
  enabled?: boolean;
  gridColumns?: "theme" | number;
  gutter?: AppShellLayoutGutter | string;
  width?: AppShellLayoutWidth | string;
}

export interface AppShellViewportLayout {
  bottomTabBar?: AppShellLayoutRegion;
  content?: AppShellLayoutRegion;
  drawer?: AppShellLayoutRegion;
  footer?: AppShellLayoutRegion;
  header?: AppShellLayoutRegion;
  inheritFrom?: AppShellLayoutViewport | string;
}

export interface AppShellLayoutConfig {
  desktop?: string;
  mobile?: string;
  native?: string;
  totalCols?: number;
  viewports?: Partial<Record<AppShellLayoutViewport, AppShellViewportLayout>>;
}

export interface AppShellConfig {
  auth?: any;
  bottomTabBar?: any;
  drawer?: any;
  footer?: any;
  header?: any;
  layout?: AppShellLayoutConfig;
  mode?: AppShellMode | string;
  native?: any;
  nativeTabBar?: any;
  navigationPlacements?: Partial<Record<AppShellPlacement, AppShellNavigationPlacementRule>>;
  navigationGroups?: AppShellNavigationGroup[];
  sidebar?: any;
  strings?: AppShellStrings & Record<string, any>;
  theme?: any;
}

export interface ResolvedAppShellNavigationItem extends AppShellNavigationItem {
  label: string;
  routePath: string;
}

export interface ResolvedAppShellNavigationGroup {
  key: string;
  label: string;
  order: number;
  items: ResolvedAppShellNavigationItem[];
}

export interface ResolvedAppShellModel {
  activePath: string;
  bottomItems: ResolvedAppShellNavigationItem[];
  bottomTabEnabled: boolean;
  brand: Required<AppShellBrand>;
  contentOffsetBottom: string;
  contentOffsetTop: string;
  cssVars: Record<string, string>;
  currentLayout: AppShellViewportLayout;
  drawerItems: ResolvedAppShellNavigationItem[];
  effectiveMode: AppShellMode;
  footerEnabled: boolean;
  footerItems: ResolvedAppShellNavigationItem[];
  headerEnabled: boolean;
  headerItems: ResolvedAppShellNavigationItem[];
  isFloatingHeader: boolean;
  nativeTabItems: ResolvedAppShellNavigationItem[];
  drawerGroups: ResolvedAppShellNavigationGroup[];
  sidebarEnabled: boolean;
  sidebarGroups: ResolvedAppShellNavigationGroup[];
  sidebarItems: ResolvedAppShellNavigationItem[];
  sidebarWidth: string;
  strings: AppShellStrings & Record<string, any>;
  themeColors: Record<string, string>;
}
