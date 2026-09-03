import { mockAdminDashboard } from "../../mocks/dashboard.mock";
import { mockAdminDeliveries } from "../../mocks/deliveries.mock";

export const dashboardConfig = {
  screenKey: "dashboard",
  titleKey: "dashboard.title",
  subtitleKey: "dashboard.subtitle",
  widgets: [
    {
      key: "mrr",
      titleKey: "dashboard.kpis.mrr",
      value: `R$ ${(mockAdminDashboard.mrrCents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      helper: "+12.4% este mês"
    },
    {
      key: "subscribers",
      titleKey: "dashboard.kpis.activeSubscribers",
      value: String(mockAdminDashboard.activeSubscribersCount),
      helper: "+8 novos este mês"
    },
    {
      key: "deliveries",
      titleKey: "dashboard.kpis.pendingDeliveries",
      value: String(mockAdminDashboard.pendingDeliveriesCount),
      helper: "Envio nesta semana"
    },
    {
      key: "churn",
      titleKey: "dashboard.kpis.retentionRate",
      value: `${(100 - mockAdminDashboard.churnRatePercent).toFixed(1)}%`,
      helper: `Churn de ${mockAdminDashboard.churnRatePercent}%`
    }
  ],
  recentOrders: mockAdminDeliveries.map((item) => ({
    id: item.id,
    member: item.customerName,
    plan: item.planName,
    box: "Caixa Set/2026",
    status: item.status,
    date: item.scheduledDate,
    image: item.customerName.includes("Felipe")
      ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
      : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80"
  }))
};
