export const adminRoutes = {
  dashboard: "/admin",
  pedidos: "/pedidos",
  deliveries: "/deliveries",
  estoque: "/estoque",
  produtos: "/produtos",
  categorias: "/categorias",
  colecoes: "/colecoes",
  planos: "/planos",
  assinaturas: "/assinaturas",
  clientes: "/clientes",
  pagamentos: "/pagamentos",
  usuarios: "/usuarios",
  configuracoes: "/configuracoes"
};

export const adminRouteAliases: Record<string, string> = {
  "/admin": "dashboard",
  "/": "dashboard",
  "/dashboard": "dashboard",
  "/pedidos": "pedidos",
  "/orders": "pedidos",
  "/admin/pedidos": "pedidos",
  "/deliveries": "deliveries",
  "/admin/expedicao": "deliveries",
  "/caixas": "deliveries",
  "/estoque": "estoque",
  "/inventory": "estoque",
  "/produtos": "produtos",
  "/cortes": "produtos",
  "/admin/produtos": "produtos",
  "/categorias": "categorias",
  "/categories": "categorias",
  "/colecoes": "colecoes",
  "/collections": "colecoes",
  "/planos": "planos",
  "/plans": "planos",
  "/clientes": "clientes",
  "/customers": "clientes",
  "/assinaturas": "assinaturas",
  "/admin/assinaturas": "assinaturas",
  "/subscriptions": "assinaturas",
  "/pagamentos": "pagamentos",
  "/payments": "pagamentos",
  "/usuarios": "usuarios",
  "/users": "usuarios",
  "/subscribers": "assinaturas",
  "/socios": "clientes",
  "/admin/assinantes": "assinaturas",
  "/configuracoes": "configuracoes",
  "/settings": "configuracoes"
};

export function getRoutePathByAction(routeKey: string, action: string) {
  const basePath = adminRoutes[routeKey as keyof typeof adminRoutes] || "/admin";
  if (action === "create") return `${basePath}/novo`;
  if (action === "detail") return `${basePath}/detalhes`;
  return basePath;
}
