import type {
  ClientPlanView,
  ClientSubscriptionCycleView,
  ClientSubscriptionView,
} from "../contracts/subscriptions.contract";
import { productCategoriesMock } from "../mocks/catalog/categories.mock";
import { catalogSubscriptionPlansMock } from "../mocks/catalog/plans.mock";
import { productsMock } from "../mocks/catalog/products.mock";
import { royalCustomerMock } from "../mocks/customer.mock";

const formatMoney = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(value);

const activePlanMock =
  catalogSubscriptionPlansMock.find((plan) => plan.key === royalCustomerMock.activeSubscription?.planKey) ||
  catalogSubscriptionPlansMock[0];

const categoryById = new Map(productCategoriesMock.map((category) => [category.id, category]));

const toPlanView = (plan: typeof catalogSubscriptionPlansMock[number]): ClientPlanView => ({
  id: plan.id,
  key: plan.key,
  name: plan.name,
  description: plan.description,
  status: "active",
  billingInterval: "month",
  trialDays: 0,
  sortOrder: catalogSubscriptionPlansMock.indexOf(plan) + 1,
  prices: [
    {
      id: `${plan.id}-monthly`,
      amountCents: Math.round(plan.monthlyPrice * 100),
      billingInterval: "month",
      billingIntervalCount: 1,
      currency: "BRL",
      priceType: "recurring",
    },
  ],
  entitlements: [
    {
      id: `${plan.id}-cuts`,
      key: "cuts",
      targetType: "category",
      targetKey: "meat",
      targetName: "Cortes",
      quantity: String(plan.productSelectionLimit),
      measurementUnitKey: "unit",
      measurementUnitSymbol: "un.",
      constraints: {
        maxSelections: plan.productSelectionLimit,
        weightKgLimit: plan.proteinKgLimit,
      },
      sortOrder: 10,
    },
    {
      id: `${plan.id}-protein`,
      key: "protein",
      targetType: "category",
      targetKey: "meat",
      targetName: "Proteina",
      quantity: String(plan.proteinKgLimit),
      measurementUnitKey: "kg",
      measurementUnitSymbol: "kg",
      constraints: {
        maxQuantity: plan.proteinKgLimit,
      },
      sortOrder: 20,
    },
    {
      id: `${plan.id}-charcoal`,
      key: "charcoal",
      targetType: "category",
      targetKey: "charcoal",
      targetName: "Carvao",
      quantity: String(plan.charcoalKgLimit),
      measurementUnitKey: "kg",
      measurementUnitSymbol: "kg",
      constraints: {
        maxQuantity: plan.charcoalKgLimit,
      },
      sortOrder: 30,
    },
    {
      id: `${plan.id}-seasonings`,
      key: "seasonings",
      targetType: "category",
      targetKey: "seasoning",
      targetName: "Temperos",
      quantity: String(plan.seasoningSelectionLimit),
      measurementUnitKey: "unit",
      measurementUnitSymbol: "un.",
      constraints: {
        maxSelections: plan.seasoningSelectionLimit,
      },
      sortOrder: 40,
    },
    {
      id: `${plan.id}-sides`,
      key: "sides",
      targetType: "category",
      targetKey: "side",
      targetName: "Acompanhamentos",
      quantity: String(plan.sideSelectionLimit),
      measurementUnitKey: "unit",
      measurementUnitSymbol: "un.",
      constraints: {
        maxSelections: plan.sideSelectionLimit,
      },
      sortOrder: 50,
    },
    {
      id: `${plan.id}-utensils`,
      key: "utensils",
      targetType: "category",
      targetKey: "utensil",
      targetName: "Utensilios",
      quantity: String(plan.utensilSelectionLimit),
      measurementUnitKey: "unit",
      measurementUnitSymbol: "un.",
      constraints: {
        maxSelections: plan.utensilSelectionLimit,
      },
      sortOrder: 60,
    },
  ],
});

const plan = toPlanView(activePlanMock);
const selectedProducts = ["product-picanha", "product-baby-beef", "product-carvao-eucalipto", "product-sal-parrilla"]
  .map((productId) => productsMock.find((product) => product.id === productId))
  .filter(Boolean);

export const subscriptionsFallbackDataSource: {
  plans: ClientPlanView[];
  subscription: ClientSubscriptionView | null;
  cycle: ClientSubscriptionCycleView | null;
  eligibleProducts: Array<{
    id: string;
    key: string;
    entitlementKey: string;
    measurementUnitKey: string;
    quantity: string;
    name: string;
    description: string;
    categoryLabel: string;
    imageUrl: string;
    unitLabel: string;
    weightLabel: string;
    priceLabel: string;
    stockStatus: string;
  }>;
} = {
  plans: catalogSubscriptionPlansMock.map(toPlanView),
  subscription: royalCustomerMock.activeSubscription
    ? {
        id: royalCustomerMock.activeSubscription.id,
        customerId: royalCustomerMock.id,
        customerName: royalCustomerMock.name,
        plan,
        status: "active",
        startedAt: "2026-08-12",
        currentCycleStartsAt: "2026-09-01",
        currentCycleEndsAt: "2026-09-12",
        cycles: [],
      }
    : null,
  cycle: {
    id: "cycle-royal-pro-2026-09",
    cycleNumber: 2,
    status: "open",
    startsAt: "2026-09-01",
    endsAt: "2026-09-12",
    closedAt: null,
    metadata: {
      usageLimits: {
        cuts: activePlanMock.productSelectionLimit,
        protein: activePlanMock.proteinKgLimit,
        charcoal: activePlanMock.charcoalKgLimit,
        seasonings: activePlanMock.seasoningSelectionLimit,
        sides: activePlanMock.sideSelectionLimit,
        utensils: activePlanMock.utensilSelectionLimit,
      },
    },
    items: selectedProducts.map((product, index) => ({
      id: `cycle-item-${product!.id}`,
      entitlementKey:
        product!.kind === "charcoal"
          ? "charcoal"
          : product!.kind === "seasoning"
            ? "seasonings"
            : product!.kind === "utensil"
              ? "utensils"
              : "cuts",
      productKey: product!.id,
      variantSku: product!.sku,
      quantity: product!.kind === "meat" ? "1" : "1",
      measurementUnitKey: product!.unit,
      status: index < 3 ? "selected" : "pending",
      metadata: {
        categoryLabel: categoryById.get(product!.categoryId)?.name || product!.categoryId,
        description: product!.description,
        imageUrl: product!.image,
        name: product!.name,
        priceLabel: formatMoney(product!.price),
        unitLabel: product!.weightLabel || product!.unit,
      },
    })),
  },
  eligibleProducts: productsMock
    .filter((product) => product.availableFor.includes("subscription"))
    .filter((product) => product.planTiers.includes(activePlanMock.key))
    .slice(0, 8)
    .map((product) => ({
      id: product.id,
      key: product.id,
      entitlementKey:
        product.kind === "charcoal"
          ? "charcoal"
          : product.kind === "seasoning"
            ? "seasonings"
            : product.kind === "utensil"
              ? "utensils"
              : "cuts",
      measurementUnitKey: product.unit,
      quantity: "1",
      name: product.name,
      description: product.description,
      categoryLabel: categoryById.get(product.categoryId)?.name || product.categoryId,
      imageUrl: product.image,
      unitLabel: product.weightLabel || product.unit,
      weightLabel: product.weightLabel || product.unit,
      priceLabel: formatMoney(product.price),
      stockStatus: product.stockStatus,
    })),
};
