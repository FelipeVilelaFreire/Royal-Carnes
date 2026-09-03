import type { ReactNode } from "react";

export type AppShellMode = "client" | "admin";
export type AppShellPlacement = "header" | "sidebar" | "drawer" | "bottomTabBar" | "nativeTabBar" | "footer";

export interface AppShellNavigationItem {
  key: string;
  label?: string;
  labelKey?: string;
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

export interface AppShellConfig {
  auth?: any;
  bottomTabBar?: any;
  drawer?: any;
  footer?: any;
  header?: any;
  layout?: any;
  mode?: AppShellMode | string;
  nativeTabBar?: any;
  sidebar?: any;
  strings?: AppShellStrings;
  theme?: any;
}

export interface ResolvedAppShellNavigationItem extends AppShellNavigationItem {
  label: string;
  routePath: string;
}

export interface ResolvedAppShellModel {
  activePath: string;
  bottomItems: ResolvedAppShellNavigationItem[];
  bottomTabEnabled: boolean;
  brand: Required<AppShellBrand>;
  contentOffsetBottom: string;
  contentOffsetTop: string;
  cssVars: Record<string, string>;
  drawerItems: ResolvedAppShellNavigationItem[];
  effectiveMode: AppShellMode;
  footerEnabled: boolean;
  footerItems: ResolvedAppShellNavigationItem[];
  headerEnabled: boolean;
  headerItems: ResolvedAppShellNavigationItem[];
  isFloatingHeader: boolean;
  nativeTabItems: ResolvedAppShellNavigationItem[];
  sidebarEnabled: boolean;
  sidebarItems: ResolvedAppShellNavigationItem[];
  sidebarWidth: string;
  strings: AppShellStrings;
  themeColors: Record<string, string>;
}
