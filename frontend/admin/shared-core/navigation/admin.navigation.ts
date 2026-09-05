export interface AdminNavigationItem {
  key: string;
  label?: string;
  labelKey: string;
  groupKey: string;
  groupLabelKey: string;
  groupOrder: number;
  iconIntent: string;
  screenKey: string;
  routeKey: string;
  routePath?: string;
  order: number;
  placements: {
    header: boolean;
    sidebar: boolean;
    drawer: boolean;
    bottomBar: boolean;
    bottomTabBar?: boolean;
    nativeTabBar: boolean;
    footer: boolean;
  };
}

export const adminNavigation: AdminNavigationItem[] = [
  {
    key: "dashboard",
    labelKey: "navigation.dashboard",
    groupKey: "overview",
    groupLabelKey: "navigationGroups.overview",
    groupOrder: 0,
    iconIntent: "dashboard",
    screenKey: "dashboard",
    routeKey: "dashboard",
    routePath: "/admin",
    order: 0,
    placements: { header: false, sidebar: true, drawer: true, bottomBar: true, bottomTabBar: true, nativeTabBar: true, footer: false },
  },
  {
    key: "produtos",
    labelKey: "navigation.produtos",
    groupKey: "commerce",
    groupLabelKey: "navigationGroups.commerce",
    groupOrder: 1,
    iconIntent: "catalog",
    screenKey: "produtos",
    routeKey: "produtos",
    routePath: "/produtos",
    order: 1,
    placements: { header: false, sidebar: true, drawer: true, bottomBar: true, bottomTabBar: true, nativeTabBar: true, footer: false },
  },
  {
    key: "assinaturas",
    labelKey: "navigation.assinaturas",
    groupKey: "commerce",
    groupLabelKey: "navigationGroups.commerce",
    groupOrder: 1,
    iconIntent: "subscription",
    screenKey: "assinaturas",
    routeKey: "assinaturas",
    routePath: "/assinaturas",
    order: 2,
    placements: { header: false, sidebar: true, drawer: true, bottomBar: true, bottomTabBar: true, nativeTabBar: true, footer: false },
  },
  {
    key: "pedidos",
    labelKey: "navigation.pedidos",
    groupKey: "commerce",
    groupLabelKey: "navigationGroups.commerce",
    groupOrder: 1,
    iconIntent: "orders",
    screenKey: "pedidos",
    routeKey: "pedidos",
    routePath: "/pedidos",
    order: 3,
    placements: { header: false, sidebar: true, drawer: true, bottomBar: true, bottomTabBar: true, nativeTabBar: true, footer: false },
  },
  {
    key: "deliveries",
    labelKey: "navigation.deliveries",
    groupKey: "commerce",
    groupLabelKey: "navigationGroups.commerce",
    groupOrder: 1,
    iconIntent: "delivery",
    screenKey: "deliveries",
    routeKey: "deliveries",
    routePath: "/deliveries",
    order: 4,
    placements: { header: false, sidebar: true, drawer: true, bottomBar: true, bottomTabBar: true, nativeTabBar: true, footer: false },
  },
  {
    key: "usuarios",
    labelKey: "navigation.usuarios",
    groupKey: "people",
    groupLabelKey: "navigationGroups.people",
    groupOrder: 2,
    iconIntent: "user",
    screenKey: "usuarios",
    routeKey: "usuarios",
    routePath: "/usuarios",
    order: 5,
    placements: { header: false, sidebar: true, drawer: true, bottomBar: true, bottomTabBar: true, nativeTabBar: true, footer: false },
  },
  {
    key: "configuracoes",
    labelKey: "navigation.configuracoes",
    groupKey: "system",
    groupLabelKey: "navigationGroups.system",
    groupOrder: 3,
    iconIntent: "settings",
    screenKey: "configuracoes",
    routeKey: "configuracoes",
    routePath: "/configuracoes",
    order: 6,
    placements: { header: false, sidebar: true, drawer: true, bottomBar: true, bottomTabBar: true, nativeTabBar: true, footer: false },
  },
];
