import { mockAdminDeliveries } from "../../mocks/deliveries.mock";

export const caixasConfig = {
  screenKey: "caixas",
  title: "Central de Expedição & Caixas Térmicas",
  subtitle: "Fila de embalagem a vácuo, controle de temperatura -2°C e códigos de rastreio",
  columns: [
    { key: "id", label: "Caixa #" },
    { key: "customerName", label: "Assinante" },
    { key: "planName", label: "Plano" },
    { key: "status", label: "Status Envio" },
    { key: "scheduledDate", label: "Data Agendada" },
  ],
  rows: mockAdminDeliveries
};
