import { mockAdminSubscriptions } from "../../mocks/subscriptions.mock";

export const assinaturasConfig = {
  screenKey: "assinaturas",
  titleKey: "assinaturas.title",
  subtitleKey: "assinaturas.subtitle",
  entityName: "Assinatura Royal Box",
  actionLabelKey: "assinaturas.ctaAdd",
  columns: [
    { key: "customerName", labelKey: "assinaturas.tableHeaders.customerName" },
    { key: "planName", labelKey: "assinaturas.tableHeaders.planName" },
    { key: "priceMonthlyFormatted", labelKey: "assinaturas.tableHeaders.priceMonthly" },
    { key: "cycleCurrent", labelKey: "assinaturas.tableHeaders.cycleCurrent" },
    { key: "nextBillingDate", labelKey: "assinaturas.tableHeaders.nextBillingDate" },
    { key: "statusLabel", labelKey: "assinaturas.tableHeaders.status" }
  ],
  filters: [
    {
      key: "status",
      labelKey: "Status",
      options: [
        { value: "active", labelKey: "Ativo" },
        { value: "paused", labelKey: "Pausado" }
      ]
    }
  ],
  form: {
    fields: [
      { key: "customerName", labelKey: "Nome do Cliente", required: true },
      { key: "planName", labelKey: "Plano Assinado", required: true },
      { key: "priceMonthly", labelKey: "Valor Mensal (R$)" }
    ]
  },
  rows: mockAdminSubscriptions.map((sub) => ({
    ...sub,
    priceMonthlyFormatted: `R$ ${sub.priceMonthly?.toFixed(2)}`,
    statusLabel: sub.status === "active" ? "Ativo" : "Pausado"
  }))
};
