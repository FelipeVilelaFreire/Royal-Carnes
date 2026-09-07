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
  { key: "commerce", labelKey: "navigationGroups.commerce", order: 1 },
  { key: "people", labelKey: "navigationGroups.people", order: 2 },
  { key: "system", labelKey: "navigationGroups.system", order: 3 },
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
    placements: adminPrimaryPlacements,
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
    placements: adminPrimaryPlacements,
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
    placements: adminPrimaryPlacements,
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
    placements: adminPrimaryPlacements,
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
    order: 6,
    placements: adminPrimaryPlacements,
  },
];
