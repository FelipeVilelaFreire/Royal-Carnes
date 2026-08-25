import { clientRoutes } from "./routes";
import { clientPtBR } from "./locales/pt-BR";

export type NavItemType = "scroll" | "route";

export interface NavItemConfig {
  key: string;
  label: string;
  type: NavItemType;
  targetId?: string;
  routeKey?: keyof typeof clientRoutes;
  iconName?: string;
}

// 🥩 Navegação da LANDING PAGE (Pública - Scroll Anchors)
export const clientNavigation: NavItemConfig[] = [
  { key: "hero", label: "Início", type: "scroll", targetId: "hero", iconName: "flame" },
  { key: "clube", label: "O Clube", type: "scroll", targetId: "clube", iconName: "sparkles" },
  { key: "selecao", label: "A Seleção", type: "scroll", targetId: "selecao", iconName: "steak" },
  { key: "assinaturas", label: "Assinaturas", type: "scroll", targetId: "assinaturas", iconName: "list" },
  { key: "beneficios", label: "Benefícios", type: "scroll", targetId: "beneficios", iconName: "gift" },
  { key: "faq", label: "FAQ", type: "scroll", targetId: "faq", iconName: "question" }
];

// Navegacao do portal logado: loja primeiro, conta depois.
export const portalNavigation: NavItemConfig[] = [
  { key: "home", label: clientPtBR.navigation.home, type: "route", routeKey: "home", iconName: "flame" },
  { key: "cortes", label: clientPtBR.navigation.cortes, type: "route", routeKey: "cortes", iconName: "store" },
  { key: "minhaCaixa", label: clientPtBR.navigation.royalBox, type: "route", routeKey: "minhaCaixa", iconName: "box" },
  { key: "royalDelivery", label: clientPtBR.navigation.royalDelivery, type: "route", routeKey: "royalDelivery", iconName: "truck" },
  { key: "meuClube", label: clientPtBR.navigation.minhaConta, type: "route", routeKey: "meuClube", iconName: "user" }
];
