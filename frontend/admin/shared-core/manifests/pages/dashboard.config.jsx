import { mockAdminDashboard } from "../../mocks/dashboard.mock";

export const dashboardConfig = {
  screenKey: "dashboard",
  titleKey: "Dashboard Operacional",
  subtitleKey: "Visão executiva de faturamento recorrente (MRR), assinantes e entregas",
  widgets: [
    { key: "mrr", titleKey: "MRR", value: `R$ ${(mockAdminDashboard.mrrCents / 100).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, helper: "+12.4% este mês" },
    { key: "subscribers", titleKey: "Assinantes Ativos", value: String(mockAdminDashboard.activeSubscribersCount), helper: "+8 novos este mês" },
    { key: "deliveries", titleKey: "Caixas na Fila", value: String(mockAdminDashboard.pendingDeliveriesCount), helper: "Envio nesta semana" },
    { key: "churn", titleKey: "Taxa de Retenção", value: `${(100 - mockAdminDashboard.churnRatePercent).toFixed(1)}%`, helper: `Churn de ${mockAdminDashboard.churnRatePercent}%` }
  ]
};
