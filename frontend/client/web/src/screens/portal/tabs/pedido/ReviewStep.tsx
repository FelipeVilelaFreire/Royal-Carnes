import React from "react";
import { Button, Grid, Inline, Stack, Surface, Text } from "@foundation/ui";
import type {
  ClientCheckoutFreightOptionKey,
  ClientCheckoutProduct,
  ClientCheckoutProductCategory,
  ClientCheckoutProductExperience,
  ClientCheckoutSubscriptionPlan,
} from "@/view-models/checkout.view-model";
import { CheckoutPanel } from "./CheckoutPanel";
import { SummaryRow } from "./SummaryRow";
import styles from "../PedidoView.module.css";

export interface ReviewStepProps {
  categoryById: Map<string, ClientCheckoutProductCategory>;
  currentFreightOption?: { key: ClientCheckoutFreightOptionKey; label: string; price: number };
  currentFreightPrice: number;
  currentSubscriptionPlan: ClientCheckoutSubscriptionPlan;
  finalTotal: number;
  formatMeasure: (value: number, unit: string) => string;
  formatMoney: (value: number) => string;
  onBack: () => void;
  onFinish: () => void;
  reviewCopy: any;
  selectedAddressSummary: string;
  selectedDeliveryDay: number;
  selectedInstallments: number;
  selectedMode: ClientCheckoutProductExperience;
  selectedPaymentLabel: string;
  selectedProductEntries: Array<{ product: ClientCheckoutProduct; quantity: number }>;
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
  categoryById,
  currentFreightOption,
  currentFreightPrice,
  currentSubscriptionPlan,
  finalTotal,
  formatMeasure,
  formatMoney,
  onBack,
  onFinish,
  reviewCopy,
  selectedAddressSummary,
  selectedDeliveryDay,
  selectedInstallments,
  selectedMode,
  selectedPaymentLabel,
  selectedProductEntries,
  selectedUnitsCount,
  strings,
  subscriptionCycleCharcoalUsed,
  subscriptionCycleSeasoningsUsed,
  subscriptionCycleSidesUsed,
  subscriptionCycleUtensilsUsed,
  subscriptionCycleWeightUsed,
  tokens,
}) => (
  <CheckoutPanel
    badge={reviewCopy.badge}
    description={reviewCopy.description}
    title={reviewCopy.title}
  >
    <Stack gap="lg">
      <Grid className={styles.reviewSummaryGrid}>
        <Surface appearance="soft" className={styles.reviewCard}>
          <Text as="h3" tone="inherit" variant="h3">{reviewCopy.orderTitle}</Text>
          <SummaryRow label={strings.summary.selectedMode} value={strings.modes[selectedMode].title} muted={tokens.textMuted} text={tokens.text} />
          {selectedMode === "subscription" ? (
            <SummaryRow label={strings.summary.selectedPlan} value={currentSubscriptionPlan.name} muted={tokens.textMuted} text={tokens.text} />
          ) : null}
          <SummaryRow
            label={selectedMode === "subscription" ? strings.summary.selectedLimit : strings.summary.selectedItems}
            value={String(selectedUnitsCount)}
            muted={tokens.textMuted}
            text={tokens.text}
          />
        </Surface>

        <Surface appearance="soft" className={styles.reviewCard}>
          <Text as="h3" tone="inherit" variant="h3">{reviewCopy.deliveryTitle}</Text>
          <SummaryRow label={strings.summary.deliveryAddress} value={selectedAddressSummary} muted={tokens.textMuted} text={tokens.text} />
          {selectedMode === "royalBox" ? (
            <SummaryRow
              label={strings.summary.recurrenceDay}
              value={`${strings.deliveryStep.royalBox.deliveryDayPrefix} ${selectedDeliveryDay}`}
              muted={tokens.textMuted}
              text={tokens.text}
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
            muted={tokens.textMuted}
            text={tokens.text}
          />
        </Surface>

        <Surface appearance="soft" className={styles.reviewCard}>
          <Text as="h3" tone="inherit" variant="h3">{reviewCopy.paymentTitle}</Text>
          <SummaryRow label={strings.summary.selectedPayment} value={selectedPaymentLabel} muted={tokens.textMuted} text={tokens.text} />
          <SummaryRow
            label={strings.paymentStep.installmentsTitle}
            value={`${selectedInstallments}${strings.paymentStep.installmentsSuffix}`}
            muted={tokens.textMuted}
            text={tokens.text}
          />
        </Surface>
      </Grid>

      <Grid className={styles.reviewTotalGrid}>
        <Surface appearance="soft" className={styles.reviewCard}>
          <Text as="h3" tone="inherit" variant="h3">{reviewCopy.itemsTitle}</Text>
          {selectedProductEntries.length ? (
            <Stack gap="sm">
              {selectedProductEntries.map(({ product, quantity }) => (
                <div className={styles.summaryItem} key={product.id}>
                  <span>{quantity}x {product.name}</span>
                  {selectedMode === "subscription" ? (
                    <span>{categoryById.get(product.categoryId)?.name || strings.productCard.categoryLabel}</span>
                  ) : (
                    <span>{formatMoney(product.price * quantity)}</span>
                  )}
                </div>
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
              <SummaryRow label={strings.summary.meatUsage} value={`${formatMeasure(subscriptionCycleWeightUsed, "kg")}/${formatMeasure(currentSubscriptionPlan.proteinKgLimit, "kg")}`} muted={tokens.textMuted} text={tokens.text} />
              <SummaryRow label={strings.summary.charcoalUsage} value={`${formatMeasure(subscriptionCycleCharcoalUsed, "kg")}/${formatMeasure(currentSubscriptionPlan.charcoalKgLimit, "kg")}`} muted={tokens.textMuted} text={tokens.text} />
              <SummaryRow label={strings.summary.seasoningUsage} value={`${subscriptionCycleSeasoningsUsed}/${currentSubscriptionPlan.seasoningSelectionLimit}`} muted={tokens.textMuted} text={tokens.text} />
              <SummaryRow label={strings.summary.sideUsage} value={`${subscriptionCycleSidesUsed}/${currentSubscriptionPlan.sideSelectionLimit}`} muted={tokens.textMuted} text={tokens.text} />
              <SummaryRow label={strings.summary.utensilUsage} value={`${subscriptionCycleUtensilsUsed}/${currentSubscriptionPlan.utensilSelectionLimit}`} muted={tokens.textMuted} text={tokens.text} />
            </Stack>
          ) : null}
        </Surface>
      </Grid>

      <Inline justify="between">
        <Button appearance="outline" onClick={onBack}>
          {reviewCopy.back}
        </Button>
        <Button appearance="solid" className={styles.checkoutPrimaryAction} tone="neutral" onClick={onFinish}>
          {reviewCopy.finish}
        </Button>
      </Inline>
    </Stack>
  </CheckoutPanel>
);
