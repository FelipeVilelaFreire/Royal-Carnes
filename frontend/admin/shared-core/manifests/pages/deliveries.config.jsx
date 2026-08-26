import { mockAdminDeliveries } from "../../mocks/deliveries.mock";

export const deliveriesConfig = {
  screenKey: "deliveries",
  titleKey: "deliveries.title",
  subtitleKey: "deliveries.subtitle",
  entityName: "Entrega",
  actionLabelKey: "deliveries.ctaBatchDispatch",
  columns: [
    { key: "id", labelKey: "deliveries.tableHeaders.id" },
    { key: "customerName", labelKey: "deliveries.tableHeaders.customerName" },
    { key: "planName", labelKey: "deliveries.tableHeaders.planName" },
    { key: "status", labelKey: "deliveries.tableHeaders.status" },
    { key: "scheduledDate", labelKey: "deliveries.tableHeaders.scheduledDate" }
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
