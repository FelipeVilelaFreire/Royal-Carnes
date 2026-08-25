export const adminRoutes = {
  dashboard: "/admin",
  subscribers: "/admin/assinantes",
  subscriberDetail: "/admin/assinantes/:id",
  deliveries: "/admin/expedicao",
  plans: "/admin/planos"
};

export function getRoutePathByAction(routeKey: string, action: string) {
  const basePath = adminRoutes[routeKey as keyof typeof adminRoutes] || "/admin";
  if (action === "create") return `${basePath}/novo`;
  if (action === "detail") return `${basePath}/detalhes`;
  return basePath;
}
