import React from "react";
import { Container, Stack } from "@foundation/ui/native/Layout";
import { useUi } from "@foundation/ui/native/context";
import { useClientCheckout } from "../../../../../shared-core/hooks/useClientCheckout";
import type { useClientStrings } from "../../../../../shared-core/hooks/useClientStrings";
import { formatClientCheckoutMeasure, formatClientCheckoutMoney } from "../../../../../shared-core/utils/checkout.formatters";
import { createMobileAppShellConfig, type AppThemeMode } from "@royalprime/client/manifest/portal/native-appshell.config";
import { ScreenHeader } from "@foundation/product-components/screens/native/ScreenHeader";
import { normalizeScreenHeaderScrollProgress } from "@foundation/product-components/screens/shared";
import { CheckoutAcquisition } from "./acquisition/CheckoutAcquisition";
import { CheckoutFlow } from "./flow/CheckoutFlow";
import { CheckoutFlowMain } from "./flow/left/CheckoutFlowMain";
import { CheckoutFlowSummary } from "./flow/right/CheckoutFlowSummary";
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
  const checkout = useClientCheckout({ isAuthenticated });
  const {
    actions,
    activeCycleUsage,
    addressSaveState,
    addresses,
    canSaveNewAddress,
    catalogSubscriptionPlans,
    config,
    currentStep,
    freightOptions: rawFreightOptions,
    hasCatalogError,
    isAddingAddress,
    newAddressDraft,
    orderCreateState,
    paymentMethods: rawPaymentMethods,
    productCategories,
    query,
    selectedAddressId,
    selectedCategoryId,
    selectedDeliveryDay,
    selectedFreight,
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
  const requestProtectedStep = (step: typeof currentStep) => {
    if (!actions.requestProtectedStep(step)) onRequestAccess();
  };

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
        mobileMode="collapsible"
        mobileTitle={strings.hero.mobileTitle}
        scrollProgress={headerScrollProgress}
        showScrollBorder={false}
        title={strings.hero.title}
      />
      <Container style={styles.page}>
        <Stack style={styles.stack}>
          <CheckoutAcquisition
            activeSubscription={checkout.activeSubscription}
            activeSubscriptionLabel={viewModel.activeSubscriptionLabel}
            activeSubscriptionPlan={viewModel.activeSubscriptionPlan}
            isCompact={Boolean(selectedMode)}
            modeOrder={config.modeOrder}
            onSelectMode={actions.selectMode}
            selectedMode={selectedMode}
            strings={strings}
            tokens={theme}
          />

        {selectedMode ? (
          <CheckoutFlow
            main={(
              <CheckoutFlowMain
                currentStep={currentStep}
                montage={{
                  cycle: selectedMode === "subscription" ? {
                    activeCycleUsage,
                    activeSubscription: checkout.activeSubscription,
                    catalogSubscriptionPlans,
                    currentSubscriptionPlan: viewModel.currentSubscriptionPlan,
                    formatMeasure: formatClientCheckoutMeasure,
                    onSelectPlan: actions.selectPlan,
                    selectedPlanKey,
                    strings,
                    subscriptionCycleCharcoalUsed: viewModel.subscriptionCycleCharcoalUsed,
                    subscriptionCycleWeightUsed: viewModel.subscriptionCycleWeightUsed,
                    tokens: theme,
                  } : undefined,
                  catalog: {
                    availableProducts: viewModel.availableProducts,
                    canAddProduct: viewModel.canAddProduct,
                    categories: productCategories,
                    categoryById: viewModel.categoryById,
                    formatMoney: formatClientCheckoutMoney,
                    hasCatalogError,
                    isCatalogLoading: checkout.isAcquisitionLoading,
                    onClearFilters: () => {
                      actions.setSelectedCategoryId("all");
                      actions.setQuery("");
                    },
                    onDecreaseProduct: actions.removeProduct,
                    onProductSelect: actions.addProduct,
                    onQueryChange: actions.setQuery,
                    onReloadCatalog: actions.reloadCatalog,
                    onSelectCategory: actions.setSelectedCategoryId,
                    query,
                    selectedCategoryId,
                    selectedMode,
                    selectedProductQuantities,
                    strings,
                    tokens: theme,
                  },
                }}
                delivery={{
                  addresses,
                  checkoutConfig: config,
                  currentFreightPrice: viewModel.currentFreightPrice,
                  formatMoney: formatClientCheckoutMoney,
                  freightOptions,
                  isAddingAddress,
                  newAddressDraft,
                  newAddressFields: config.addressFields.map((field) => ({
                    key: field.key,
                    label: strings.deliveryStep.common[field.labelKey],
                    placeholder: strings.deliveryStep.common.addressPlaceholders[field.placeholderKey],
                  })),
                  onBack: () => actions.setCurrentStep("montagem"),
                  onNext: () => requestProtectedStep("pagamento"),
                  onSetAddingAddress: actions.setIsAddingAddress,
                  onSelectAddress: actions.setSelectedAddressId,
                  onSelectDeliveryDay: actions.setSelectedDeliveryDay,
                  onSelectFreight: actions.setSelectedFreight,
                  addressSaveState,
                  canSaveNewAddress,
                  onSubmitNewAddress: actions.submitNewAddress,
                  onUpdateNewAddressDraft: actions.updateNewAddressDraft,
                  selectedAddressId,
                  selectedDeliveryDay,
                  selectedFreight,
                  selectedMode,
                  strings,
                  tokens: theme,
                }}
                payment={{
                  onBack: () => actions.setCurrentStep("entrega"),
                  onNext: () => requestProtectedStep("resumo"),
                  onSelectPaymentMethod: actions.setSelectedPaymentMethod,
                  paymentCopy,
                  paymentMethods,
                  selectedPaymentMethod,
                  tokens: theme,
                }}
                review={{
                  currentSubscriptionPlan: viewModel.currentSubscriptionPlan,
                  finalTotal: viewModel.finalTotal,
                  formatMoney: formatClientCheckoutMoney,
                  onBack: () => actions.setCurrentStep("pagamento"),
                  onFinish: actions.submitOrder,
                  createdOrderCode: orderCreateState.createdOrderCode,
                  isSubmitting: orderCreateState.isLoading,
                  reviewCopy: strings.reviewStep,
                  selectedAddressSummary: viewModel.selectedAddressSummary,
                  selectedMode,
                  selectedPaymentLabel: selectedPayment?.label || paymentCopy.methods.pix,
                  selectedProductEntries: viewModel.selectedProductEntries,
                  submitError: typeof orderCreateState.error?.detail === "string"
                    ? orderCreateState.error.detail
                    : orderCreateState.error
                      ? strings.reviewStep.submitError
                      : "",
                  strings,
                  tokens: theme,
                }}
              />
            )}
            summary={currentStep === "montagem" ? (
              <CheckoutFlowSummary
                activeSubscription={checkout.activeSubscription}
                activeSubscriptionLabel={viewModel.activeSubscriptionLabel}
                currentStep={currentStep}
                currentSubscriptionPlan={viewModel.currentSubscriptionPlan}
                formatMeasure={formatClientCheckoutMeasure}
                onAddProduct={actions.addProduct}
                onNextStep={() => requestProtectedStep("entrega")}
                onRemoveProduct={actions.removeProduct}
                selectedMode={selectedMode}
                selectedProductEntries={viewModel.selectedProductEntries}
                stepOrder={config.stepOrder}
                strings={strings}
                subscriptionSummaryUsage={viewModel.subscriptionSummaryUsage}
                title={strings.summary.title}
                tokens={theme}
              />
            ) : undefined}
          />
          ) : null}
        </Stack>
      </Container>
    </ScrollContainer>
  );
};
