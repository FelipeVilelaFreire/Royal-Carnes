import type { ClientCheckoutConfig } from "../manifest/checkout.config";
import type {
  ClientCheckoutAddress,
  ClientCheckoutFreightOption,
  ClientCheckoutFreightOptionKey,
  ClientCheckoutPaymentMethod,
  ClientCheckoutPaymentMethodKey,
  ClientCheckoutProduct,
  ClientCheckoutProductCategory,
  ClientCheckoutProductExperience,
  ClientCheckoutSubscriptionPlan,
  ClientCheckoutSubscriptionTier,
} from "../contracts/checkout.contract";
export type {
  ClientCheckoutAddress,
  ClientCheckoutFreightOption,
  ClientCheckoutFreightOptionKey,
  ClientCheckoutPaymentMethod,
  ClientCheckoutPaymentMethodKey,
  ClientCheckoutProduct,
  ClientCheckoutProductCategory,
  ClientCheckoutProductExperience,
  ClientCheckoutSubscriptionPlan,
  ClientCheckoutSubscriptionTier,
} from "../contracts/checkout.contract";

export interface ClientCheckoutSelectedProductEntry {
  product: ClientCheckoutProduct;
  quantity: number;
}

export interface ClientCheckoutCycleUsage {
  cutsUsed: number;
  cutsLimit: number;
  weightKgUsed: number;
  weightKgLimit: number;
  charcoalKgUsed: number;
  charcoalKgLimit: number;
  seasoningsUsed: number;
  seasoningsLimit: number;
  sidesUsed: number;
  sidesLimit: number;
  utensilsUsed: number;
  utensilsLimit: number;
}

export interface ClientCheckoutViewModelInput {
  activeSubscription?: {
    id: string;
    planKey: ClientCheckoutSubscriptionTier;
    nextBillingLabel: string;
    nextDeliveryLabel: string;
  };
  activeCycleUsage?: ClientCheckoutCycleUsage | null;
  categories: ClientCheckoutProductCategory[];
  config: ClientCheckoutConfig;
  freightOptions: ClientCheckoutFreightOption[];
  freightPolicies: Record<ClientCheckoutProductExperience, { price: number; defaultOptionKey?: ClientCheckoutFreightOptionKey }>;
  paymentMethods: ClientCheckoutPaymentMethod[];
  plans: ClientCheckoutSubscriptionPlan[];
  products: ClientCheckoutProduct[];
  query: string;
  selectedAddressId: string;
  selectedCategoryId: string;
  selectedDeliveryDay: number;
  selectedFreight: ClientCheckoutFreightOptionKey | null;
  selectedInstallments: number;
  selectedMode: ClientCheckoutProductExperience | null;
  selectedPaymentMethod: ClientCheckoutPaymentMethodKey;
  selectedPlanKey: ClientCheckoutSubscriptionTier;
  selectedProductQuantities: Record<string, number>;
  addresses: ClientCheckoutAddress[];
}

export interface ClientCheckoutViewModel {
  activeCycleUsage: ClientCheckoutCycleUsage | null;
  activeSubscriptionLabel: string;
  activeSubscriptionPlan?: ClientCheckoutSubscriptionPlan;
  availableProducts: ClientCheckoutProduct[];
  categoryById: Map<string, ClientCheckoutProductCategory>;
  currentFreightOption?: ClientCheckoutFreightOption;
  currentFreightPrice: number;
  currentSubscriptionPlan: ClientCheckoutSubscriptionPlan;
  finalTotal: number;
  hasMode: boolean;
  orderEstimateTotal: number;
  paymentMethods: ClientCheckoutPaymentMethod[];
  selectedAddress?: ClientCheckoutAddress;
  selectedAddressSummary: string;
  selectedPayment?: ClientCheckoutPaymentMethod;
  selectedProductEntries: ClientCheckoutSelectedProductEntry[];
  selectedUnitsCount: number;
  selectedMeatUnitsCount: number;
  selectedProteinKg: number;
  selectedCharcoalKg: number;
  selectedSeasoningCount: number;
  selectedSideCount: number;
  selectedUtensilCount: number;
  subscriptionCycleCutsUsed: number;
  subscriptionCycleWeightUsed: number;
  subscriptionCycleCharcoalUsed: number;
  subscriptionCycleSeasoningsUsed: number;
  subscriptionCycleSidesUsed: number;
  subscriptionCycleUtensilsUsed: number;
  subscriptionSummaryUsage: ClientCheckoutCycleUsage | null;
  canAddProduct: (product: ClientCheckoutProduct) => boolean;
  getProductMeasure: (product: ClientCheckoutProduct) => number;
}

const formatAddressSummary = (address: ClientCheckoutAddress | undefined, fallback: string) =>
  address ? `${address.streetLine} - ${address.neighborhoodLine}` : fallback;

export const getClientCheckoutProductMeasure = (product: ClientCheckoutProduct) => {
  if (product.kind === "charcoal") {
    const kgMatch = product.weightLabel?.match(/(\d+(?:[.,]\d+)?)\s*kg/i);
    return kgMatch ? Number(kgMatch[1].replace(",", ".")) : 1;
  }
  return 1;
};

export const createClientCheckoutViewModel = ({
  activeCycleUsage,
  activeSubscription,
  addresses,
  categories,
  freightOptions,
  freightPolicies,
  paymentMethods,
  plans,
  products,
  query,
  selectedAddressId,
  selectedCategoryId,
  selectedFreight,
  selectedMode,
  selectedPaymentMethod,
  selectedPlanKey,
  selectedProductQuantities,
}: ClientCheckoutViewModelInput): ClientCheckoutViewModel => {
  const selectedPlan = plans.find((plan) => plan.key === selectedPlanKey) || plans[0] || {
    id: "", key: "", name: "", subtitle: "", monthlyPrice: 0, annualMonthlyPrice: 0,
    billingModes: [], productSelectionLimit: 0, proteinKgLimit: 0, allowedPlanTiers: [],
    includedCharcoalPackages: 0, charcoalKgLimit: 0, seasoningSelectionLimit: 0,
    sideSelectionLimit: 0, utensilSelectionLimit: 0, includesUtensilProductIds: [],
    shipping: "calculated" as const, description: "", features: [],
  };
  const activeSubscriptionPlan = activeSubscription
    ? plans.find((plan) => plan.key === activeSubscription.planKey)
    : undefined;
  const currentSubscriptionPlan =
    selectedMode === "subscription" && activeSubscriptionPlan ? activeSubscriptionPlan : selectedPlan;
  const subscriptionSummaryUsage = selectedMode === "subscription" && activeCycleUsage ? activeCycleUsage : null;
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const normalizedQuery = query.trim().toLowerCase();
  const availableProducts = products.filter((product) => {
    const isIncludedInSelectedPlan =
      selectedMode === "subscription" && product.includedInPlans?.includes(currentSubscriptionPlan.key);
    const matchesMode = selectedMode
      ? product.availableFor.includes(selectedMode) || Boolean(isIncludedInSelectedPlan)
      : true;
    const matchesPlan =
      selectedMode === "subscription"
        ? product.planTiers.some((tier) => currentSubscriptionPlan.allowedPlanTiers.includes(tier)) ||
          Boolean(isIncludedInSelectedPlan)
        : true;
    const matchesCategory = selectedCategoryId === "all" || product.categoryId === selectedCategoryId;
    const matchesQuery =
      !normalizedQuery ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery) ||
      product.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    return matchesMode && matchesPlan && matchesCategory && matchesQuery;
  });

  const selectedProductEntries = products
    .map((product) => ({
      product,
      quantity: selectedProductQuantities[product.id] || 0,
    }))
    .filter((entry) => entry.quantity > 0);
  const selectedUnitsCount = selectedProductEntries.reduce((total, entry) => total + entry.quantity, 0);
  const selectedMeatUnitsCount = selectedProductEntries
    .filter((entry) => entry.product.kind === "meat")
    .reduce((total, entry) => total + entry.quantity, 0);
  const selectedProteinKg = selectedProductEntries
    .filter((entry) => entry.product.kind === "meat")
    .reduce((total, entry) => total + entry.quantity, 0);
  const selectedCharcoalKg = selectedProductEntries
    .filter((entry) => entry.product.kind === "charcoal")
    .reduce((total, entry) => total + getClientCheckoutProductMeasure(entry.product) * entry.quantity, 0);
  const selectedSeasoningCount = selectedProductEntries
    .filter((entry) => entry.product.kind === "seasoning")
    .reduce((total, entry) => total + entry.quantity, 0);
  const selectedSideCount = selectedProductEntries
    .filter((entry) => entry.product.kind === "kit" && entry.product.tags.includes("acompanhamento"))
    .reduce((total, entry) => total + entry.quantity, 0);
  const selectedUtensilCount = selectedProductEntries
    .filter((entry) => entry.product.kind === "utensil")
    .reduce((total, entry) => total + entry.quantity, 0);
  const estimatedTotal = selectedProductEntries.reduce(
    (total, entry) => total + entry.product.price * entry.quantity,
    0,
  );
  const currentFreightPrice =
    selectedMode === "royalDelivery" && selectedFreight
      ? freightOptions.find((option) => option.key === selectedFreight)?.price || 0
      : selectedMode
        ? freightPolicies[selectedMode]?.price || 0
        : 0;
  const orderEstimateTotal =
    selectedMode === "royalDelivery" && selectedFreight
      ? estimatedTotal + currentFreightPrice
      : estimatedTotal;
  const finalTotal = selectedMode === "subscription" ? currentSubscriptionPlan.monthlyPrice : orderEstimateTotal;
  const selectedPayment = paymentMethods.find((method) => method.key === selectedPaymentMethod) || paymentMethods[0];
  const currentFreightOption = selectedFreight
    ? freightOptions.find((option) => option.key === selectedFreight)
    : undefined;
  const selectedAddress =
    addresses.find((address) => address.id === selectedAddressId) || addresses[0];

  const getSubscriptionKindLimit = (product: ClientCheckoutProduct) => {
    if (product.kind === "meat") return currentSubscriptionPlan.proteinKgLimit;
    if (product.kind === "charcoal") return currentSubscriptionPlan.charcoalKgLimit;
    if (product.kind === "seasoning") return currentSubscriptionPlan.seasoningSelectionLimit;
    if (product.kind === "kit" && product.tags.includes("acompanhamento")) return currentSubscriptionPlan.sideSelectionLimit;
    if (product.kind === "utensil") return currentSubscriptionPlan.utensilSelectionLimit;
    return currentSubscriptionPlan.productSelectionLimit;
  };

  const getSelectedKindCount = (product: ClientCheckoutProduct) => {
    if (product.kind === "meat") return selectedProteinKg;
    if (product.kind === "charcoal") return selectedCharcoalKg;
    if (product.kind === "seasoning") return selectedSeasoningCount;
    if (product.kind === "kit" && product.tags.includes("acompanhamento")) return selectedSideCount;
    if (product.kind === "utensil") return selectedUtensilCount;
    return selectedUnitsCount;
  };

  const getCycleUsedKindCount = (product: ClientCheckoutProduct) => {
    if (!subscriptionSummaryUsage) return 0;
    if (product.kind === "meat") return subscriptionSummaryUsage.weightKgUsed;
    if (product.kind === "charcoal") return subscriptionSummaryUsage.charcoalKgUsed;
    if (product.kind === "seasoning") return subscriptionSummaryUsage.seasoningsUsed;
    if (product.kind === "kit" && product.tags.includes("acompanhamento")) return subscriptionSummaryUsage.sidesUsed;
    if (product.kind === "utensil") return subscriptionSummaryUsage.utensilsUsed;
    return subscriptionSummaryUsage.cutsUsed;
  };

  const canAddProduct = (product: ClientCheckoutProduct) => {
    if (selectedMode !== "subscription") return true;
    const nextKindUsage =
      getCycleUsedKindCount(product) + getSelectedKindCount(product) + getClientCheckoutProductMeasure(product);
    if (nextKindUsage > getSubscriptionKindLimit(product)) return false;
    if (product.kind === "meat" && subscriptionSummaryUsage) {
      return subscriptionSummaryUsage.cutsUsed + selectedMeatUnitsCount + 1 <= subscriptionSummaryUsage.cutsLimit;
    }
    return true;
  };

  return {
    activeCycleUsage: activeCycleUsage || null,
    activeSubscriptionLabel: activeSubscriptionPlan ? `Royal ${activeSubscriptionPlan.name}` : "",
    activeSubscriptionPlan,
    availableProducts,
    categoryById,
    currentFreightOption,
    currentFreightPrice,
    currentSubscriptionPlan,
    finalTotal,
    hasMode: Boolean(selectedMode),
    orderEstimateTotal,
    paymentMethods,
    selectedAddress,
    selectedAddressSummary: formatAddressSummary(selectedAddress, ""),
    selectedPayment,
    selectedProductEntries,
    selectedUnitsCount,
    selectedMeatUnitsCount,
    selectedProteinKg,
    selectedCharcoalKg,
    selectedSeasoningCount,
    selectedSideCount,
    selectedUtensilCount,
    subscriptionCycleCutsUsed: (subscriptionSummaryUsage?.cutsUsed || 0) + selectedMeatUnitsCount,
    subscriptionCycleWeightUsed: (subscriptionSummaryUsage?.weightKgUsed || 0) + selectedProteinKg,
    subscriptionCycleCharcoalUsed: (subscriptionSummaryUsage?.charcoalKgUsed || 0) + selectedCharcoalKg,
    subscriptionCycleSeasoningsUsed: (subscriptionSummaryUsage?.seasoningsUsed || 0) + selectedSeasoningCount,
    subscriptionCycleSidesUsed: (subscriptionSummaryUsage?.sidesUsed || 0) + selectedSideCount,
    subscriptionCycleUtensilsUsed: (subscriptionSummaryUsage?.utensilsUsed || 0) + selectedUtensilCount,
    subscriptionSummaryUsage,
    canAddProduct,
    getProductMeasure: getClientCheckoutProductMeasure,
  };
};
