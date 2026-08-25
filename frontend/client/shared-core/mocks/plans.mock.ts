import { SubscriptionPlan } from "../../contracts";

export const mockPlans: SubscriptionPlan[] = [
  {
    id: "plan-basic",
    key: "basic",
    name: "Basic",
    tagline: "Assinatura fechada para o churrasco essencial",
    priceMonthly: 300.00,
    priceAnnual: 289.00,
    features: [
      "Escolha 4 produtos do grupo Basic",
      "Produtos de melhor custo-beneficio",
      "Formato de recebimento por produto",
      "Pagamento mensal ou anual"
    ]
  },
  {
    id: "plan-premium",
    key: "premium",
    name: "Premium",
    tagline: "Produtos nobres, carvao incluso e temperos selecionados",
    priceMonthly: 500.00,
    priceAnnual: 489.00,
    recommended: true,
    features: [
      "Escolha 6 produtos dos grupos Basic e Premium",
      "Inclui Picanha e Contra file",
      "Inclui 2 pacotes de carvao",
      "Escolha ate 2 temperos"
    ]
  },
  {
    id: "plan-pro",
    key: "pro",
    name: "Pro",
    tagline: "Experiencia completa com linha nobre e utensilio incluso",
    priceMonthly: 800.00,
    priceAnnual: 789.00,
    features: [
      "Escolha 8 produtos dos grupos Basic, Premium e Pro",
      "Inclui Chorizo e produtos especiais",
      "Escolha ate 5 pacotes de carvao",
      "Recebe Faca Royal no pacote"
    ]
  }
];
