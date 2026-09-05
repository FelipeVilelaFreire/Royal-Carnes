import { resolveAppShellModel, resolveAppShellViewportLayout } from "../foundation";
import { resolveNativeUiManifest } from "../../../native";
import type { NativeAppShellInput, NativeAppShellModel } from "./types";

export const resolveNativeAppShellModel = (input: NativeAppShellInput): NativeAppShellModel => {
  const model = resolveAppShellModel(input);
  const nativeTabBarConfig = input.config?.nativeTabBar || input.config?.bottomTabBar;
  const headerEnabled = input.config?.native?.header?.enabled === false || input.config?.header?.mobile?.enabled === false
    ? false
    : model.headerEnabled;
  const designSystem = resolveNativeUiManifest({
    mode: model.effectiveMode,
    ui: { theme: input.config?.theme } as any,
  });
  const surface = designSystem.primitives.Surface?.states || {};
  const button = designSystem.primitives.Button?.states || {};

  return {
    activePath: model.activePath,
    brand: model.brand,
    contractVersion: "app-shell.native.v1",
    currentLayout: resolveAppShellViewportLayout(input.config, "native"),
    designSystem,
    mode: model.effectiveMode,
    navigationStyles: {
      active: button.active || {},
      inactive: button.inactive || {},
    },
    regions: {
      drawer: {
        enabled: model.drawerItems.length > 0 && input.config?.drawer?.enabled !== false,
        items: model.drawerItems,
        surfaceStyle: surface.default,
      },
      header: {
        enabled: headerEnabled,
        items: model.headerItems,
        surfaceStyle: surface.default,
      },
      nativeTabBar: {
        enabled: nativeTabBarConfig?.enabled !== false && model.nativeTabItems.length > 0,
        items: model.nativeTabItems,
        surfaceStyle: surface.default,
      },
    },
    drawerGroups: model.drawerGroups,
    strings: model.strings,
    themeColors: model.themeColors,
  };
};
