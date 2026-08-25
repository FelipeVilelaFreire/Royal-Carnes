import { mockAdminSubscribers } from "../../mocks/subscribers.mock";

export const sociosConfig = {
  screenKey: "socios",
  title: "Gestão de Sócios Assinantes",
  subtitle: "Contratos ativos, histórico de cobranças e controle de retenção",
  columns: [
    { key: "customerName", label: "Cliente" },
    { key: "planName", label: "Plano" },
    { key: "priceMonthly", label: "Valor Mensal" },
    { key: "status", label: "Status" },
    { key: "joinedDate", label: "Data de Início" },
  ],
  rows: mockAdminSubscribers
};
