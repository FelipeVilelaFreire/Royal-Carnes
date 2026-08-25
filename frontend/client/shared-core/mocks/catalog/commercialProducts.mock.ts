import { ProductFlowMock } from "./types";

export const commercialProductsMock: ProductFlowMock[] = [
  {
    id: "subscription",
    name: "Assinatura fechada",
    kind: "fixedSubscription",
    billingLabel: "Mensal ou anual",
    billingModes: ["monthly", "annual"],
    description: "Produto comercial com planos prontos: Basic, Premium e Pro. O cliente escolhe um plano, seleciona os produtos permitidos e recebe de forma recorrente.",
    productScope: "planLimited",
    shipping: "included",
    recurrence: {
      enabled: true,
      frequency: "monthly",
      defaultDeliveryDayOfMonth: 10,
      allowsDeliveryDayChoice: true
    },
    hasSubscriptionPlans: true,
    requiresAddress: true,
    allowsRepeatLastOrder: false,
    allowsCustomAddress: false,
    allowsUtensils: false,
    allowsUnlimitedCharcoal: false,
    priceBehavior: "fixedPlan"
  },
  {
    id: "royalBox",
    name: "Royal Box",
    kind: "customSubscription",
    billingLabel: "Mensal",
    billingModes: ["monthly"],
    description: "Assinatura a escolha. O cliente monta uma caixa personalizada uma vez e essa composicao passa a ser entregue todo mes no dia definido.",
    productScope: "fullCatalog",
    shipping: "included",
    recurrence: {
      enabled: true,
      frequency: "monthly",
      defaultDeliveryDayOfMonth: 10,
      allowsDeliveryDayChoice: true
    },
    hasSubscriptionPlans: false,
    requiresAddress: true,
    allowsRepeatLastOrder: false,
    allowsCustomAddress: false,
    allowsUtensils: true,
    allowsUnlimitedCharcoal: true,
    priceBehavior: "selectedProducts"
  },
  {
    id: "royalDelivery",
    name: "Royal Delivery",
    kind: "oneTimeOrder",
    billingLabel: "Avulso",
    billingModes: ["oneTime"],
    description: "Pedido avulso. A montagem e parecida com a Royal Box, mas sem recorrencia e com preco de delivery.",
    productScope: "fullCatalog",
    shipping: "customerChoice",
    recurrence: {
      enabled: false
    },
    hasSubscriptionPlans: false,
    requiresAddress: true,
    allowsRepeatLastOrder: true,
    allowsCustomAddress: true,
    allowsUtensils: true,
    allowsUnlimitedCharcoal: true,
    priceBehavior: "selectedProductsWithDeliveryMarkup"
  }
];

export const productFlowsMock = commercialProductsMock;
