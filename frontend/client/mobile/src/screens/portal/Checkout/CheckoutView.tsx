import React from "react";
import { Container, Stack } from "@foundation/ui/native/Layout";
import { useUi } from "@foundation/ui/native/context";
import { useClientCheckout } from "../../../../../shared-core/hooks/useClientCheckout";
import type { useClientStrings } from "../../../../../shared-core/hooks/useClientStrings";
import { formatClientCheckoutMeasure, formatClientCheckoutMoney } from "../../../../../shared-core/utils/checkout.formatters";
import { createMobileAppShellConfig, type AppThemeMode } from "@royalprime/client/manifest/portal/native-appshell.config";
import { ScreenHeader } from "@foundation/product-components/screens/native/ScreenHeader";
import { normalizeScreenHeaderScrollProgress } from "@foundation/product-components/screens/shared";
import { AcquisitionIntro } from "./acquisition/AcquisitionIntro";
import { AcquisitionModeGrid } from "./acquisition/AcquisitionModeGrid";
import { ProductCatalogStep } from "./catalog/ProductCatalogStep";
import { ActiveCycleSummary } from "./cycle/ActiveCycleSummary";
import { DeliveryStep } from "./delivery/DeliveryStep";
import { PaymentStep } from "./payment/PaymentStep";
import { CheckoutStepTracker } from "./progress/CheckoutStepTracker";
import { ReviewStep } from "./review/ReviewStep";
import { useCheckoutRuntime } from "./runtime/useCheckoutRuntime";
import { MobileSelectionSummary } from "./summary/MobileSelectionSummary";
import { createCheckoutStyles } from "./checkout.styles";

export interface CheckoutViewProps {
  activePath?: string;
  isAuthenticated?: boolean;
  onRequestAccess: () => void;
  strings: ReturnType<typeof useClientStrings>;
  themeMode?: AppThemeMode;
}

type NativeScrollEvent = {
  nativeEvent?: {
    contentOffset?: {
      y?: number;
    };
  };
};

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  isAuthenticated = true,
  onRequestAccess,
  strings: clientStrings,
  themeMode = "dark",
}) => {
  const mobileConfig = createMobileAppShellConfig(themeMode) as any;
  const theme = mobileConfig.theme;
  const styles = createCheckoutStyles(theme);
  const [headerScrollProgress, setHeaderScrollProgress] = React.useState(0);
  const { designSystem, hosts } = useUi();
  const ScrollContainer = hosts.ScrollView || hosts.View;
  const screenHeaderScrollRange = Math.max(Number(designSystem.theme.tokens.spacing?.space3xl || 0), 1);
  const strings = clientStrings.pedido;
  const runtime = useCheckoutRuntime({ isAuthenticated, onRequestAccess });
  const checkout = useClientCheckout({ isAuthenticated });
  const {
    actions,
    activeCycleUsage,
    addresses,
    catalogSubscriptionPlans,
    config,
    currentStep,
    freightOptions: rawFreightOptions,
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
  const freightOptions = rawFreightOptions.map((option) => ({
    ...option,
    label: strings.deliveryStep.royalDelivery[option.labelKey],
  }));
  const paymentCopy = strings.paymentStep;
  const paymentMethods = rawPaymentMethods
    .filter((method) => (selectedMode ? method.availableFor.includes(selectedMode) : true))
    .map((method) => ({
      ...method,
      description: paymentCopy.methods[method.descriptionKey],
      label: paymentCopy.methods[method.labelKey],
    }));
  const selectedPayment = paymentMethods.find((method) => method.key === selectedPaymentMethod) || paymentMethods[0];
  const requestProtectedStep = (step: typeof currentStep) => runtime.requestProtectedStep(step, actions.setCurrentStep);

  return (
    <ScrollContainer
      onScroll={hosts.ScrollView ? (event: NativeScrollEvent) => setHeaderScrollProgress(
        normalizeScreenHeaderScrollProgress((event.nativeEvent?.contentOffset?.y || 0) / screenHeaderScrollRange),
      ) : undefined}
      scrollEventThrottle={hosts.ScrollView ? 16 : undefined}
      stickyHeaderIndices={hosts.ScrollView ? [0] : undefined}
    >
      <ScreenHeader
        description={strings.hero.description}
        eyebrow={strings.hero.badge}
        mobileMode="collapsible"
        mobileTitle={strings.hero.mobileTitle}
        scrollProgress={headerScrollProgress}
        showScrollBorder={false}
        title={strings.hero.title}
      />
      <Container style={styles.page}>
        <Stack style={styles.stack}>
        <AcquisitionIntro strings={strings.modeSelection}>
          <AcquisitionModeGrid
            activeSubscription={checkout.activeSubscription}
            activeSubscriptionLabel={viewModel.activeSubscriptionLabel}
            activeSubscriptionPlan={viewModel.activeSubscriptionPlan}
            modeOrder={config.modeOrder}
            onSelectMode={actions.selectMode}
            selectedMode={selectedMode}
            strings={strings}
            tokens={theme}
          />
        </AcquisitionIntro>

        {selectedMode ? (
          <Stack style={styles.stack}>
            <CheckoutStepTracker
              currentStep={currentStep}
              stepOrder={config.stepOrder}
              steps={strings.steps}
              tokens={theme}
            />

            {currentStep === "montagem" ? (
              selectedMode === "subscription" ? (
                <ActiveCycleSummary
                  activeCycleUsage={activeCycleUsage}
                  activeSubscription={checkout.activeSubscription}
                  activeSubscriptionLabel={viewModel.activeSubscriptionLabel}
                  catalogSubscriptionPlans={catalogSubscriptionPlans}
                  currentSubscriptionPlan={viewModel.currentSubscriptionPlan}
                  formatMeasure={formatClientCheckoutMeasure}
                  onSelectPlan={actions.selectPlan}
                  selectedPlanKey={selectedPlanKey}
                  strings={strings}
                  subscriptionCycleCharcoalUsed={viewModel.subscriptionCycleCharcoalUsed}
                  subscriptionCycleCutsUsed={viewModel.subscriptionCycleCutsUsed}
                  subscriptionCycleWeightUsed={viewModel.subscriptionCycleWeightUsed}
                  tokens={theme}
                />
              ) : null
            ) : null}

            {currentStep === "montagem" ? (
              <ProductCatalogStep
                availableProducts={viewModel.availableProducts}
                canAddProduct={viewModel.canAddProduct}
                categories={productCategories}
                categoryById={viewModel.categoryById}
                formatMoney={formatClientCheckoutMoney}
                onClearFilters={() => {
                  actions.setSelectedCategoryId("all");
                  actions.setQuery("");
                }}
                onDecreaseProduct={actions.removeProduct}
                onProductSelect={actions.addProduct}
                onQueryChange={actions.setQuery}
                onSelectCategory={actions.setSelectedCategoryId}
                query={query}
                selectedCategoryId={selectedCategoryId}
                selectedMode={selectedMode}
                selectedProductQuantities={selectedProductQuantities}
                strings={strings}
                tokens={theme}
              />
            ) : null}

            {currentStep === "entrega" ? (
              <DeliveryStep
                addresses={addresses}
                checkoutConfig={config}
                currentFreightPrice={viewModel.currentFreightPrice}
                formatMoney={formatClientCheckoutMoney}
                freightOptions={freightOptions}
                onBack={() => actions.setCurrentStep("montagem")}
                onNext={() => requestProtectedStep("pagamento")}
                onSelectAddress={actions.setSelectedAddressId}
                onSelectDeliveryDay={actions.setSelectedDeliveryDay}
                onSelectFreight={actions.setSelectedFreight}
                selectedAddressId={selectedAddressId}
                selectedDeliveryDay={selectedDeliveryDay}
                selectedFreight={selectedFreight}
                selectedMode={selectedMode}
                strings={strings}
                tokens={theme}
              />
            ) : null}

            {currentStep === "pagamento" ? (
              <PaymentStep
                onBack={() => actions.setCurrentStep("entrega")}
                onNext={() => requestProtectedStep("resumo")}
                onSelectInstallments={actions.setSelectedInstallments}
                onSelectPaymentMethod={actions.setSelectedPaymentMethod}
                paymentCopy={paymentCopy}
                paymentInstallments={paymentInstallments}
                paymentMethods={paymentMethods}
                selectedInstallments={selectedInstallments}
                selectedPaymentMethod={selectedPaymentMethod}
                tokens={theme}
              />
            ) : null}

            {currentStep === "resumo" ? (
              <ReviewStep
                currentSubscriptionPlan={viewModel.currentSubscriptionPlan}
                finalTotal={viewModel.finalTotal}
                formatMoney={formatClientCheckoutMoney}
                onBack={() => actions.setCurrentStep("pagamento")}
                onFinish={() => {
                  void actions.submitOrder();
                }}
                reviewCopy={strings.reviewStep}
                selectedAddressSummary={viewModel.selectedAddressSummary}
                selectedMode={selectedMode}
                selectedPaymentLabel={selectedPayment?.label || paymentCopy.methods.creditCard}
                selectedProductEntries={viewModel.selectedProductEntries}
                strings={strings}
                tokens={theme}
              />
            ) : null}

            {currentStep === "montagem" ? (
              <MobileSelectionSummary
                itemCount={viewModel.selectedUnitsCount}
                itemLabel={strings.summary.selectedItems}
                estimateLabel={strings.summary.variableEstimate}
                estimateValue={formatClientCheckoutMoney(viewModel.orderEstimateTotal)}
                nextStepLabel={strings.summary.nextStep}
                onNextStep={() => requestProtectedStep("entrega")}
                placeholder={strings.summary.placeholder}
                title={strings.summary.title}
                tokens={theme}
              />
            ) : null}
          </Stack>
        ) : null}
        </Stack>
      </Container>
    </ScrollContainer>
  );
};
