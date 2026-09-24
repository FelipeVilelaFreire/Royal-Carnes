import React from "react";
import { Button } from "@foundation/ui/native/Button";
import { Icon } from "@foundation/ui/native/Icon";
import { Inline, Stack } from "@foundation/ui/native/Layout";
import { Surface } from "@foundation/ui/native/Surface";
import { Text } from "@foundation/ui/native/Text";
import { formatClientCheckoutUsage } from "../../../../../../shared-core/utils/checkout.formatters";
import { getClientCheckoutProductMeasure } from "../../../../../../shared-core/view-models/checkout.view-model";
import type {
  ClientCheckoutCycleUsage,
  ClientCheckoutProduct,
  ClientCheckoutProductExperience,
  ClientCheckoutSelectedProductEntry,
  ClientCheckoutSubscriptionPlan,
} from "../../../../../../shared-core/view-models/checkout.view-model";
import type { ClientCheckoutStepKey } from "../../../../../../shared-core/manifest/checkout.config";
import { createCheckoutStyles } from "../checkout.styles";

export interface MobileSelectionSummaryProps {
  activeSubscription?: {
    nextBillingLabel: string;
  };
  activeSubscriptionLabel: string;
  currentStep: ClientCheckoutStepKey;
  currentSubscriptionPlan: ClientCheckoutSubscriptionPlan;
  formatMeasure: (value: number, unit: string) => string;
  onAddProduct: (product: ClientCheckoutProduct) => void;
  onNextStep: () => void;
  onRemoveProduct: (productId: string) => void;
  selectedMode: ClientCheckoutProductExperience | null;
  selectedProductEntries: ClientCheckoutSelectedProductEntry[];
  stepOrder: ClientCheckoutStepKey[];
  strings: any;
  subscriptionSummaryUsage: ClientCheckoutCycleUsage | null;
  title: string;
  tokens: any;
}

export const MobileSelectionSummary: React.FC<MobileSelectionSummaryProps> = ({
  activeSubscription,
  activeSubscriptionLabel,
  currentStep,
  currentSubscriptionPlan,
  formatMeasure,
  onAddProduct,
  onNextStep,
  onRemoveProduct,
  selectedMode,
  selectedProductEntries,
  stepOrder,
  strings,
  subscriptionSummaryUsage,
  title,
  tokens,
}) => {
  const styles = createCheckoutStyles(tokens);
  const summaryBadge = selectedMode === "subscription"
    ? currentSubscriptionPlan.name
    : selectedMode ? strings.modes[selectedMode].title : null;
  const selectedQuantityForCapacity = (capacityKey: string, measurementUnitSymbol?: string | null) => {
    const isWeightCapacity = measurementUnitSymbol?.toLowerCase() === "kg";
    const knownCapacityKeys = new Set(currentSubscriptionPlan.capacity.map((capacity) => capacity.key));

    return selectedProductEntries
      .filter(({ product }) => {
        const matchesExactCapacity = product.productKey === capacityKey || product.tags.includes(capacityKey);
        if (matchesExactCapacity) return true;

        return capacityKey === "carnes" && product.kind === "meat" && !product.tags.some((tag) => knownCapacityKeys.has(tag));
      })
      .reduce((total, { product, quantity }) => total + (isWeightCapacity ? getClientCheckoutProductMeasure(product) : 1) * quantity, 0);
  };
  const capacitySource = subscriptionSummaryUsage?.capacity?.length
    ? subscriptionSummaryUsage.capacity
    : currentSubscriptionPlan.capacity.map((capacity) => ({ ...capacity, usedQuantity: 0 }));
  const capacityRows = selectedMode === "subscription"
    ? capacitySource
      .filter((capacity) => capacity.limitQuantity > 0)
      .map((capacity) => ({
        label: capacity.label,
        value: formatClientCheckoutUsage(
          capacity.usedQuantity + selectedQuantityForCapacity(capacity.key, capacity.measurementUnitSymbol),
          capacity.limitQuantity,
          capacity.measurementUnitSymbol || "",
          formatMeasure,
        ),
      }))
    : [];

  return (
    <Surface style={styles.panel}>
      <Stack style={styles.compactStack}>
        <Inline style={styles.summaryRow}>
          <Text style={styles.title} variant="h3">{title}</Text>
          {summaryBadge ? <Text style={styles.summaryBadge} variant="caption">{summaryBadge}</Text> : null}
        </Inline>
        <Inline style={styles.summaryProgress}>
          {stepOrder.map((step, index) => (
            <Text key={step} style={{ ...styles.summaryStep, ...(step === currentStep ? styles.summaryStepCurrent : {}) }}>
              {String(index + 1)}
            </Text>
          ))}
        </Inline>

        {capacityRows.length ? (
          <Stack style={styles.summaryCapacity}>
            {capacityRows.map((row) => (
              <Inline key={row.label} style={styles.summaryRow}>
                <Text style={styles.muted}>{row.label}</Text>
                <Text style={styles.title}>{row.value}</Text>
              </Inline>
            ))}
          </Stack>
        ) : null}

        {selectedProductEntries.map(({ product, quantity }) => (
          <Surface key={product.id} style={styles.summaryProduct}>
            <Stack style={styles.compactStack}>
              <Inline style={styles.summaryRow}>
                <Stack style={styles.compactStack}>
                  <Text style={styles.title}>{product.name}</Text>
                  <Text style={styles.muted}>{product.weightLabel || product.unit}</Text>
                </Stack>
                <Inline style={styles.summaryQuantityControl}>
                  <Button
                    accessibilityLabel={strings.summary.quantityAction.replace("{action}", strings.productCard.decreaseQuantity).replace("{product}", product.name)}
                    appearance="outline"
                    icon={<Icon intent="minus" />}
                    onAction={() => onRemoveProduct(product.id)}
                    style={styles.summaryQuantityButton}
                    tone="neutral"
                  />
                  <Text style={styles.summaryQuantity}>{String(quantity)}</Text>
                  <Button
                    accessibilityLabel={strings.summary.quantityAction.replace("{action}", strings.productCard.increaseQuantity).replace("{product}", product.name)}
                    appearance="solid"
                    icon={<Icon intent="plus" />}
                    onAction={() => onAddProduct(product)}
                    style={styles.summaryQuantityButton}
                    tone="primary"
                  />
                </Inline>
              </Inline>
            </Stack>
          </Surface>
        ))}

        <Button onAction={onNextStep} style={styles.action}>
          {currentStep === "montagem" ? strings.summary.nextStep : strings.summary.finishStep}
        </Button>
      </Stack>
    </Surface>
  );
};
