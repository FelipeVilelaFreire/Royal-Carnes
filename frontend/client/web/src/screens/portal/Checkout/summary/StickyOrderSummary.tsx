import React from "react";
import { Badge, Button, Stack, Surface, Text } from "@foundation/ui";
import { OrderSummaryItem } from "@royalprime/product-components/ecommerce";
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
  onAddProduct: (product: ClientCheckoutProduct) => void;
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
  selectedUtensilCount: number;
  stepOrder: ClientCheckoutStepKey[];
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
  onAddProduct,
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
  selectedUtensilCount,
  stepOrder,
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
  const summaryBadge = selectedMode
    ? selectedMode === "subscription"
      ? strings.summary.modePlanBadge
        .replace("{mode}", activeSubscription ? strings.summary.activeSubscriptionMode : strings.modes[selectedMode].title)
        .replace("{plan}", activeSubscriptionLabel || currentSubscriptionPlan.name)
      : strings.modes[selectedMode].title
    : null;
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
  const productGroupKey = (product: ClientCheckoutProduct) => (
    product.kind === "kit" && product.tags.includes("acompanhamento") ? "side" : product.kind
  );
  const productGroupLabel = (key: ClientCheckoutProduct["kind"] | "side") => ({
    meat: strings.summary.meatUsage,
    charcoal: strings.summary.charcoalUsage,
    seasoning: strings.summary.seasoningUsage,
    side: strings.summary.sideUsage,
    utensil: strings.summary.utensilUsage,
    kit: strings.summary.selectedItems,
  })[key];
  const productGroups = selectedProductEntries.reduce<Array<{
    key: ClientCheckoutProduct["kind"] | "side";
    entries: SummaryProductEntry[];
  }>>((groups, entry) => {
    const key = productGroupKey(entry.product);
    const existingGroup = groups.find((group) => group.key === key);
    if (existingGroup) {
      existingGroup.entries.push(entry);
      return groups;
    }
    groups.push({ entries: [entry], key });
    return groups;
  }, []);
  const usageByLabel = new Map(subscriptionUsageRows.map((row) => [row.label, row.value]));

  return (
    <Surface appearance="soft" as="aside" className={styles.summary}>
      <Stack gap="sm">
        <div className={styles.summaryHeader}>
          <Text as="h2" className={styles.summaryTitle} variant="h3" tone="inherit">
            {strings.summary.title}
          </Text>
          {summaryBadge ? (
            <Badge appearance="soft" className={styles.summaryModeBadge} level="xs" tone="primary">
              {summaryBadge}
            </Badge>
          ) : null}
        </div>
        <div className={styles.summaryProgress}>
          {stepOrder.map((step, index) => (
            <span
              aria-current={step === currentStep ? "step" : undefined}
              aria-label={strings.steps[step]}
              className={styles.summaryProgressItem}
              data-current={step === currentStep || undefined}
              key={step}
            >
              {index + 1}
            </span>
          ))}
        </div>

        {selectedMode ? (
          <>
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

            {selectedProductEntries.length ? (
              <Stack className={styles.summarySelections} gap="sm">
                {productGroups.map(({ entries, key }) => {
                  const label = productGroupLabel(key);
                  return (
                    <section className={styles.summarySelectionGroup} key={key}>
                      <div className={styles.summarySelectionHeader}>
                        <Text as="h3" className={styles.summarySelectionTitle} tone="inherit" variant="caption" weight="semibold">
                          {label}
                        </Text>
                        {selectedMode === "subscription" && usageByLabel.get(label) ? (
                          <Text as="span" className={styles.summarySelectionUsage} tone="inherit" variant="caption">
                            {usageByLabel.get(label)}
                          </Text>
                        ) : null}
                      </div>
                      <Stack gap="xs">
                        {entries.slice(0, 5).map(({ product, quantity }) => (
                          <OrderSummaryItem
                            detail={product.weightLabel || product.unit}
                            image={product.image}
                            key={product.id}
                            name={product.name}
                            priceLabel={selectedMode === "subscription" ? undefined : formatMoney(product.price * quantity)}
                            quantityControl={{
                              decrementAriaLabel: `${strings.productCard.decreaseQuantity}: ${product.name}`,
                              incrementAriaLabel: `${strings.productCard.increaseQuantity}: ${product.name}`,
                              onDecrement: () => onRemoveProduct(product.id),
                              onIncrement: () => onAddProduct(product),
                              valueLabel: String(quantity),
                            }}
                          />
                        ))}
                      </Stack>
                    </section>
                  );
                })}
              </Stack>
            ) : null}

            {selectedMode !== "subscription" ? (
              <div className={styles.summaryTotal}>
                <Text as="span" className={styles.summaryTotalLabel} variant="caption" tone="inherit">
                  {strings.summary.variableEstimate}
                </Text>
                <Text as="strong" className={styles.summaryTotalValue} variant="h3" tone="inherit">
                  {formatMoney(orderEstimateTotal)}
                </Text>
              </div>
            ) : null}

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


