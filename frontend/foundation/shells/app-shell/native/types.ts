import type {
  AppShellBrand,
  AppShellConfig,
  AppShellMode,
  AppShellNavigationItem,
  AppShellStrings,
  ResolvedAppShellNavigationItem,
} from "../foundation";

export interface NativeAppShellInput {
  activePath?: string;
  brand?: AppShellBrand;
  brandLogo?: string;
  brandName?: string;
  config?: AppShellConfig;
  mode?: AppShellMode | string;
  navItems?: AppShellNavigationItem[];
  navigation?: AppShellNavigationItem[];
  routesMap?: Record<string, string>;
}

export interface NativeAppShellRegion {
  enabled: boolean;
  items: ResolvedAppShellNavigationItem[];
}

export interface NativeAppShellModel {
  activePath: string;
  brand: Required<AppShellBrand>;
  contractVersion: "app-shell.native.v1";
  mode: AppShellMode;
  regions: {
    drawer: NativeAppShellRegion;
    header: NativeAppShellRegion;
    nativeTabBar: NativeAppShellRegion;
  };
  strings: AppShellStrings;
  themeColors: Record<string, string>;
}
