import { resolveNativeAppShellModel } from "../../../../../../foundation/shells/app-shell/native";
import { clientPtBR } from "../../../../../shared-core/locales/pt-BR";
import { clientRoutes } from "../../../../../shared-core/manifest/routes";
import { portalNavigation } from "../../../../../shared-core/navigation/client.navigation";
import { createMobileAppShellConfig, type AppThemeMode } from "../../../shell/AppShell/config";

export interface HomeModelInput {
  activePath?: string;
  themeMode?: AppThemeMode;
}

export interface HomeModel {
  appShell: ReturnType<typeof resolveNativeAppShellModel>;
  contractVersion: "client.home.mobile-model.v1";
  platform: "react-native";
  screenKey: "home";
  sections: [];
  strings: typeof clientPtBR.home.vitrine;
}

export const createHomeModel = ({
  activePath = clientRoutes.home,
  themeMode = "dark",
}: HomeModelInput = {}): HomeModel => ({
  appShell: resolveNativeAppShellModel({
    activePath,
    config: createMobileAppShellConfig(themeMode) as any,
    mode: "client",
    navItems: portalNavigation as any,
    routesMap: clientRoutes,
  }),
  contractVersion: "client.home.mobile-model.v1",
  platform: "react-native",
  screenKey: "home",
  sections: [],
  strings: clientPtBR.home.vitrine,
});
