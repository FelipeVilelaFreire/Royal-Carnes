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
    productSelectionLimit: 4,
    allowedPlanTiers: ["basic"],
    includedCharcoalPackages: 0,
    seasoningSelectionLimit: 0,
    includesUtensilProductIds: [],
    shipping: "included",
    description: "Plano promocional com produtos de entrada e escolha do formato de recebimento.",
    features: [
      "Escolha 4 produtos do grupo Basic",
      "Produtos com melhor custo-beneficio",
      "Formato de recebimento por produto",
      "Pagamento mensal ou anual"
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
    productSelectionLimit: 6,
    allowedPlanTiers: ["basic", "premium"],
    includedCharcoalPackages: 2,
    seasoningSelectionLimit: 2,
    includesUtensilProductIds: [],
    shipping: "included",
    description: "Plano com os produtos Basic, cortes premium, carvao incluso e selecao de temperos.",
    features: [
      "Escolha 6 produtos dos grupos Basic e Premium",
      "Inclui Picanha e Contra file",
      "Inclui 2 pacotes de carvao",
      "Escolha ate 2 temperos",
      "Formato de recebimento por produto"
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
    allowedPlanTiers: ["basic", "premium", "pro"],
    includedCharcoalPackages: 0,
    charcoalMaxQuantity: 5,
    seasoningSelectionLimit: 4,
    includesUtensilProductIds: ["product-faca-royal"],
    shipping: "included",
    description: "Plano com todo o catalogo de assinatura, produtos especiais, utensilio incluso e maior liberdade de complementos.",
    features: [
      "Escolha 8 produtos dos grupos Basic, Premium e Pro",
      "Inclui Chorizo e produtos especiais",
      "Escolha ate 5 pacotes de carvao",
      "Escolha ate 4 temperos",
      "Recebe Faca Royal no pacote"
    ]
  }
];
