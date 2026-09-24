import React from "react";
import { Badge, Button, Stack, Surface, Text } from "@foundation/ui";
import { BoxIcon, StoreIcon, TruckIcon } from "@foundation/ui/web/Icon/AppIcons";
import { formatClientCheckoutUsage } from "@royalprime/client/utils/checkout.formatters";
import { OrderSummaryItem } from "@royalprime/product-components/ecommerce";
import type { ClientCheckoutStepKey } from "@/manifest/checkout.config";
import { getClientCheckoutProductMeasure } from "@/view-models/checkout.view-model";
import type { ClientCheckoutCycleUsage, ClientCheckoutProduct, ClientCheckoutProductExperience, ClientCheckoutSubscriptionPlan } from "@/view-models/checkout.view-model";
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
  currentSubscriptionPlan: ClientCheckoutSubscriptionPlan;
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
  subscriptionSummaryUsage: ClientCheckoutCycleUsage | null;
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
      ? currentSubscriptionPlan.name
      : strings.modes[selectedMode].title
    : null;
  const hasSelectedProduct = (predicate: (product: ClientCheckoutProduct) => boolean) => (
    selectedProductEntries.some(({ product }) => predicate(product))
  );
  const selectedQuantityForCapacity = (capacityKey: string, measurementUnitSymbol?: string | null) => {
    const isWeightCapacity = measurementUnitSymbol?.toLowerCase() === "kg";
    const knownCapacityKeys = new Set(currentSubscriptionPlan.capacity.map((capacity) => capacity.key));
    return selectedProductEntries
      .filter(({ product }) => {
        const matchesExactCapacity = product.productKey === capacityKey || product.tags.includes(capacityKey);
        if (matchesExactCapacity) return true;

        const isMeatFamilyCapacity = capacityKey === "carnes" && product.kind === "meat";
        const belongsToAnotherCapacity = product.tags.some((tag) => knownCapacityKeys.has(tag));
        return isMeatFamilyCapacity && !belongsToAnotherCapacity;
      })
      .reduce((total, { product, quantity }) => (
        total + (isWeightCapacity ? getClientCheckoutProductMeasure(product) : 1) * quantity
      ), 0);
  };
  const backendCapacityRows = (subscriptionSummaryUsage?.capacity || [])
    .filter((capacity) => capacity.limitQuantity > 0)
    .map((capacity) => ({
      isVisible: true,
      label: capacity.label,
      value: formatClientCheckoutUsage(
        capacity.usedQuantity + selectedQuantityForCapacity(capacity.key, capacity.measurementUnitSymbol),
        capacity.limitQuantity,
        capacity.measurementUnitSymbol || "",
        formatMeasure,
      ),
    }));
  const planCapacityRows = currentSubscriptionPlan.capacity
    .filter((capacity) => capacity.limitQuantity > 0)
    .map((capacity) => ({
      isVisible: true,
      label: capacity.label,
      value: formatClientCheckoutUsage(
        selectedQuantityForCapacity(capacity.key, capacity.measurementUnitSymbol),
        capacity.limitQuantity,
        capacity.measurementUnitSymbol || "",
        formatMeasure,
      ),
    }));
  const fallbackSubscriptionUsageRows = [
      {
        isVisible: subscriptionCycleCutsUsed > 0 || subscriptionCycleWeightUsed > 0 || hasSelectedProduct((product) => product.kind === "meat"),
        label: strings.summary.meatUsage,
        value: subscriptionSummaryUsage
          ? formatClientCheckoutUsage(subscriptionCycleWeightUsed, subscriptionSummaryUsage.weightKgLimit, "kg", formatMeasure)
          : formatClientCheckoutUsage(selectedProteinKg, currentSubscriptionPlan.proteinKgLimit, "kg", formatMeasure),
      },
      {
        isVisible: subscriptionCycleCharcoalUsed > 0 || hasSelectedProduct((product) => product.kind === "charcoal"),
        label: strings.summary.charcoalUsage,
        value: subscriptionSummaryUsage
          ? formatClientCheckoutUsage(subscriptionCycleCharcoalUsed, subscriptionSummaryUsage.charcoalKgLimit, "kg", formatMeasure)
          : formatClientCheckoutUsage(selectedCharcoalKg, currentSubscriptionPlan.charcoalKgLimit, "kg", formatMeasure),
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
    ].filter((row) => row.isVisible);
  const subscriptionUsageRows = selectedMode === "subscription"
    ? backendCapacityRows.length ? backendCapacityRows : planCapacityRows.length ? planCapacityRows : fallbackSubscriptionUsageRows
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
  return (
    <Surface appearance="soft" as="aside" className={styles.summary}>
      <Stack className={styles.summaryContent} gap="sm">
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
          {stepOrder.map((step, index) => {
            const state = index < stepOrder.indexOf(currentStep) ? "done" : step === currentStep ? "current" : "pending";

            return (
              <React.Fragment key={step}>
                <span
                  aria-current={step === currentStep ? "step" : undefined}
                  aria-label={strings.steps[step]}
                  className={styles.summaryProgressItem}
                  data-state={state}
                >
                  {index + 1}
                </span>
                {index < stepOrder.length - 1 ? (
                  <span aria-hidden="true" className={styles.summaryProgressConnector} data-state={state} />
                ) : null}
              </React.Fragment>
            );
          })}
        </div>

        {subscriptionUsageRows.length ? (
          <div className={styles.summaryCapacity}>
            {subscriptionUsageRows.map((row) => (
              <SummaryRow key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
        ) : null}

        {selectedMode ? (
          <>
            {currentStep !== "montagem" ? (
              <Surface appearance="soft" className={styles.summaryGroup}>
                <Stack gap="sm">
                  <SummaryRow icon={<StoreIcon size={16} />} label={strings.summary.deliveryAddress} truncate value={selectedAddressSummary} />
                  {selectedMode === "royalBox" ? (
                    <SummaryRow
                      icon={<BoxIcon size={16} />}
                      label={strings.summary.recurrenceDay}
                      value={`${strings.deliveryStep.royalBox.deliveryDayPrefix} ${selectedDeliveryDay}`}
                    />
                  ) : null}
                  {selectedMode !== "royalDelivery" || currentFreightOption ? (
                    <SummaryRow
                      detail={selectedMode === "royalDelivery" && currentFreightOption ? formatMoney(currentFreightPrice) : undefined}
                      icon={<TruckIcon size={16} />}
                      label={strings.summary.selectedFreight}
                      value={
                        selectedMode === "royalDelivery" && currentFreightOption
                          ? currentFreightOption.label
                          : strings.deliveryStep.royalDelivery.includedFreight
                      }
                    />
                  ) : null}
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
                      </div>
                      <Stack gap="xs">
                        {entries.slice(0, 5).map(({ product, quantity }) => (
                          <OrderSummaryItem
                            density="comfortable"
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

          </>
        ) : (
          <Text className={styles.summaryMutedText} tone="inherit">
            {strings.summary.empty}
          </Text>
        )}
      </Stack>
      {selectedMode ? (
        <div className={styles.summaryActionArea}>
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
          <Button appearance="soft" className={styles.summaryPrimaryAction} size="md" tone="primary" onClick={onNextStep}>
            {currentStep === "montagem"
              ? strings.summary.nextStep
              : currentStep === "entrega"
                ? strings.summary.paymentNextStep
                : strings.summary.finishStep}
          </Button>
        </div>
      ) : null}
    </Surface>
  );
};


