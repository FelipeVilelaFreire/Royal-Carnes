import { clientRoutes } from "../routes";

export type PortalScreenKey =
  | "home"
  | "cortes"
  | "produtos"
  | "meusPedidos"
  | "minhaConta";

export const portalRouteAliases: Record<PortalScreenKey, string[]> = {
  home: [clientRoutes.home],
  cortes: [clientRoutes.cortes],
  produtos: [clientRoutes.produtos],
  meusPedidos: [clientRoutes.meusPedidos],
  minhaConta: [clientRoutes.minhaConta],
};

export const resolvePortalScreenKeyFromPath = (
  path: string | null | undefined,
  fallback: PortalScreenKey = "home",
): PortalScreenKey => {
  if (!path) return fallback;
  const found = Object.entries(portalRouteAliases).find(([, aliases]) => aliases.includes(path));
  return (found?.[0] as PortalScreenKey | undefined) || fallback;
};
