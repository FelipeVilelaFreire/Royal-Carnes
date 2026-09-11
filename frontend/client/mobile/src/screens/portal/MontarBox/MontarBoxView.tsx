import React from "react";
import { Button } from "@foundation/ui/native/Button";
import { Container, Stack } from "@foundation/ui/native/Layout";
import { Surface } from "@foundation/ui/native/Surface";
import { Text } from "@foundation/ui/native/Text";
import { useClientCheckout } from "../../../../../shared-core/hooks/useClientCheckout";
import type { useClientStrings } from "../../../../../shared-core/hooks/useClientStrings";
import { formatClientCheckoutMoney } from "../../../../../shared-core/utils/checkout.formatters";
import { createMobileAppShellConfig, type AppThemeMode } from "@royalprime/client/manifest/portal/native-appshell.config";
import { CheckoutStepTracker } from "./pedido/CheckoutStepTracker";
import { DeliveryStep } from "./pedido/DeliveryStep";
import { ModeSelector } from "./pedido/ModeSelector";
import { PaymentStep } from "./pedido/PaymentStep";
import { ProductCatalogStep } from "./pedido/ProductCatalogStep";
import { ReviewStep } from "./pedido/ReviewStep";
import { createPedidoStyles } from "./pedido/styles";

export interface MontarBoxViewProps {
  activePath?: string;
  isAuthenticated?: boolean;
  strings: ReturnType<typeof useClientStrings>;
  themeMode?: AppThemeMode;
}

export const MontarBoxView: React.FC<MontarBoxViewProps> = ({
  isAuthenticated = true,
  strings: clientStrings,
  themeMode = "dark",
}) => {
  const mobileConfig = createMobileAppShellConfig(themeMode) as any;
  const theme = mobileConfig.theme;
  const styles = createPedidoStyles(theme);
  const strings = clientStrings.pedido;
  const checkout = useClientCheckout({ isAuthenticated });
  const {
    actions,
    addresses,
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

  return (
    <Container style={styles.page}>
      <Stack style={styles.stack}>
        <Surface style={styles.panel}>
          <Stack style={styles.compactStack}>
            <Text style={styles.accent} variant="caption">{strings.hero.badge}</Text>
            <Text style={styles.title} variant="h1">{strings.hero.title}</Text>
            <Text style={styles.muted}>{strings.hero.description}</Text>
          </Stack>
        </Surface>

        <ModeSelector
          modeOrder={config.modeOrder}
          onSelectMode={actions.selectMode}
          selectedMode={selectedMode}
          strings={strings}
          tokens={theme}
        />

        {selectedMode ? (
          <Stack style={styles.stack}>
            <CheckoutStepTracker
              currentStep={currentStep}
              stepOrder={config.stepOrder}
              steps={strings.steps}
              tokens={theme}
            />

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
                onNext={() => actions.setCurrentStep("pagamento")}
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
                onNext={() => actions.setCurrentStep("resumo")}
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
              <Surface style={styles.panel}>
                <Stack style={styles.compactStack}>
                  <Text style={styles.title}>{strings.summary.title}</Text>
                  <Text style={styles.muted}>{strings.summary.selectedItems}</Text>
                  <Text style={styles.accent}>{String(viewModel.selectedUnitsCount)}</Text>
                  <Text style={styles.muted}>{strings.summary.placeholder}</Text>
                  <Button onAction={() => actions.setCurrentStep("entrega")}>{strings.summary.nextStep}</Button>
                </Stack>
              </Surface>
            ) : null}
          </Stack>
        ) : (
          <Surface style={styles.panel}>
            <Text style={styles.muted}>{strings.summary.empty}</Text>
          </Surface>
        )}
      </Stack>
    </Container>
  );
};
