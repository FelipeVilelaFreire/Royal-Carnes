export interface AdminNavigationItem {
  key: string;
  label: string;
  labelKey: string;
  screenKey: string;
  routeKey: string;
  routePath?: string;
  order: number;
  placements: {
    header: boolean;
    sidebar: boolean;
    drawer: boolean;
    bottomBar: boolean;
    footer: boolean;
  };
}

export const adminNavigation: AdminNavigationItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    labelKey: "navigation.dashboard",
    screenKey: "dashboard",
    routeKey: "dashboard",
    routePath: "/admin",
    order: 0,
    placements: { header: false, sidebar: true, drawer: true, bottomBar: true, footer: false }
  },
  {
    key: "produtos",
    label: "Produtos",
    labelKey: "navigation.produtos",
    screenKey: "produtos",
    routeKey: "produtos",
    routePath: "/produtos",
    order: 1,
    placements: { header: false, sidebar: true, drawer: true, bottomBar: true, footer: false }
  },
  {
    key: "usuarios",
    label: "Usuários",
    labelKey: "navigation.usuarios",
    screenKey: "usuarios",
    routeKey: "usuarios",
    routePath: "/usuarios",
    order: 2,
    placements: { header: false, sidebar: true, drawer: true, bottomBar: true, footer: false }
  },
  {
    key: "assinaturas",
    label: "Assinaturas",
    labelKey: "navigation.assinaturas",
    screenKey: "assinaturas",
    routeKey: "assinaturas",
    routePath: "/assinaturas",
    order: 3,
    placements: { header: false, sidebar: true, drawer: true, bottomBar: true, footer: false }
  },
  {
    key: "pedidos",
    label: "Pedidos",
    labelKey: "navigation.pedidos",
    screenKey: "pedidos",
    routeKey: "pedidos",
    routePath: "/pedidos",
    order: 4,
    placements: { header: false, sidebar: true, drawer: true, bottomBar: true, footer: false }
  },
  {
    key: "deliveries",
    label: "Deliveries",
    labelKey: "navigation.deliveries",
    screenKey: "deliveries",
    routeKey: "deliveries",
    routePath: "/deliveries",
    order: 5,
    placements: { header: false, sidebar: true, drawer: true, bottomBar: true, footer: false }
  },
  {
    key: "configuracoes",
    label: "Configurações",
    labelKey: "navigation.configuracoes",
    screenKey: "configuracoes",
    routeKey: "configuracoes",
    routePath: "/configuracoes",
    order: 6,
    placements: { header: false, sidebar: true, drawer: true, bottomBar: true, footer: false }
  }
];
