import { mockAdminSubscribers } from "../../mocks/subscribers.mock";

export const sociosConfig = {
  screenKey: "socios",
  titleKey: "socios.title",
  subtitleKey: "socios.subtitle",
  entityName: "Sócio",
  actionLabelKey: "+ Novo Sócio",
  columns: [
    { key: "customerName", labelKey: "socios.tableHeaders.customerName" },
    { key: "planName", labelKey: "socios.tableHeaders.planName" },
    {
      key: "priceMonthly",
      labelKey: "socios.tableHeaders.priceMonthly",
      render: (row) => `R$ ${row.priceMonthly?.toFixed(2)}`
    },
    { key: "status", labelKey: "socios.tableHeaders.status" },
    { key: "joinedDate", labelKey: "socios.tableHeaders.joinedDate" }
  ],
  filters: [
    {
      key: "status",
      labelKey: "Status Contrato",
      options: [
        { value: "active", labelKey: "Ativo" },
        { value: "paused", labelKey: "Pausado" }
      ]
    }
  ],
  form: {
    fields: [
      { key: "customerName", labelKey: "Nome do Cliente", required: true },
      { key: "email", labelKey: "E-mail de Contato" },
      { key: "planName", labelKey: "Plano Assinado" },
      { key: "priceMonthly", labelKey: "Valor Mensal (R$)" }
    ]
  },
  rows: mockAdminSubscribers
};
