import { resolveAppShellModel } from "../foundation";
import type { NativeAppShellInput, NativeAppShellModel } from "./types";

export const resolveNativeAppShellModel = (input: NativeAppShellInput): NativeAppShellModel => {
  const model = resolveAppShellModel(input);
  const nativeTabBarConfig = input.config?.nativeTabBar || input.config?.bottomTabBar;

  return {
    activePath: model.activePath,
    brand: model.brand,
    contractVersion: "app-shell.native.v1",
    mode: model.effectiveMode,
    regions: {
      drawer: {
        enabled: model.drawerItems.length > 0 && input.config?.drawer?.enabled !== false,
        items: model.drawerItems,
      },
      header: {
        enabled: model.headerEnabled,
        items: model.headerItems,
      },
      nativeTabBar: {
        enabled: nativeTabBarConfig?.enabled !== false && model.nativeTabItems.length > 0,
        items: model.nativeTabItems,
      },
    },
    strings: model.strings,
    themeColors: model.themeColors,
  };
};
