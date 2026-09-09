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
  { key: "principal", labelKey: "navigationGroups.principal", order: 0 },
  { key: "club", labelKey: "navigationGroups.club", order: 1 },
  { key: "management", labelKey: "navigationGroups.management", order: 2 },
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
    groupKey: "principal",
    groupLabelKey: "navigationGroups.principal",
    groupOrder: 0,
    iconIntent: "dashboard",
    screenKey: "dashboard",
    routeKey: "dashboard",
    routePath: "/admin",
    order: 0,
    placements: adminPrimaryPlacements,
  },
  {
    key: "clientes",
    labelKey: "navigation.clientes",
    groupKey: "principal",
    groupLabelKey: "navigationGroups.principal",
    groupOrder: 0,
    iconIntent: "user",
    screenKey: "clientes",
    routeKey: "clientes",
    routePath: "/clientes",
    order: 1,
    placements: adminPrimaryPlacements,
  },
  {
    key: "produtos",
    labelKey: "navigation.produtos",
    groupKey: "principal",
    groupLabelKey: "navigationGroups.principal",
    groupOrder: 0,
    iconIntent: "catalog",
    screenKey: "produtos",
    routeKey: "produtos",
    routePath: "/produtos",
    order: 2,
    placements: adminPrimaryPlacements,
  },
  {
    key: "pedidos",
    labelKey: "navigation.pedidos",
    groupKey: "principal",
    groupLabelKey: "navigationGroups.principal",
    groupOrder: 0,
    iconIntent: "orders",
    screenKey: "pedidos",
    routeKey: "pedidos",
    routePath: "/pedidos",
    order: 3,
    placements: adminPrimaryPlacements,
  },
  {
    key: "deliveries",
    labelKey: "navigation.deliveries",
    groupKey: "principal",
    groupLabelKey: "navigationGroups.principal",
    groupOrder: 0,
    iconIntent: "delivery",
    screenKey: "deliveries",
    routeKey: "deliveries",
    routePath: "/deliveries",
    order: 4,
    placements: adminPrimaryPlacements,
  },
  {
    key: "planos",
    labelKey: "navigation.planos",
    groupKey: "club",
    groupLabelKey: "navigationGroups.club",
    groupOrder: 1,
    iconIntent: "subscription",
    screenKey: "planos",
    routeKey: "planos",
    routePath: "/planos",
    order: 5,
    placements: adminPrimaryPlacements,
  },
  {
    key: "pagamentos",
    labelKey: "navigation.pagamentos",
    groupKey: "club",
    groupLabelKey: "navigationGroups.club",
    groupOrder: 1,
    iconIntent: "payments",
    screenKey: "pagamentos",
    routeKey: "pagamentos",
    routePath: "/pagamentos",
    order: 7,
    placements: adminPrimaryPlacements,
  },
  {
    key: "assinaturas",
    labelKey: "navigation.assinaturas",
    groupKey: "club",
    groupLabelKey: "navigationGroups.club",
    groupOrder: 1,
    iconIntent: "subscription",
    screenKey: "assinaturas",
    routeKey: "assinaturas",
    routePath: "/assinaturas",
    order: 6,
    placements: adminPrimaryPlacements,
  },
  {
    key: "categorias",
    labelKey: "navigation.categorias",
    groupKey: "management",
    groupLabelKey: "navigationGroups.management",
    groupOrder: 2,
    iconIntent: "catalog",
    screenKey: "categorias",
    routeKey: "categorias",
    routePath: "/categorias",
    order: 8,
    placements: adminPrimaryPlacements,
  },
  {
    key: "colecoes",
    labelKey: "navigation.colecoes",
    groupKey: "management",
    groupLabelKey: "navigationGroups.management",
    groupOrder: 2,
    iconIntent: "catalog",
    screenKey: "colecoes",
    routeKey: "colecoes",
    routePath: "/colecoes",
    order: 9,
    placements: adminPrimaryPlacements,
  },
  {
    key: "usuarios",
    labelKey: "navigation.usuarios",
    groupKey: "management",
    groupLabelKey: "navigationGroups.management",
    groupOrder: 2,
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
    groupKey: "management",
    groupLabelKey: "navigationGroups.management",
    groupOrder: 2,
    iconIntent: "settings",
    screenKey: "configuracoes",
    routeKey: "configuracoes",
    routePath: "/configuracoes",
    order: 11,
    placements: adminPrimaryPlacements,
  },
];
