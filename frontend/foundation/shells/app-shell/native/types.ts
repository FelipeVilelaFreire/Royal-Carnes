import type {
  AppShellBrand,
  AppShellConfig,
  AppShellViewportLayout,
  AppShellMode,
  AppShellNavigationItem,
  AppShellStrings,
  ResolvedAppShellNavigationGroup,
  ResolvedAppShellNavigationItem,
} from "../foundation";
import type { NativeFoundationDesignSystem, NativeStyleDescriptor } from "../../../native";

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
  surfaceStyle?: NativeStyleDescriptor;
}

export interface NativeAppShellNavigationStyles {
  active: NativeStyleDescriptor;
  inactive: NativeStyleDescriptor;
}

export interface NativeAppShellModel {
  activePath: string;
  brand: Required<AppShellBrand>;
  contractVersion: "app-shell.native.v1";
  currentLayout: AppShellViewportLayout;
  mode: AppShellMode;
  designSystem: NativeFoundationDesignSystem;
  navigationStyles: NativeAppShellNavigationStyles;
  regions: {
    drawer: NativeAppShellRegion;
    header: NativeAppShellRegion;
    nativeTabBar: NativeAppShellRegion;
  };
  drawerGroups: ResolvedAppShellNavigationGroup[];
  strings: AppShellStrings & Record<string, any>;
  themeColors: Record<string, string>;
}
