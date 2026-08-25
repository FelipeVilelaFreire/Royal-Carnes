import { SubscriptionPlanMock } from "./types";
export { commercialProductsMock, productFlowsMock } from "./commercialProducts.mock";

export const catalogSubscriptionPlansMock: SubscriptionPlanMock[] = [
  {
    id: "subscription-basic",
    key: "basic",
    name: "Basic",
    subtitle: "Assinatura fechada para o churrasco essencial.",
    monthlyPrice: 300,
    annualMonthlyPrice: 289,
    billingModes: ["monthly", "annual"],
    productSelectionLimit: 3,
    proteinKgLimit: 3,
    allowedPlanTiers: ["basic"],
    includedCharcoalPackages: 1,
    charcoalKgLimit: 3,
    seasoningSelectionLimit: 1,
    sideSelectionLimit: 0,
    utensilSelectionLimit: 0,
    includesUtensilProductIds: [],
    shipping: "included",
    description: "Plano promocional para churrasco simples, com proteina, carvao e tempero base.",
    features: [
      "Ate 3 kg de proteina do grupo Basic",
      "Inclui 3 kg de carvao",
      "Inclui 1 tempero base",
      "Formato de recebimento por produto"
    ]
  },
  {
    id: "subscription-premium",
    key: "premium",
    name: "Premium",
    subtitle: "Assinatura fechada com produtos nobres e complementos.",
    monthlyPrice: 500,
    annualMonthlyPrice: 489,
    billingModes: ["monthly", "annual"],
    productSelectionLimit: 5,
    proteinKgLimit: 5,
    allowedPlanTiers: ["basic", "premium"],
    includedCharcoalPackages: 1,
    charcoalKgLimit: 5,
    seasoningSelectionLimit: 2,
    sideSelectionLimit: 1,
    utensilSelectionLimit: 0,
    includesUtensilProductIds: [],
    shipping: "included",
    description: "Plano com cortes premium, carvao suficiente e acompanhamentos para um churrasco completo.",
    features: [
      "Ate 5 kg de proteina dos grupos Basic e Premium",
      "Libera Picanha, Contra file, Baby beef e Ancho",
      "Inclui 5 kg de carvao",
      "Escolha ate 2 temperos",
      "Inclui 1 acompanhamento simples"
    ]
  },
  {
    id: "subscription-pro",
    key: "pro",
    name: "Pro",
    subtitle: "Assinatura fechada para experiencia completa.",
    monthlyPrice: 800,
    annualMonthlyPrice: 789,
    billingModes: ["monthly", "annual"],
    productSelectionLimit: 8,
    proteinKgLimit: 8,
    allowedPlanTiers: ["basic", "premium", "pro"],
    includedCharcoalPackages: 0,
    charcoalMaxQuantity: 10,
    charcoalKgLimit: 10,
    seasoningSelectionLimit: 4,
    sideSelectionLimit: 2,
    utensilSelectionLimit: 1,
    includesUtensilProductIds: ["product-faca-royal"],
    shipping: "included",
    description: "Plano com todo o catalogo de assinatura, produtos especiais, utensilio incluso e maior liberdade de complementos.",
    features: [
      "Ate 8 kg de proteina dos grupos Basic, Premium e Pro",
      "Libera Chorizo, Prime rib e produtos especiais",
      "Inclui ate 10 kg de carvao ou briquete",
      "Escolha ate 4 temperos e 2 acompanhamentos",
      "Inclui 1 utensilio Royal"
    ]
  }
];
