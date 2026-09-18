"use client";

import React from "react";
import { Container } from "@foundation/ui";
import { ScreenHeader } from "@foundation/product-components/screens/web/ScreenHeader";
import { useClientCheckout } from "@/hooks/useClientCheckout";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import { formatClientCheckoutMeasure, formatClientCheckoutMoney } from "@royalprime/client/utils/checkout.formatters";
import styles from "./CheckoutView.module.css";
import { CheckoutAcquisition } from "./acquisition/CheckoutAcquisition";
import { ProductFilterModal } from "./catalog/ProductFilterModal";
import { CheckoutFlow } from "./flow/CheckoutFlow";
import { CheckoutFlowLeft } from "./flow/left/CheckoutFlowLeft";
import { CheckoutFlowRight } from "./flow/right/CheckoutFlowRight";
import { useCheckoutRuntime } from "./runtime/useCheckoutRuntime";

export interface CheckoutViewProps {
  isAuthenticated: boolean;
  onRequestAccess: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ isAuthenticated, onRequestAccess }) => {
  const strings = useClientStrings().pedido;
  const runtime = useCheckoutRuntime({ isAuthenticated, onRequestAccess });
  const { tokens } = runtime;
  const checkout = useClientCheckout({ isAuthenticated });
  const {
    actions,
    activeCycleUsage,
    addresses,
    catalogSubscriptionPlans,
    config,
    currentStep,
    filterModalOpen,
    freightOptions: rawFreightOptions,
    isAddingAddress,
    newAddressDraft,
    paymentInstallments,
    paymentMethods: rawPaymentMethods,
    productCategories,
    query,
    selectedAddressId,
    selectedCategoryId,
    selectedDeliveryDay,
    selectedFreight,
    selectedInstallments,
    selectedMode,
    selectedPaymentMethod,
    selectedPlanKey,
    selectedProductQuantities,
    viewModel,
  } = checkout;
  const {
    activeSubscriptionLabel,
    activeSubscriptionPlan,
    availableProducts,
    categoryById,
    currentFreightPrice,
    currentSubscriptionPlan,
    finalTotal,
    hasMode,
    orderEstimateTotal,
    selectedAddressSummary,
    selectedProductEntries,
    selectedUnitsCount,
    selectedProteinKg,
    selectedCharcoalKg,
    selectedSeasoningCount,
    selectedSideCount,
    selectedUtensilCount,
    subscriptionCycleCutsUsed,
    subscriptionCycleWeightUsed,
    subscriptionCycleCharcoalUsed,
    subscriptionCycleSeasoningsUsed,
    subscriptionCycleSidesUsed,
    subscriptionCycleUtensilsUsed,
    subscriptionSummaryUsage,
  } = viewModel;
  const activeSubscription = checkout.activeSubscription;
  const paymentCopy = strings.paymentStep;
  const reviewCopy = strings.reviewStep;
  const deliveryCopy = selectedMode ? strings.deliveryStep[selectedMode] : null;
  const freightOptions = rawFreightOptions.map((option) => ({
    ...option,
    label: strings.deliveryStep.royalDelivery[option.labelKey],
  }));
  const currentFreightOption = selectedFreight
    ? freightOptions.find((option) => option.key === selectedFreight)
    : undefined;
  const paymentMethods = rawPaymentMethods
    .filter((method) => (selectedMode ? method.availableFor.includes(selectedMode) : true))
    .map((method) => ({
      ...method,
      description: paymentCopy.methods[method.descriptionKey],
      label: paymentCopy.methods[method.labelKey],
    }));
  const selectedPayment = paymentMethods.find((method) => method.key === selectedPaymentMethod) || paymentMethods[0];
  const newAddressFields = config.addressFields.map((field) => ({
    autoComplete: field.autoComplete,
    gridSpan: field.gridSpan,
    key: field.key,
    label: strings.deliveryStep.common[field.labelKey],
    maxLength: field.maxLength,
    inputMode: field.inputMode,
    placeholder: strings.deliveryStep.common.addressPlaceholders[field.placeholderKey],
  }));

  return (
    <div className={styles.pageRoot}>
      <ScreenHeader
        className={styles.screenHeader}
        description={strings.hero.description}
        eyebrow={strings.hero.badge}
        mobileGutter="none"
        mobileMode="collapsible"
        mobileTitle={strings.hero.mobileTitle}
        showScrollBorder={false}
        title={strings.hero.title}
      />
      <main>
        <Container
          className={`${styles.main} ${styles.mainEmbedded}`}
          width="wide"
          gutter="page"
        >
          <CheckoutAcquisition
            activeSubscription={activeSubscription}
            activeSubscriptionLabel={activeSubscriptionLabel}
            activeSubscriptionPlan={activeSubscriptionPlan}
            modeOrder={config.modeOrder}
            onSelectMode={actions.selectMode}
            selectedMode={selectedMode}
            strings={strings}
          />

          {hasMode && selectedMode ? (
            <CheckoutFlow
              currentStep={currentStep}
              left={(
                <CheckoutFlowLeft
                  currentStep={currentStep}
                  montage={{
                    activeCycleUsage,
                    activeSubscription,
                    availableProducts,
                    canAddProduct: viewModel.canAddProduct,
                    catalogSubscriptionPlans,
                    categoryById,
                    currentSubscriptionPlan,
                    formatMeasure: formatClientCheckoutMeasure,
                    formatMoney: formatClientCheckoutMoney,
                    onClearFilters: () => {
                      actions.setSelectedCategoryId("all");
                      actions.setQuery("");
                    },
                    onDecreaseProduct: actions.removeProduct,
                    onOpenFilters: () => actions.setFilterModalOpen(true),
                    onProductSelect: actions.addProduct,
                    onQueryChange: actions.setQuery,
                    onSelectPlan: actions.selectPlan,
                    query,
                    selectedCategoryId,
                    selectedMode,
                    selectedPlanKey,
                    selectedProductQuantities,
                    strings,
                    subscriptionCycleCharcoalUsed,
                    subscriptionCycleWeightUsed,
                    tokens,
                  }}
                  delivery={{
                    addresses,
                    checkoutConfig: config,
                    currentFreightPrice,
                    deliveryCopy,
                    formatMoney: formatClientCheckoutMoney,
                    freightOptions,
                    isAddingAddress,
                    newAddressDraft,
                    newAddressFields,
                    onBack: () => actions.setCurrentStep("montagem"),
                    onNext: () => runtime.requestProtectedStep("pagamento", actions.setCurrentStep),
                    onSubmitNewAddress: () => actions.submitNewAddress(strings.deliveryStep.common.newAddressLabelPrefix),
                    onSelectAddress: actions.setSelectedAddressId,
                    onSelectDeliveryDay: actions.setSelectedDeliveryDay,
                    onSelectFreight: actions.setSelectedFreight,
                    onSetAddingAddress: actions.setIsAddingAddress,
                    onUpdateNewAddressDraft: actions.updateNewAddressDraft,
                    selectedAddressId,
                    selectedDeliveryDay,
                    selectedFreight,
                    selectedMode,
                    strings,
                  }}
                  payment={{
                    onBack: () => actions.setCurrentStep("entrega"),
                    onNext: () => runtime.requestProtectedStep("resumo", actions.setCurrentStep),
                    onSelectInstallments: actions.setSelectedInstallments,
                    onSelectPaymentMethod: actions.setSelectedPaymentMethod,
                    paymentCopy,
                    paymentInstallments,
                    paymentMethods,
                    selectedInstallments,
                    selectedMode,
                    selectedPaymentMethod,
                  }}
                  review={{
                    currentFreightOption,
                    currentFreightPrice,
                    currentSubscriptionPlan,
                    finalTotal,
                    formatMeasure: formatClientCheckoutMeasure,
                    formatMoney: formatClientCheckoutMoney,
                    onBack: () => actions.setCurrentStep("pagamento"),
                    onFinish: () => actions.submitOrder(),
                    reviewCopy,
                    selectedAddressSummary,
                    selectedDeliveryDay,
                    selectedInstallments,
                    selectedMode,
                    selectedPaymentLabel: selectedPayment?.label || paymentCopy.methods.creditCard,
                    selectedProductEntries,
                    selectedUnitsCount,
                    strings,
                    subscriptionCycleCharcoalUsed,
                    subscriptionCycleSeasoningsUsed,
                    subscriptionCycleSidesUsed,
                    subscriptionCycleUtensilsUsed,
                    subscriptionCycleWeightUsed,
                    tokens,
                  }}
                />
              )}
              right={currentStep !== "resumo" ? (
                <CheckoutFlowRight
                  activeSubscription={activeSubscription}
                  activeSubscriptionLabel={activeSubscriptionLabel}
                  currentFreightOption={currentFreightOption}
                  currentFreightPrice={currentFreightPrice}
                  currentStep={currentStep}
                  currentSubscriptionPlan={currentSubscriptionPlan}
                  formatMeasure={formatClientCheckoutMeasure}
                  formatMoney={formatClientCheckoutMoney}
                  onAddProduct={actions.addProduct}
                  onNextStep={() => {
                    if (currentStep === "montagem") {
                      runtime.requestProtectedStep("entrega", actions.setCurrentStep);
                      return;
                    }
                    if (currentStep === "entrega") {
                      runtime.requestProtectedStep("pagamento", actions.setCurrentStep);
                      return;
                    }
                    if (currentStep === "pagamento") runtime.requestProtectedStep("resumo", actions.setCurrentStep);
                  }}
                  onRemoveProduct={actions.removeProduct}
                  orderEstimateTotal={orderEstimateTotal}
                  selectedAddressSummary={selectedAddressSummary}
                  selectedCharcoalKg={selectedCharcoalKg}
                  selectedDeliveryDay={selectedDeliveryDay}
                  selectedMode={selectedMode}
                  selectedPaymentLabel={selectedPayment?.label || paymentCopy.methods.creditCard}
                  selectedProductEntries={selectedProductEntries}
                  selectedProteinKg={selectedProteinKg}
                  selectedSeasoningCount={selectedSeasoningCount}
                  selectedSideCount={selectedSideCount}
                  selectedUtensilCount={selectedUtensilCount}
                  stepOrder={config.stepOrder}
                  strings={strings}
                  subscriptionCycleCharcoalUsed={subscriptionCycleCharcoalUsed}
                  subscriptionCycleCutsUsed={subscriptionCycleCutsUsed}
                  subscriptionCycleSeasoningsUsed={subscriptionCycleSeasoningsUsed}
                  subscriptionCycleSidesUsed={subscriptionCycleSidesUsed}
                  subscriptionCycleUtensilsUsed={subscriptionCycleUtensilsUsed}
                  subscriptionCycleWeightUsed={subscriptionCycleWeightUsed}
                  subscriptionSummaryUsage={subscriptionSummaryUsage}
                  tokens={tokens}
                />
              ) : undefined}
            />
          ) : null}
        </Container>
      </main>

      {filterModalOpen ? (
        <ProductFilterModal
          categories={productCategories}
          onApply={(categoryId) => {
            actions.setSelectedCategoryId(categoryId);
            actions.setFilterModalOpen(false);
          }}
          onClose={() => actions.setFilterModalOpen(false)}
          selectedCategoryId={selectedCategoryId}
          strings={strings.filters}
        />
      ) : null}
    </div>
  );
};
