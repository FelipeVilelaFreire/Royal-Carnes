import { clientPtBR } from "../locales/pt-BR";
import { clientRoutes } from "../manifests/routes";

export type NavItemType = "scroll" | "route";

export interface NavItemConfig {
  key: string;
  label: string;
  type: NavItemType;
  targetId?: string;
  routeKey?: keyof typeof clientRoutes;
  iconName?: string;
}

// Navegacao da LANDING PAGE (Publica - Scroll Anchors)
export const clientNavigation: NavItemConfig[] = [
  { key: "hero", label: "Início", type: "scroll", targetId: "hero", iconName: "flame" },
  { key: "clube", label: "O Clube", type: "scroll", targetId: "clube", iconName: "sparkles" },
  { key: "selecao", label: "A Seleção", type: "scroll", targetId: "selecao", iconName: "steak" },
  { key: "assinaturas", label: "Assinaturas", type: "scroll", targetId: "assinaturas", iconName: "list" },
  { key: "beneficios", label: "Benefícios", type: "scroll", targetId: "beneficios", iconName: "gift" },
  { key: "faq", label: "FAQ", type: "scroll", targetId: "faq", iconName: "question" }
];

// Navegacao publica do portal MVP: vitrine, catalogo e produtos.
export const portalNavigation: NavItemConfig[] = [
  { key: "cortes", label: clientPtBR.navigation.catalogo, type: "route", routeKey: "cortes", iconName: "store" },
  { key: "produtos", label: clientPtBR.navigation.produtos, type: "route", routeKey: "produtos", iconName: "box" }
];
