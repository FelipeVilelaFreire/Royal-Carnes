import { clientRoutes } from "../routes";

export type PortalScreenKey =
  | "home"
  | "homeTeste1"
  | "homeTeste2"
  | "homeTeste3"
  | "homeTeste4"
  | "homeTeste5"
  | "homeTeste6"
  | "homeTeste7"
  | "homeTeste8"
  | "meusPedidosTeste1"
  | "meusPedidosTeste2"
  | "meusPedidosTeste3"
  | "meusPedidosTeste4"
  | "meusPedidosTeste5"
  | "landingTeste1"
  | "landingTeste2"
  | "landingTeste3"
  | "landingTeste4"
  | "landingTeste5"
  | "library"
  | "catalogo"
  | "catalogoTeste1"
  | "produtos"
  | "meusPedidos"
  | "minhaConta";

export const portalRouteAliases: Record<PortalScreenKey, string[]> = {
  home: [clientRoutes.home],
  homeTeste1: [clientRoutes.homeTeste1],
  homeTeste2: [clientRoutes.homeTeste2],
  homeTeste3: [clientRoutes.homeTeste3],
  homeTeste4: [clientRoutes.homeTeste4],
  homeTeste5: [clientRoutes.homeTeste5],
  homeTeste6: [clientRoutes.homeTeste6],
  homeTeste7: [clientRoutes.homeTeste7],
  homeTeste8: [clientRoutes.homeTeste8],
  meusPedidosTeste1: [clientRoutes.meusPedidosTeste1],
  meusPedidosTeste2: [clientRoutes.meusPedidosTeste2],
  meusPedidosTeste3: [clientRoutes.meusPedidosTeste3],
  meusPedidosTeste4: [clientRoutes.meusPedidosTeste4],
  meusPedidosTeste5: [clientRoutes.meusPedidosTeste5],
  landingTeste1: [clientRoutes.landingTeste1],
  landingTeste2: [clientRoutes.landingTeste2],
  landingTeste3: [clientRoutes.landingTeste3],
  landingTeste4: [clientRoutes.landingTeste4],
  landingTeste5: [clientRoutes.landingTeste5],
  library: [clientRoutes.library],
  catalogo: [clientRoutes.catalogo, "/cortes"],
  catalogoTeste1: [clientRoutes.catalogoTeste1],
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
