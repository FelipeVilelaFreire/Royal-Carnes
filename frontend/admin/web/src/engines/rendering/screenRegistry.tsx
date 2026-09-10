import type { ApiClientConfig } from "@shared-core";
import { assinaturasConfig } from "@/manifest/pages/assinaturas.config";
import { categoriasConfig } from "@/manifest/pages/categorias.config";
import { clientesConfig } from "@/manifest/pages/clientes.config";
import { colecoesConfig } from "@/manifest/pages/colecoes.config";
import { dashboardConfig } from "@/manifest/pages/dashboard.config";
import { deliveriesConfig } from "@/manifest/pages/deliveries.config";
import { estoqueConfig } from "@/manifest/pages/estoque.config";
import { pagamentosConfig } from "@/manifest/pages/pagamentos.config";
import { pedidosConfig } from "@/manifest/pages/pedidos.config";
import { planosConfig } from "@/manifest/pages/planos.config";
import { produtosConfig } from "@/manifest/pages/produtos.config";
import { settingsConfig } from "@/manifest/pages/settings.config";
import { usuariosConfig } from "@/manifest/pages/usuarios.config";
import { DashboardScreen } from "./screen-types/dashboard/DashboardScreen";
import { StandardScreen } from "./screen-types/standard/StandardScreen";
import { SettingsPage } from "./screen-types/settings/SettingsPage";
import type { AdminRouteAction } from "../../useAdminRuntime";

const standardScreenConfigs: Record<string, any> = {
  assinaturas: assinaturasConfig,
  categorias: categoriasConfig,
  clientes: clientesConfig,
  colecoes: colecoesConfig,
  deliveries: deliveriesConfig,
  estoque: estoqueConfig,
  pagamentos: pagamentosConfig,
  pedidos: pedidosConfig,
  planos: planosConfig,
  produtos: produtosConfig,
  usuarios: usuariosConfig,
};

export interface RenderAdminScreenOptions {
  activeScreenKey: string;
  apiConfig: ApiClientConfig;
  backToList: () => void;
  createNew: () => void;
  navigate: (path: string) => void;
  routeAction?: AdminRouteAction;
  selectedRow?: Record<string, any> | null;
  selectRow: (row: Record<string, any>) => void;
}

export function renderAdminScreen({
  activeScreenKey,
  apiConfig,
  backToList,
  createNew,
  navigate,
  routeAction,
  selectedRow,
  selectRow,
}: RenderAdminScreenOptions) {
  if (activeScreenKey === "dashboard") {
    return <DashboardScreen apiConfig={apiConfig} config={dashboardConfig as any} onNavigate={navigate} />;
  }

  if (activeScreenKey === "configuracoes" || activeScreenKey === "settings") {
    return <SettingsPage config={settingsConfig} />;
  }

  const activeConfig = standardScreenConfigs[activeScreenKey];
  if (activeConfig) {
    return (
      <StandardScreen
        apiConfig={apiConfig}
        entityConfig={activeConfig}
        onBackToList={backToList}
        onCreateRow={createNew}
        onEditRow={createNew}
        onSelectRow={selectRow}
        onSubmit={backToList}
        routeAction={routeAction}
        selectedRow={selectedRow}
      />
    );
  }

  return <DashboardScreen apiConfig={apiConfig} config={dashboardConfig as any} onNavigate={navigate} />;
}
