import { catalogSubscriptionPlansMock } from "../../../../client/shared-core/mocks/catalog/plans.mock";

export const assinaturasConfig = {
  screenKey: "assinaturas",
  titleKey: "assinaturas.title",
  subtitleKey: "assinaturas.subtitle",
  entityNameKey: "entities.subscriptionPlan",
  actionLabelKey: "assinaturas.ctaAdd",
  dataSource: { key: "assinaturas", fallbackOnError: false },
  columns: [
    { key: "name", labelKey: "assinaturas.tableHeaders.name" },
    { key: "subtitle", labelKey: "assinaturas.tableHeaders.subtitle" },
    { key: "proteinKgLimitFormatted", labelKey: "assinaturas.tableHeaders.protein" },
    { key: "charcoalKgLimitFormatted", labelKey: "assinaturas.tableHeaders.charcoal" },
    { key: "monthlyPriceFormatted", labelKey: "assinaturas.tableHeaders.monthlyPrice" },
    { key: "annualMonthlyPriceFormatted", labelKey: "assinaturas.tableHeaders.annualPrice" },
  ],
  filters: [
    {
      key: "key",
      labelKey: "assinaturas.filters.planType",
      options: [
        { value: "basic", labelKey: "assinaturas.filterOptions.basic" },
        { value: "premium", labelKey: "assinaturas.filterOptions.premium" },
        { value: "pro", labelKey: "assinaturas.filterOptions.pro" },
      ],
    },
  ],
  form: {
    fields: [
      { key: "name", labelKey: "assinaturas.form.name", required: true },
      { key: "subtitle", labelKey: "assinaturas.form.subtitle", type: "textarea" },
      { key: "monthlyPrice", labelKey: "assinaturas.form.monthlyPrice" },
      { key: "annualMonthlyPrice", labelKey: "assinaturas.form.annualMonthlyPrice" },
    ],
  },
  rows: catalogSubscriptionPlansMock.map((plan) => ({
    annualMonthlyPriceFormatted: `R$ ${plan.annualMonthlyPrice.toFixed(2)} no anual`,
    charcoalKgLimitFormatted: `${plan.charcoalKgLimit}kg de carvão`,
    id: plan.id,
    key: plan.key,
    monthlyPriceFormatted: `R$ ${plan.monthlyPrice.toFixed(2)}/mês`,
    name: `Plano ${plan.name}`,
    proteinKgLimitFormatted: `${plan.proteinKgLimit}kg de carnes`,
    subtitle: plan.subtitle,
  })),
};
