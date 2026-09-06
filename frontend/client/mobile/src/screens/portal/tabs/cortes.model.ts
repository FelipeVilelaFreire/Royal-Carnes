import { resolveNativeAppShellModel } from "../../../../../../foundation/shells/app-shell/native";
import type { ClientCatalogSnapshot } from "../../../../../shared-core/contracts/catalog.contract";
import { clientPtBR } from "../../../../../shared-core/locales/pt-BR";
import { clientRoutes } from "../../../../../shared-core/manifest/routes";
import { portalNavigation } from "../../../../../shared-core/navigation/client.navigation";
import { createMobileAppShellConfig, type AppThemeMode } from "../../../shell/AppShell/config";
import {
  createCortesCatalogViewModel,
  type CortesCatalogSortKey,
  type CortesCatalogViewModel,
} from "../../../../../shared-core/view-models/cortes-catalog.view-model";

export interface CortesModelInput {
  activeCategoryId?: string;
  activePath?: string;
  catalogSnapshot?: ClientCatalogSnapshot;
  searchQuery?: string;
  sortBy?: CortesCatalogSortKey;
  themeMode?: AppThemeMode;
}

export interface CortesModel {
  appShell: ReturnType<typeof resolveNativeAppShellModel>;
  catalog: CortesCatalogViewModel;
  contractVersion: "client.cortes.mobile-model.v1";
  platform: "react-native";
  screenKey: "cortes";
  strings: typeof clientPtBR.cortes.catalogPage;
}

const emptyCatalogSnapshot: ClientCatalogSnapshot = {
  collections: [],
  commercialModes: [],
  products: [],
};

export const createCortesModel = ({
  activeCategoryId = "all",
  activePath = clientRoutes.cortes,
  catalogSnapshot = emptyCatalogSnapshot,
  searchQuery = "",
  sortBy = "relevance",
  themeMode = "dark",
}: CortesModelInput = {}): CortesModel => {
  const strings = clientPtBR.cortes.catalogPage;

  return {
    appShell: resolveNativeAppShellModel({
      activePath,
      config: createMobileAppShellConfig(themeMode) as any,
      mode: "client",
      navItems: portalNavigation as any,
      routesMap: clientRoutes,
    }),
    catalog: createCortesCatalogViewModel({
      activeCategoryId,
      apiProducts: catalogSnapshot.products,
      defaultLineLabel: strings.defaultLineLabel,
      searchQuery,
      sortBy,
    }),
    contractVersion: "client.cortes.mobile-model.v1",
    platform: "react-native",
    screenKey: "cortes",
    strings,
  };
};
