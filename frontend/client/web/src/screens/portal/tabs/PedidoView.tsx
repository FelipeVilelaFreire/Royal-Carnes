"use client";

import React from "react";
import { Container } from "@foundation/ui";
import { AuthModal, BottomTabBar, PortalHeader } from "../../../legacy/app-shell";
import { clientPtBR } from "@/locales/pt-BR";
import { useClientCheckout } from "@/hooks/useClientCheckout";
import { formatClientCheckoutMeasure, formatClientCheckoutMoney } from "@royalprime/client/utils/checkout.formatters";
import styles from "./PedidoView.module.css";
import { ActivePlanPanel } from "./pedido/ActivePlanPanel";
import { CheckoutStepTracker } from "./pedido/CheckoutStepTracker";
import { DeliveryStep } from "./pedido/DeliveryStep";
import { ModeSelector } from "./pedido/ModeSelector";
import { PaymentStep } from "./pedido/PaymentStep";
import { PedidoHero } from "./pedido/PedidoHero";
import { ProductCatalogStep } from "./pedido/ProductCatalogStep";
import { ProductFilterModal } from "./pedido/ProductFilterModal";
import { ReviewStep } from "./pedido/ReviewStep";
import { StickyOrderSummary } from "./pedido/StickyOrderSummary";
import { usePedidoRuntime } from "./pedido/usePedidoRuntime";

export interface PedidoViewProps {
  onNavigate?: (path: string) => void;
  showHeader?: boolean;
}

export const PedidoView: React.FC<PedidoViewProps> = ({ onNavigate, showHeader = true }) => {
  const strings = clientPtBR.pedido;
  const runtime = usePedidoRuntime();
  const { isDark, isDemoAuthenticated, themeMode, tokens } = runtime;
  const checkout = useClientCheckout({ isAuthenticated: isDemoAuthenticated });
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
    gridColumn: field.gridColumn,
    key: field.key,
    label: strings.deliveryStep.common[field.labelKey],
    placeholder: strings.deliveryStep.common.addressPlaceholders[field.placeholderKey],
  }));

  const cardSurface: React.CSSProperties = {
    background: tokens.surfaceContainer,
    boxShadow: "var(--theme--elevation-md-shadow, none)",
  };

  const renderStepTracker = () => (
    <CheckoutStepTracker
      cardSurface={cardSurface}
      completedLabel={strings.steps.completed}
      currentStep={currentStep}
      stepOrder={config.stepOrder}
      steps={strings.steps}
      tokens={tokens}
    />
  );

  const renderCurrentStep = () => {
    if (!selectedMode) return null;

    if (currentStep === "montagem") {
      return (
        <>
          {selectedMode === "subscription" ? (
            <ActivePlanPanel
              activeCycleUsage={activeCycleUsage}
              activeSubscription={activeSubscription}
              activeSubscriptionLabel={activeSubscriptionLabel}
              catalogSubscriptionPlans={catalogSubscriptionPlans}
              currentSubscriptionPlan={currentSubscriptionPlan}
              formatMeasure={formatClientCheckoutMeasure}
              onSelectPlan={actions.selectPlan}
              selectedPlanKey={selectedPlanKey}
              strings={strings}
              subscriptionCycleCharcoalUsed={subscriptionCycleCharcoalUsed}
              subscriptionCycleCutsUsed={subscriptionCycleCutsUsed}
              subscriptionCycleWeightUsed={subscriptionCycleWeightUsed}
              tokens={tokens}
            />
          ) : null}
          <ProductCatalogStep
            availableProducts={availableProducts}
            canAddProduct={viewModel.canAddProduct}
            categoryById={categoryById}
            formatMoney={formatClientCheckoutMoney}
            onClearFilters={() => {
              actions.setSelectedCategoryId("all");
              actions.setQuery("");
            }}
            onDecreaseProduct={actions.removeProduct}
            onOpenFilters={() => actions.setFilterModalOpen(true)}
            onProductSelect={actions.addProduct}
            onQueryChange={actions.setQuery}
            query={query}
            selectedCategoryId={selectedCategoryId}
            selectedMode={selectedMode}
            selectedProductQuantities={selectedProductQuantities}
            strings={strings}
            tokens={tokens}
          />
        </>
      );
    }

    if (currentStep === "entrega") {
      return (
        <div className={styles.animatedStack}>
          {renderStepTracker()}
          <DeliveryStep
            addresses={addresses}
            checkoutConfig={config}
            currentFreightPrice={currentFreightPrice}
            deliveryCopy={deliveryCopy}
            formatMoney={formatClientCheckoutMoney}
            freightOptions={freightOptions}
            isAddingAddress={isAddingAddress}
            newAddressDraft={newAddressDraft}
            newAddressFields={newAddressFields}
            onBack={() => actions.setCurrentStep("montagem")}
            onNext={() => runtime.requestProtectedStep("pagamento", actions.setCurrentStep)}
            onSubmitNewAddress={() => actions.submitNewAddress(strings.deliveryStep.common.newAddressLabelPrefix)}
            onSelectAddress={actions.setSelectedAddressId}
            onSelectDeliveryDay={actions.setSelectedDeliveryDay}
            onSelectFreight={actions.setSelectedFreight}
            onSetAddingAddress={actions.setIsAddingAddress}
            onUpdateNewAddressDraft={actions.updateNewAddressDraft}
            selectedAddressId={selectedAddressId}
            selectedDeliveryDay={selectedDeliveryDay}
            selectedFreight={selectedFreight}
            selectedMode={selectedMode}
            strings={strings}
            tokens={tokens}
          />
        </div>
      );
    }

    if (currentStep === "pagamento") {
      return (
        <div className={styles.animatedStack}>
          {renderStepTracker()}
          <PaymentStep
            onBack={() => actions.setCurrentStep("entrega")}
            onNext={() => runtime.requestProtectedStep("resumo", actions.setCurrentStep)}
            onSelectInstallments={actions.setSelectedInstallments}
            onSelectPaymentMethod={actions.setSelectedPaymentMethod}
            paymentCopy={paymentCopy}
            paymentInstallments={paymentInstallments}
            paymentMethods={paymentMethods}
            selectedInstallments={selectedInstallments}
            selectedMode={selectedMode}
            selectedPaymentMethod={selectedPaymentMethod}
            tokens={tokens}
          />
        </div>
      );
    }

    return (
      <div className={styles.animatedStack}>
        {renderStepTracker()}
        <ReviewStep
          categoryById={categoryById}
          currentFreightOption={currentFreightOption}
          currentFreightPrice={currentFreightPrice}
          currentSubscriptionPlan={currentSubscriptionPlan}
          finalTotal={finalTotal}
          formatMeasure={formatClientCheckoutMeasure}
          formatMoney={formatClientCheckoutMoney}
          onBack={() => actions.setCurrentStep("pagamento")}
          onFinish={() => actions.submitOrder()}
          reviewCopy={reviewCopy}
          selectedAddressSummary={selectedAddressSummary}
          selectedDeliveryDay={selectedDeliveryDay}
          selectedInstallments={selectedInstallments}
          selectedMode={selectedMode}
          selectedPaymentLabel={selectedPayment?.label || paymentCopy.methods.creditCard}
          selectedProductEntries={selectedProductEntries}
          selectedUnitsCount={selectedUnitsCount}
          strings={strings}
          subscriptionCycleCharcoalUsed={subscriptionCycleCharcoalUsed}
          subscriptionCycleSeasoningsUsed={subscriptionCycleSeasoningsUsed}
          subscriptionCycleSidesUsed={subscriptionCycleSidesUsed}
          subscriptionCycleUtensilsUsed={subscriptionCycleUtensilsUsed}
          subscriptionCycleWeightUsed={subscriptionCycleWeightUsed}
          tokens={tokens}
        />
      </div>
    );
  };

  return (
    <div
      className={styles.pageRoot}
      style={{
        "--pedido-page-bg": tokens.background,
        "--pedido-page-text": tokens.text,
        "--pedido-page-min-height": showHeader ? "100vh" : "auto",
      } as React.CSSProperties}
    >
      {showHeader ? (
        <PortalHeader
          activeTab="produtos"
          themeMode={themeMode}
          onToggleTheme={runtime.toggleTheme}
          onNavigate={onNavigate}
        />
      ) : null}

      <main className="appear-on-scroll">
        <Container
          className={`${styles.main} ${showHeader ? styles.mainWithHeader : styles.mainEmbedded}`}
          width="wide"
          gutter="page"
        >
          <PedidoHero cardSurface={cardSurface} hasMode={hasMode} strings={strings.hero} tokens={tokens} />
          <ModeSelector
            activeCycleUsage={activeCycleUsage}
            activeSubscription={activeSubscription}
            activeSubscriptionLabel={activeSubscriptionLabel}
            activeSubscriptionPlan={activeSubscriptionPlan}
            cardSurface={cardSurface}
            formatMeasure={formatClientCheckoutMeasure}
            hasMode={hasMode}
            modeOrder={config.modeOrder}
            onSelectMode={actions.selectMode}
            selectedMode={selectedMode}
            strings={strings}
            tokens={tokens}
          />

          {hasMode && selectedMode ? (
            <section
              className={`${styles.shell} ${currentStep === "resumo" ? styles.shellReview : styles.shellWithSummary}`}
            >
              <div className={styles.contentStack}>{renderCurrentStep()}</div>
              {currentStep !== "resumo" ? (
                <StickyOrderSummary
                  activeSubscription={activeSubscription}
                  activeSubscriptionLabel={activeSubscriptionLabel}
                  currentFreightOption={currentFreightOption}
                  currentFreightPrice={currentFreightPrice}
                  currentStep={currentStep}
                  currentSubscriptionPlan={currentSubscriptionPlan}
                  formatMeasure={formatClientCheckoutMeasure}
                  formatMoney={formatClientCheckoutMoney}
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
                  selectedUnitsCount={selectedUnitsCount}
                  selectedUtensilCount={selectedUtensilCount}
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
              ) : null}
            </section>
          ) : null}
        </Container>
      </main>

      {showHeader ? <BottomTabBar activeTab="produtos" onNavigate={onNavigate} isDark={isDark} /> : null}
      <AuthModal
        open={runtime.isAuthModalOpen}
        onClose={runtime.closeAuthModal}
        onAuthenticated={() => runtime.handleAuthenticatedCheckout(actions.setCurrentStep)}
        isDark={isDark}
        context="portal"
      />

      {filterModalOpen ? (
        <ProductFilterModal
          categories={productCategories}
          onApply={() => actions.setFilterModalOpen(false)}
          onClose={() => actions.setFilterModalOpen(false)}
          onSelectCategory={actions.setSelectedCategoryId}
          selectedCategoryId={selectedCategoryId}
          strings={strings.filters}
          tokens={tokens}
        />
      ) : null}
    </div>
  );
};
