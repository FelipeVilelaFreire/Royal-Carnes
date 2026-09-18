import React from "react";
import type {
  ClientCheckoutCycleUsage,
  ClientCheckoutProduct,
  ClientCheckoutProductCategory,
  ClientCheckoutProductExperience,
  ClientCheckoutSubscriptionPlan,
  ClientCheckoutSubscriptionTier,
} from "@/view-models/checkout.view-model";
import { ActiveCycleSummary } from "../../cycle/ActiveCycleSummary";
import { ProductCatalogStep } from "../../catalog/ProductCatalogStep";

interface CheckoutMontageStepProps {
  activeCycleUsage: ClientCheckoutCycleUsage | null;
  activeSubscription?: {
    nextBillingLabel: string;
  };
  availableProducts: ClientCheckoutProduct[];
  canAddProduct: (product: ClientCheckoutProduct) => boolean;
  catalogSubscriptionPlans: ClientCheckoutSubscriptionPlan[];
  categoryById: Map<string, ClientCheckoutProductCategory>;
  currentSubscriptionPlan: ClientCheckoutSubscriptionPlan;
  formatMeasure: (value: number, unit: string) => string;
  formatMoney: (value: number) => string;
  onClearFilters: () => void;
  onDecreaseProduct: (productId: string) => void;
  onOpenFilters: () => void;
  onProductSelect: (product: ClientCheckoutProduct) => void;
  onQueryChange: (value: string) => void;
  onSelectPlan: (planKey: ClientCheckoutSubscriptionTier) => void;
  query: string;
  selectedCategoryId: string;
  selectedMode: ClientCheckoutProductExperience;
  selectedPlanKey: ClientCheckoutSubscriptionTier;
  selectedProductQuantities: Record<string, number>;
  strings: React.ComponentProps<typeof ActiveCycleSummary>["strings"];
  subscriptionCycleCharcoalUsed: number;
  subscriptionCycleWeightUsed: number;
  tokens: React.ComponentProps<typeof ProductCatalogStep>["tokens"];
}

export const CheckoutMontageStep: React.FC<CheckoutMontageStepProps> = ({
  activeCycleUsage,
  activeSubscription,
  availableProducts,
  canAddProduct,
  catalogSubscriptionPlans,
  categoryById,
  currentSubscriptionPlan,
  formatMeasure,
  formatMoney,
  onClearFilters,
  onDecreaseProduct,
  onOpenFilters,
  onProductSelect,
  onQueryChange,
  onSelectPlan,
  query,
  selectedCategoryId,
  selectedMode,
  selectedPlanKey,
  selectedProductQuantities,
  strings,
  subscriptionCycleCharcoalUsed,
  subscriptionCycleWeightUsed,
  tokens,
}) => {
  const cycleSummary = selectedMode === "subscription" ? (
    <ActiveCycleSummary
      activeCycleUsage={activeCycleUsage}
      activeSubscription={activeSubscription}
      catalogSubscriptionPlans={catalogSubscriptionPlans}
      currentSubscriptionPlan={currentSubscriptionPlan}
      embedded
      formatMeasure={formatMeasure}
      onSelectPlan={onSelectPlan}
      selectedPlanKey={selectedPlanKey}
      strings={strings}
      subscriptionCycleCharcoalUsed={subscriptionCycleCharcoalUsed}
      subscriptionCycleWeightUsed={subscriptionCycleWeightUsed}
    />
  ) : null;

  return (
    <ProductCatalogStep
      availableProducts={availableProducts}
      canAddProduct={canAddProduct}
      categoryById={categoryById}
      formatMoney={formatMoney}
      header={cycleSummary}
      onClearFilters={onClearFilters}
      onDecreaseProduct={onDecreaseProduct}
      onOpenFilters={onOpenFilters}
      onProductSelect={onProductSelect}
      onQueryChange={onQueryChange}
      query={query}
      selectedCategoryId={selectedCategoryId}
      selectedMode={selectedMode}
      selectedProductQuantities={selectedProductQuantities}
      strings={strings}
      tokens={tokens}
    />
  );
};
