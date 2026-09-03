export const adminRoutes = {
  dashboard: "/admin",
  produtos: "/produtos",
  usuarios: "/usuarios",
  assinaturas: "/assinaturas",
  pedidos: "/pedidos",
  deliveries: "/deliveries",
  configuracoes: "/configuracoes"
};

export const adminRouteAliases: Record<string, string> = {
  "/admin": "dashboard",
  "/": "dashboard",
  "/dashboard": "dashboard",
  "/produtos": "produtos",
  "/cortes": "produtos",
  "/admin/produtos": "produtos",
  "/usuarios": "usuarios",
  "/subscribers": "usuarios",
  "/socios": "usuarios",
  "/admin/assinantes": "usuarios",
  "/assinaturas": "assinaturas",
  "/admin/assinaturas": "assinaturas",
  "/pedidos": "pedidos",
  "/orders": "pedidos",
  "/admin/pedidos": "pedidos",
  "/deliveries": "deliveries",
  "/admin/expedicao": "deliveries",
  "/caixas": "deliveries",
  "/configuracoes": "configuracoes",
  "/settings": "configuracoes"
};

export function getRoutePathByAction(routeKey: string, action: string) {
  const basePath = adminRoutes[routeKey as keyof typeof adminRoutes] || "/admin";
  if (action === "create") return `${basePath}/novo`;
  if (action === "detail") return `${basePath}/detalhes`;
  return basePath;
}
