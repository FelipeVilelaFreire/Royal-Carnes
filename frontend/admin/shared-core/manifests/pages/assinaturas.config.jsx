import { catalogSubscriptionPlansMock } from "../../../../client/shared-core/mocks/catalog/plans.mock";

export const assinaturasConfig = {
  screenKey: "assinaturas",
  titleKey: "assinaturas.title",
  subtitleKey: "assinaturas.subtitle",
  entityName: "Plano de Assinatura",
  actionLabelKey: "assinaturas.ctaAdd",
  columns: [
    { key: "name", labelKey: "Plano" },
    { key: "subtitle", labelKey: "Descrição / Inclusões" },
    { key: "proteinKgLimitFormatted", labelKey: "Proteínas" },
    { key: "charcoalKgLimitFormatted", labelKey: "Carvão" },
    { key: "monthlyPriceFormatted", labelKey: "Preço Mensal" },
    { key: "annualMonthlyPriceFormatted", labelKey: "Preço Anual" }
  ],
  filters: [
    {
      key: "key",
      labelKey: "Tipo de Plano",
      options: [
        { value: "basic", labelKey: "Basic" },
        { value: "premium", labelKey: "Premium" },
        { value: "pro", labelKey: "Pro" }
      ]
    }
  ],
  form: {
    fields: [
      { key: "name", labelKey: "Nome do Plano", required: true },
      { key: "subtitle", labelKey: "Descrição", type: "textarea" },
      { key: "monthlyPrice", labelKey: "Preço Mensal (R$)" },
      { key: "annualMonthlyPrice", labelKey: "Preço Anual (R$)" }
    ]
  },
  rows: catalogSubscriptionPlansMock.map((plan) => ({
    id: plan.id,
    key: plan.key,
    name: `Plano ${plan.name}`,
    subtitle: plan.subtitle,
    proteinKgLimitFormatted: `${plan.proteinKgLimit}kg de carnes`,
    charcoalKgLimitFormatted: `${plan.charcoalKgLimit}kg de carvão`,
    monthlyPriceFormatted: `R$ ${plan.monthlyPrice.toFixed(2)}/mês`,
    annualMonthlyPriceFormatted: `R$ ${plan.annualMonthlyPrice.toFixed(2)} no anual`
  }))
};
