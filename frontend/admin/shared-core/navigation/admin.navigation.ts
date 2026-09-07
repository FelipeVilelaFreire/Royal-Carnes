import type { AppShellNavigationGroup, AppShellNavigationItem } from "@foundation/shells/app-shell";

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
    header?: boolean;
    sidebar?: boolean;
    drawer?: boolean;
    footer?: boolean;
  };
}

export const adminNavigationGroups: AppShellNavigationGroup[] = [
  { key: "overview", labelKey: "navigationGroups.overview", order: 0 },
  { key: "operations", labelKey: "navigationGroups.operations", order: 1 },
  { key: "catalog", labelKey: "navigationGroups.catalog", order: 2 },
  { key: "customers", labelKey: "navigationGroups.customers", order: 3 },
  { key: "system", labelKey: "navigationGroups.system", order: 4 },
];

const adminPrimaryPlacements = {
  drawer: true,
  footer: false,
  header: false,
  sidebar: true,
};

export const adminNavigation: Array<AdminNavigationItem & AppShellNavigationItem> = [
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
    placements: adminPrimaryPlacements,
  },
  {
    key: "pedidos",
    labelKey: "navigation.pedidos",
    groupKey: "operations",
    groupLabelKey: "navigationGroups.operations",
    groupOrder: 1,
    iconIntent: "orders",
    screenKey: "pedidos",
    routeKey: "pedidos",
    routePath: "/pedidos",
    order: 1,
    placements: adminPrimaryPlacements,
  },
  {
    key: "deliveries",
    labelKey: "navigation.deliveries",
    groupKey: "operations",
    groupLabelKey: "navigationGroups.operations",
    groupOrder: 1,
    iconIntent: "delivery",
    screenKey: "deliveries",
    routeKey: "deliveries",
    routePath: "/deliveries",
    order: 2,
    placements: adminPrimaryPlacements,
  },
  {
    key: "estoque",
    labelKey: "navigation.estoque",
    groupKey: "operations",
    groupLabelKey: "navigationGroups.operations",
    groupOrder: 1,
    iconIntent: "inventory",
    screenKey: "estoque",
    routeKey: "estoque",
    routePath: "/estoque",
    order: 3,
    placements: adminPrimaryPlacements,
  },
  {
    key: "produtos",
    labelKey: "navigation.produtos",
    groupKey: "catalog",
    groupLabelKey: "navigationGroups.catalog",
    groupOrder: 2,
    iconIntent: "catalog",
    screenKey: "produtos",
    routeKey: "produtos",
    routePath: "/produtos",
    order: 4,
    placements: adminPrimaryPlacements,
  },
  {
    key: "categorias",
    labelKey: "navigation.categorias",
    groupKey: "catalog",
    groupLabelKey: "navigationGroups.catalog",
    groupOrder: 2,
    iconIntent: "catalog",
    screenKey: "categorias",
    routeKey: "categorias",
    routePath: "/categorias",
    order: 5,
    placements: adminPrimaryPlacements,
  },
  {
    key: "planos",
    labelKey: "navigation.planos",
    groupKey: "catalog",
    groupLabelKey: "navigationGroups.catalog",
    groupOrder: 2,
    iconIntent: "subscription",
    screenKey: "planos",
    routeKey: "planos",
    routePath: "/planos",
    order: 6,
    placements: adminPrimaryPlacements,
  },
  {
    key: "clientes",
    labelKey: "navigation.clientes",
    groupKey: "customers",
    groupLabelKey: "navigationGroups.customers",
    groupOrder: 3,
    iconIntent: "user",
    screenKey: "clientes",
    routeKey: "clientes",
    routePath: "/clientes",
    order: 7,
    placements: adminPrimaryPlacements,
  },
  {
    key: "assinaturas",
    labelKey: "navigation.assinaturas",
    groupKey: "customers",
    groupLabelKey: "navigationGroups.customers",
    groupOrder: 3,
    iconIntent: "subscription",
    screenKey: "assinaturas",
    routeKey: "assinaturas",
    routePath: "/assinaturas",
    order: 8,
    placements: adminPrimaryPlacements,
  },
  {
    key: "pagamentos",
    labelKey: "navigation.pagamentos",
    groupKey: "customers",
    groupLabelKey: "navigationGroups.customers",
    groupOrder: 3,
    iconIntent: "payments",
    screenKey: "pagamentos",
    routeKey: "pagamentos",
    routePath: "/pagamentos",
    order: 9,
    placements: adminPrimaryPlacements,
  },
  {
    key: "usuarios",
    labelKey: "navigation.usuarios",
    groupKey: "system",
    groupLabelKey: "navigationGroups.system",
    groupOrder: 4,
    iconIntent: "user",
    screenKey: "usuarios",
    routeKey: "usuarios",
    routePath: "/usuarios",
    order: 10,
    placements: adminPrimaryPlacements,
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
    order: 11,
    placements: adminPrimaryPlacements,
  },
];
