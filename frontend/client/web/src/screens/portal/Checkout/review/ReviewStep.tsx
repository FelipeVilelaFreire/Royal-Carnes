import React from "react";
import { Button, Grid, Inline, Stack, Surface, Text } from "@foundation/ui";
import { OrderSummaryItem } from "@royalprime/product-components/ecommerce";
import { formatClientCheckoutUsage } from "@royalprime/client/utils/checkout.formatters";
import type {
  ClientCheckoutFreightOptionKey,
  ClientCheckoutProduct,
  ClientCheckoutProductExperience,
  ClientCheckoutSubscriptionPlan,
} from "@/view-models/checkout.view-model";
import { CheckoutPanel } from "../layout/CheckoutPanel";
import { SummaryRow } from "../summary/SummaryRow";
import styles from "../CheckoutView.module.css";

export interface ReviewStepProps {
  currentFreightOption?: { key: ClientCheckoutFreightOptionKey; label: string; price: number };
  currentFreightPrice: number;
  currentSubscriptionPlan: ClientCheckoutSubscriptionPlan;
  finalTotal: number;
  formatMeasure: (value: number, unit: string) => string;
  formatMoney: (value: number) => string;
  onBack: () => void;
  onFinish: () => Promise<unknown>;
  createdOrderCode: string;
  isSubmitting: boolean;
  reviewCopy: any;
  selectedAddressSummary: string;
  selectedDeliveryDay: number;
  selectedMode: ClientCheckoutProductExperience;
  selectedPaymentLabel: string;
  selectedProductEntries: Array<{ product: ClientCheckoutProduct; quantity: number }>;
  submitError: string;
  selectedUnitsCount: number;
  strings: any;
  subscriptionCycleCharcoalUsed: number;
  subscriptionCycleSeasoningsUsed: number;
  subscriptionCycleSidesUsed: number;
  subscriptionCycleUtensilsUsed: number;
  subscriptionCycleWeightUsed: number;
  tokens: {
    background?: string;
    border: string;
    copper: string;
    surfaceContainer: string;
    text: string;
    textMuted: string;
  };
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  currentFreightOption,
  currentFreightPrice,
  currentSubscriptionPlan,
  finalTotal,
  formatMeasure,
  formatMoney,
  onBack,
  onFinish,
  createdOrderCode,
  isSubmitting,
  reviewCopy,
  selectedAddressSummary,
  selectedDeliveryDay,
  selectedMode,
  selectedPaymentLabel,
  selectedProductEntries,
  submitError,
  selectedUnitsCount,
  strings,
  subscriptionCycleCharcoalUsed,
  subscriptionCycleSeasoningsUsed,
  subscriptionCycleSidesUsed,
  subscriptionCycleUtensilsUsed,
  subscriptionCycleWeightUsed,
  tokens,
}) => {
  const submit = () => {
    void onFinish().catch(() => undefined);
  };

  if (createdOrderCode) {
    return (
      <CheckoutPanel badge={reviewCopy.badge} description={reviewCopy.successDescription} title={reviewCopy.successTitle}>
        <Surface appearance="soft" className={styles.reviewCard}>
          <Text as="span" className={styles.fieldLabel} tone="inherit" variant="caption">
            {reviewCopy.successOrderCode}
          </Text>
          <Text as="strong" tone="inherit" variant="h2">{createdOrderCode}</Text>
        </Surface>
      </CheckoutPanel>
    );
  }

  return (
  <CheckoutPanel
    badge={reviewCopy.badge}
    description={reviewCopy.description}
    title={reviewCopy.title}
  >
    <Stack gap="lg">
      <Grid className={styles.reviewSummaryGrid}>
        <Surface appearance="soft" className={styles.reviewCard}>
          <Text as="h3" tone="inherit" variant="h3">{reviewCopy.orderTitle}</Text>
          <SummaryRow label={strings.summary.selectedMode} value={strings.modes[selectedMode].title} />
          {selectedMode === "subscription" ? (
            <SummaryRow label={strings.summary.selectedPlan} value={currentSubscriptionPlan.name} />
          ) : null}
          <SummaryRow
            label={selectedMode === "subscription" ? strings.summary.selectedLimit : strings.summary.selectedItems}
            value={String(selectedUnitsCount)}
          />
        </Surface>

        <Surface appearance="soft" className={styles.reviewCard}>
          <Text as="h3" tone="inherit" variant="h3">{reviewCopy.deliveryTitle}</Text>
          <SummaryRow label={strings.summary.deliveryAddress} value={selectedAddressSummary} />
          {selectedMode === "royalBox" ? (
            <SummaryRow
              label={strings.summary.recurrenceDay}
              value={`${strings.deliveryStep.royalBox.deliveryDayPrefix} ${selectedDeliveryDay}`}
            />
          ) : null}
          {selectedMode !== "royalDelivery" || currentFreightOption ? (
            <SummaryRow
              label={strings.summary.selectedFreight}
              value={
                selectedMode === "royalDelivery" && currentFreightOption
                  ? `${currentFreightOption.label} - ${formatMoney(currentFreightPrice)}`
                  : strings.deliveryStep.royalDelivery.includedFreight
              }
            />
          ) : null}
        </Surface>

        <Surface appearance="soft" className={styles.reviewCard}>
          <Text as="h3" tone="inherit" variant="h3">{reviewCopy.paymentTitle}</Text>
          <SummaryRow label={strings.summary.selectedPayment} value={selectedPaymentLabel} />
        </Surface>
      </Grid>

      <Grid className={styles.reviewTotalGrid}>
        <Surface appearance="soft" className={styles.reviewCard}>
          <Text as="h3" tone="inherit" variant="h3">{reviewCopy.itemsTitle}</Text>
          {selectedProductEntries.length ? (
            <Stack gap="sm">
              {selectedProductEntries.map(({ product, quantity }) => (
                <OrderSummaryItem
                  detail={product.weightLabel || product.unit}
                  image={product.image}
                  key={product.id}
                  name={strings.format.productQuantity.replace("{quantity}", String(quantity)).replace("{product}", product.name)}
                  priceLabel={selectedMode === "subscription" ? undefined : formatMoney(product.price * quantity)}
                />
              ))}
            </Stack>
          ) : (
            <Text className={styles.optionDescription} tone="inherit">{reviewCopy.emptyItems}</Text>
          )}
        </Surface>

        <Surface appearance="soft" className={styles.reviewTotalCard}>
          <Text as="span" className={styles.fieldLabel} tone="inherit" variant="caption">
            {reviewCopy.totalTitle}
          </Text>
          <Text as="strong" tone="inherit" variant="h2">{formatMoney(finalTotal)}</Text>
          <Text className={styles.optionDescription} tone="inherit">
            {selectedMode === "subscription" ? reviewCopy.fixedPlanHint : reviewCopy.variableOrderHint}
          </Text>
          {selectedMode === "subscription" ? (
            <Stack className={styles.limitGroup} gap="sm">
              <Text as="h3" tone="inherit" variant="body" weight="semibold">{reviewCopy.limitsTitle}</Text>
              <SummaryRow label={strings.summary.meatUsage} value={formatClientCheckoutUsage(subscriptionCycleWeightUsed, currentSubscriptionPlan.proteinKgLimit, "kg", formatMeasure)} />
              <SummaryRow label={strings.summary.charcoalUsage} value={formatClientCheckoutUsage(subscriptionCycleCharcoalUsed, currentSubscriptionPlan.charcoalKgLimit, "kg", formatMeasure)} />
              <SummaryRow label={strings.summary.seasoningUsage} value={`${subscriptionCycleSeasoningsUsed}/${currentSubscriptionPlan.seasoningSelectionLimit}`} />
              <SummaryRow label={strings.summary.sideUsage} value={`${subscriptionCycleSidesUsed}/${currentSubscriptionPlan.sideSelectionLimit}`} />
              <SummaryRow label={strings.summary.utensilUsage} value={`${subscriptionCycleUtensilsUsed}/${currentSubscriptionPlan.utensilSelectionLimit}`} />
            </Stack>
          ) : null}
        </Surface>
      </Grid>

      <Inline justify="between">
        <Button appearance="outline" onClick={onBack}>
          {reviewCopy.back}
        </Button>
        <Button appearance="solid" className={styles.checkoutPrimaryAction} disabled={isSubmitting} tone="neutral" onClick={submit}>
          {isSubmitting ? reviewCopy.submitting : reviewCopy.finish}
        </Button>
      </Inline>
      {submitError ? <Text className={styles.optionDescription} tone="inherit">{submitError}</Text> : null}
    </Stack>
  </CheckoutPanel>
  );
};


