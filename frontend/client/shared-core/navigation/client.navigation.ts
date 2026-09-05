import { clientRoutes } from "../manifest/routes";

export type NavItemType = "scroll" | "route";

export interface NavItemConfig {
  key: string;
  label?: string;
  labelKey?: string;
  groupKey?: string;
  groupLabelKey?: string;
  groupOrder?: number;
  type: NavItemType;
  targetId?: string;
  routeKey?: keyof typeof clientRoutes;
  order?: number;
  placements?: {
    header?: boolean;
    sidebar?: boolean;
    drawer?: boolean;
    bottomTabBar?: boolean;
    nativeTabBar?: boolean;
    footer?: boolean;
  };
  auth?: "public" | "required" | "guest";
  iconIntent?: string;
  iconName?: string;
}

// Navegacao da Landing: intencoes semanticas para Header, Drawer e futuro native.
export const clientNavigation: NavItemConfig[] = [
  { key: "hero", labelKey: "navigation.home", type: "scroll", targetId: "hero", iconIntent: "home", order: 0 },
  { key: "clube", labelKey: "navigation.royalBox", type: "scroll", targetId: "clube", iconIntent: "subscription", order: 1 },
  { key: "selecao", labelKey: "navigation.cortes", type: "scroll", targetId: "selecao", iconIntent: "catalog", order: 2 },
  { key: "assinaturas", labelKey: "navigation.royalBox", type: "scroll", targetId: "assinaturas", iconIntent: "subscription", order: 3 },
  { key: "beneficios", labelKey: "navigation.meuClube", type: "scroll", targetId: "beneficios", iconIntent: "success", order: 4 },
  { key: "faq", labelKey: "navigation.minhaConta", type: "scroll", targetId: "faq", iconIntent: "settings", order: 5 },
];

// Navegacao do Portal: um contrato alimenta desktop, web mobile e native-ready.
export const portalNavigation: NavItemConfig[] = [
  {
    key: "home",
    labelKey: "navigation.home",
    groupKey: "shop",
    groupLabelKey: "navigationGroups.shop",
    groupOrder: 0,
    type: "route",
    routeKey: "home",
    iconIntent: "home",
    order: 0,
    placements: { header: false, drawer: true, footer: false },
    auth: "public",
  },
  {
    key: "cortes",
    labelKey: "navigation.catalogo",
    groupKey: "shop",
    groupLabelKey: "navigationGroups.shop",
    groupOrder: 0,
    type: "route",
    routeKey: "cortes",
    iconIntent: "catalog",
    order: 1,
    placements: { header: true, drawer: true, footer: false },
    auth: "public",
  },
  {
    key: "produtos",
    labelKey: "navigation.produtos",
    groupKey: "shop",
    groupLabelKey: "navigationGroups.shop",
    groupOrder: 0,
    type: "route",
    routeKey: "produtos",
    iconIntent: "box",
    order: 2,
    placements: { header: true, drawer: true, footer: false },
    auth: "public",
  },
  {
    key: "royalDelivery",
    labelKey: "navigation.royalDelivery",
    groupKey: "shop",
    groupLabelKey: "navigationGroups.shop",
    groupOrder: 0,
    type: "route",
    routeKey: "royalDelivery",
    iconIntent: "delivery",
    order: 3,
    placements: { header: false, drawer: true, footer: false },
    auth: "required",
  },
  {
    key: "minhaCaixa",
    labelKey: "navigation.minhaCaixa",
    groupKey: "account",
    groupLabelKey: "navigationGroups.account",
    groupOrder: 1,
    type: "route",
    routeKey: "minhaCaixa",
    iconIntent: "subscription",
    order: 4,
    placements: { header: false, drawer: true, footer: false },
    auth: "required",
  },
  {
    key: "meuClube",
    labelKey: "navigation.meuClube",
    groupKey: "account",
    groupLabelKey: "navigationGroups.account",
    groupOrder: 1,
    type: "route",
    routeKey: "meuClube",
    iconIntent: "subscription",
    order: 5,
    placements: { header: false, drawer: true, footer: false },
    auth: "required",
  },
  {
    key: "minhaConta",
    labelKey: "navigation.perfil",
    groupKey: "account",
    groupLabelKey: "navigationGroups.account",
    groupOrder: 1,
    type: "route",
    routeKey: "minhaConta",
    iconIntent: "account",
    order: 6,
    placements: { header: false, drawer: true, footer: false },
    auth: "required",
  },
  {
    key: "meusPedidos",
    labelKey: "navigation.meusPedidos",
    groupKey: "support",
    groupLabelKey: "navigationGroups.support",
    groupOrder: 2,
    type: "route",
    routeKey: "meusPedidos",
    iconIntent: "orders",
    order: 7,
    placements: { header: false, drawer: true, footer: false },
    auth: "required",
  },
];
