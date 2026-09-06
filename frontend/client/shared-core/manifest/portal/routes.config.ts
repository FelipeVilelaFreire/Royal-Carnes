import { clientRoutes } from "../routes";

export type PortalScreenKey =
  | "home"
  | "cortes"
  | "produtos"
  | "minhaCaixa"
  | "royalDelivery"
  | "meuClube"
  | "meusPedidos"
  | "minhaConta";

export const portalRouteAliases: Record<PortalScreenKey, string[]> = {
  home: [clientRoutes.home, "/portal-home"],
  cortes: [clientRoutes.cortes, "/portal-cortes"],
  produtos: [clientRoutes.produtos],
  minhaCaixa: [clientRoutes.minhaCaixa, "/portal-minha-caixa"],
  royalDelivery: [clientRoutes.royalDelivery],
  meuClube: [clientRoutes.meuClube, "/minha-assinatura"],
  meusPedidos: [clientRoutes.meusPedidos],
  minhaConta: [clientRoutes.minhaConta, "/minha-conta", "/portal-minha-conta"],
};

export const resolvePortalScreenKeyFromPath = (
  path: string | null | undefined,
  fallback: PortalScreenKey = "home",
): PortalScreenKey => {
  if (!path) return fallback;
  const found = Object.entries(portalRouteAliases).find(([, aliases]) => aliases.includes(path));
  return (found?.[0] as PortalScreenKey | undefined) || fallback;
};
