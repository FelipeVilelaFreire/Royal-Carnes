import React from "react";
import { Button, Stack, Surface, Text } from "@foundation/ui";
import type { ClientCheckoutStepKey } from "@/manifest/checkout.config";
import type { ClientCheckoutProduct, ClientCheckoutProductExperience } from "@/view-models/checkout.view-model";
import { SummaryRow } from "./SummaryRow";
import styles from "../CheckoutView.module.css";

type SummaryTokens = {
  background: string;
  border: string;
  charcoal?: string;
  surfaceContainer: string;
  text: string;
  textMuted: string;
};

type SummaryProductEntry = {
  product: ClientCheckoutProduct;
  quantity: number;
};

export interface StickyOrderSummaryProps {
  activeSubscription?: {
    nextBillingLabel: string;
  };
  activeSubscriptionLabel: string;
  currentFreightOption?: {
    label: string;
  };
  currentFreightPrice: number;
  currentStep: ClientCheckoutStepKey;
  currentSubscriptionPlan: {
    charcoalKgLimit: number;
    monthlyPrice: number;
    proteinKgLimit: number;
    seasoningSelectionLimit: number;
    sideSelectionLimit: number;
    utensilSelectionLimit: number;
    name: string;
  };
  formatMeasure: (value: number, unit: string) => string;
  formatMoney: (value: number) => string;
  onNextStep: () => void;
  onRemoveProduct: (productId: string) => void;
  orderEstimateTotal: number;
  selectedAddressSummary: string;
  selectedCharcoalKg: number;
  selectedDeliveryDay: number;
  selectedMode: ClientCheckoutProductExperience | null;
  selectedPaymentLabel: string;
  selectedProductEntries: SummaryProductEntry[];
  selectedProteinKg: number;
  selectedSeasoningCount: number;
  selectedSideCount: number;
  selectedUnitsCount: number;
  selectedUtensilCount: number;
  strings: any;
  subscriptionCycleCharcoalUsed: number;
  subscriptionCycleCutsUsed: number;
  subscriptionCycleSeasoningsUsed: number;
  subscriptionCycleSidesUsed: number;
  subscriptionCycleUtensilsUsed: number;
  subscriptionCycleWeightUsed: number;
  subscriptionSummaryUsage: {
    charcoalKgLimit: number;
    cutsLimit: number;
    seasoningsLimit: number;
    sidesLimit: number;
    utensilsLimit: number;
    weightKgLimit: number;
  } | null;
  tokens: SummaryTokens;
}

export const StickyOrderSummary: React.FC<StickyOrderSummaryProps> = ({
  activeSubscription,
  activeSubscriptionLabel,
  currentFreightOption,
  currentFreightPrice,
  currentStep,
  currentSubscriptionPlan,
  formatMeasure,
  formatMoney,
  onNextStep,
  onRemoveProduct,
  orderEstimateTotal,
  selectedAddressSummary,
  selectedCharcoalKg,
  selectedDeliveryDay,
  selectedMode,
  selectedPaymentLabel,
  selectedProductEntries,
  selectedProteinKg,
  selectedSeasoningCount,
  selectedSideCount,
  selectedUnitsCount,
  selectedUtensilCount,
  strings,
  subscriptionCycleCharcoalUsed,
  subscriptionCycleCutsUsed,
  subscriptionCycleSeasoningsUsed,
  subscriptionCycleSidesUsed,
  subscriptionCycleUtensilsUsed,
  subscriptionCycleWeightUsed,
  subscriptionSummaryUsage,
  tokens,
}) => {
  const hasSelectedProduct = (predicate: (product: ClientCheckoutProduct) => boolean) => (
    selectedProductEntries.some(({ product }) => predicate(product))
  );
  const subscriptionUsageRows = selectedMode === "subscription"
    ? [
      {
        isVisible: subscriptionCycleCutsUsed > 0 || subscriptionCycleWeightUsed > 0 || hasSelectedProduct((product) => product.kind === "meat"),
        label: strings.summary.meatUsage,
        value: subscriptionSummaryUsage
          ? `${formatMeasure(subscriptionCycleWeightUsed, "kg")}/${formatMeasure(subscriptionSummaryUsage.weightKgLimit, "kg")}`
          : `${formatMeasure(selectedProteinKg, "kg")}/${formatMeasure(currentSubscriptionPlan.proteinKgLimit, "kg")}`,
      },
      {
        isVisible: subscriptionCycleCharcoalUsed > 0 || hasSelectedProduct((product) => product.kind === "charcoal"),
        label: strings.summary.charcoalUsage,
        value: subscriptionSummaryUsage
          ? `${formatMeasure(subscriptionCycleCharcoalUsed, "kg")}/${formatMeasure(subscriptionSummaryUsage.charcoalKgLimit, "kg")}`
          : `${formatMeasure(selectedCharcoalKg, "kg")}/${formatMeasure(currentSubscriptionPlan.charcoalKgLimit, "kg")}`,
      },
      {
        isVisible: subscriptionCycleSeasoningsUsed > 0 || hasSelectedProduct((product) => product.kind === "seasoning"),
        label: strings.summary.seasoningUsage,
        value: subscriptionSummaryUsage
          ? `${subscriptionCycleSeasoningsUsed}/${subscriptionSummaryUsage.seasoningsLimit}`
          : `${selectedSeasoningCount}/${currentSubscriptionPlan.seasoningSelectionLimit}`,
      },
      {
        isVisible: subscriptionCycleSidesUsed > 0 || hasSelectedProduct((product) => product.kind === "kit" && product.tags.includes("acompanhamento")),
        label: strings.summary.sideUsage,
        value: subscriptionSummaryUsage
          ? `${subscriptionCycleSidesUsed}/${subscriptionSummaryUsage.sidesLimit}`
          : `${selectedSideCount}/${currentSubscriptionPlan.sideSelectionLimit}`,
      },
      {
        isVisible: subscriptionCycleUtensilsUsed > 0 || hasSelectedProduct((product) => product.kind === "utensil"),
        label: strings.summary.utensilUsage,
        value: subscriptionSummaryUsage
          ? `${subscriptionCycleUtensilsUsed}/${subscriptionSummaryUsage.utensilsLimit}`
          : `${selectedUtensilCount}/${currentSubscriptionPlan.utensilSelectionLimit}`,
      },
    ].filter((row) => row.isVisible)
    : [];

  return (
    <Surface appearance="soft" as="aside" className={styles.summary}>
      <Stack gap="md">
        <Text as="h2" className={styles.summaryTitle} variant="h3" tone="inherit">
          {strings.summary.title}
        </Text>

        {selectedMode ? (
          <>
            <SummaryRow
              label={strings.summary.selectedMode}
              value={selectedMode === "subscription" && activeSubscription ? strings.summary.activeSubscriptionMode : strings.modes[selectedMode].title}
            />
            {selectedMode === "subscription" ? (
              <SummaryRow
                label={activeSubscription ? strings.summary.linkedPlan : strings.summary.selectedPlan}
                value={activeSubscriptionLabel || currentSubscriptionPlan.name}
              />
            ) : null}
            <SummaryRow
              label={subscriptionSummaryUsage ? strings.summary.cycleCuts : selectedMode === "subscription" ? strings.summary.selectedLimit : strings.summary.selectedItems}
              value={subscriptionSummaryUsage ? `${subscriptionCycleCutsUsed} / ${subscriptionSummaryUsage.cutsLimit}` : String(selectedUnitsCount)}
            />

            {currentStep !== "montagem" ? (
              <Surface appearance="soft" className={styles.summaryGroup}>
                <Stack gap="sm">
                  <SummaryRow label={strings.summary.deliveryAddress} value={selectedAddressSummary} />
                  {selectedMode === "royalBox" ? (
                    <SummaryRow
                      label={strings.summary.recurrenceDay}
                      value={`${strings.deliveryStep.royalBox.deliveryDayPrefix} ${selectedDeliveryDay}`}
                    />
                  ) : null}
                  <SummaryRow
                    label={strings.summary.selectedFreight}
                    value={
                      selectedMode === "royalDelivery" && currentFreightOption
                        ? `${currentFreightOption.label} - ${formatMoney(currentFreightPrice)}`
                        : selectedMode === "royalDelivery"
                          ? strings.summary.freightNotSelected
                          : strings.deliveryStep.royalDelivery.includedFreight
                    }
                  />
                  {currentStep === "pagamento" ? (
                    <SummaryRow label={strings.summary.selectedPayment} value={selectedPaymentLabel} />
                  ) : null}
                </Stack>
              </Surface>
            ) : null}

            {subscriptionUsageRows.length ? (
              <Surface appearance="soft" className={styles.summaryGroup}>
                <Stack gap="sm">
                  {subscriptionUsageRows.map((row) => (
                    <SummaryRow key={row.label} label={row.label} value={row.value} />
                  ))}
                </Stack>
              </Surface>
            ) : null}

            {selectedProductEntries.length ? (
              <Stack gap="xs">
                {selectedProductEntries.slice(0, 5).map(({ product, quantity }) => (
                  <div key={product.id} className={styles.summaryItem}>
                    <Text as="span" className={styles.summaryMutedText} variant="caption" tone="inherit">
                      {strings.format.productQuantity.replace("{quantity}", String(quantity)).replace("{product}", product.name)}
                    </Text>
                    {selectedMode === "subscription" ? (
                      <Button
                        appearance="transparent"
                        className={styles.checkoutSubtleAction}
                        size="sm"
                        tone="neutral"
                        type="button"
                        onClick={() => onRemoveProduct(product.id)}
                      >
                        {strings.summary.remove}
                      </Button>
                    ) : (
                    <Text as="span" className={styles.summaryMutedText} variant="caption" tone="inherit">
                      {formatMoney(product.price * quantity)}
                    </Text>
                    )}
                  </div>
                ))}
              </Stack>
            ) : (
              <Text className={styles.summaryMutedText} tone="inherit">
                {strings.summary.placeholder}
              </Text>
            )}

            <div className={styles.summaryTotal}>
              <Text as="span" className={styles.summaryTotalLabel} variant="caption" tone="inherit">
                {selectedMode === "subscription"
                  ? activeSubscription ? strings.summary.activeSubscriptionLabel : strings.summary.fixedPlanPrice
                  : strings.summary.variableEstimate}
              </Text>
              <Text as="strong" className={styles.summaryTotalValue} variant="h3" tone="inherit">
                {selectedMode === "subscription" ? activeSubscriptionLabel || formatMoney(currentSubscriptionPlan.monthlyPrice) : formatMoney(orderEstimateTotal)}
              </Text>
              {selectedMode === "subscription" ? (
                <Text className={styles.summaryMutedText} variant="caption" tone="inherit">
                  {activeSubscription
                    ? `${strings.summary.subscriptionRenewPrefix} ${activeSubscription.nextBillingLabel}. ${strings.summary.activeSubscriptionHintSuffix}`
                    : strings.summary.noVariableEstimate}
                </Text>
              ) : null}
            </div>

            <Button appearance="solid" className={styles.summaryPrimaryAction} tone="neutral" onClick={onNextStep}>
              {currentStep === "montagem"
                ? strings.summary.nextStep
                : currentStep === "entrega"
                  ? strings.summary.paymentNextStep
                  : strings.summary.finishStep}
            </Button>
          </>
        ) : (
          <Text className={styles.summaryMutedText} tone="inherit">
            {strings.summary.empty}
          </Text>
        )}
      </Stack>
    </Surface>
  );
};


