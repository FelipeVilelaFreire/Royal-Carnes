import { mockAdminDeliveries } from "../../mocks/deliveries.mock";

export const caixasConfig = {
  screenKey: "caixas",
  titleKey: "caixas.title",
  subtitleKey: "caixas.subtitle",
  entityName: "Caixa Térmica",
  actionLabelKey: "caixas.ctaBatchDispatch",
  columns: [
    { key: "id", labelKey: "caixas.tableHeaders.id" },
    { key: "customerName", labelKey: "caixas.tableHeaders.customerName" },
    { key: "planName", labelKey: "caixas.tableHeaders.planName" },
    { key: "status", labelKey: "caixas.tableHeaders.status" },
    { key: "scheduledDate", labelKey: "caixas.tableHeaders.scheduledDate" }
  ],
  filters: [
    {
      key: "status",
      labelKey: "Status Envio",
      options: [
        { value: "packing", labelKey: "Embalagem" },
        { value: "pending", labelKey: "Pendente" }
      ]
    }
  ],
  form: {
    fields: [
      { key: "customerName", labelKey: "Assinante", required: true },
      { key: "planName", labelKey: "Plano" },
      { key: "scheduledDate", labelKey: "Data Agendada" },
      { key: "address", labelKey: "Endereço de Entrega", type: "textarea" }
    ]
  },
  rows: mockAdminDeliveries
};
