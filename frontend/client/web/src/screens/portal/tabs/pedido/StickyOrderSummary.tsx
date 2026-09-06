import React from "react";
import { Button, Stack, Surface, Text } from "@foundation/ui";
import type { ClientCheckoutStepKey } from "@/manifest/checkout.config";
import type { ClientCheckoutProduct, ClientCheckoutProductExperience } from "@/view-models/checkout.view-model";
import { getCheckoutPrimaryActionStyle, getCheckoutSubtleActionStyle } from "./actionStyles";
import { SummaryRow } from "./SummaryRow";
import styles from "../PedidoView.module.css";

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
  const summaryStyle = {
    "--pedido-summary-bg": tokens.surfaceContainer,
    "--pedido-summary-border": tokens.border,
    "--pedido-summary-text": tokens.text,
    "--pedido-summary-muted": tokens.textMuted,
    "--ui-surface-bg": tokens.surfaceContainer,
    "--ui-surface-border": tokens.border,
    "--ui-surface-color": tokens.text,
  } as React.CSSProperties;

  return (
    <Surface appearance="soft" as="aside" className={styles.summary} style={summaryStyle}>
      <Stack gap="md">
        <Text as="h2" variant="h3" tone="inherit" style={{ color: tokens.text }}>
          {strings.summary.title}
        </Text>

        {selectedMode ? (
          <>
            <SummaryRow
              label={strings.summary.selectedMode}
              value={selectedMode === "subscription" && activeSubscription ? strings.summary.activeSubscriptionMode : strings.modes[selectedMode].title}
              muted={tokens.textMuted}
              text={tokens.text}
            />
            {selectedMode === "subscription" ? (
              <SummaryRow
                label={activeSubscription ? strings.summary.linkedPlan : strings.summary.selectedPlan}
                value={activeSubscriptionLabel || currentSubscriptionPlan.name}
                muted={tokens.textMuted}
                text={tokens.text}
              />
            ) : null}
            <SummaryRow
              label={subscriptionSummaryUsage ? strings.summary.cycleCuts : selectedMode === "subscription" ? strings.summary.selectedLimit : strings.summary.selectedItems}
              value={subscriptionSummaryUsage ? `${subscriptionCycleCutsUsed} / ${subscriptionSummaryUsage.cutsLimit}` : String(selectedUnitsCount)}
              muted={tokens.textMuted}
              text={tokens.text}
            />

            {currentStep !== "montagem" ? (
              <Surface appearance="soft" className={styles.summaryGroup}>
                <Stack gap="sm">
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
                  {currentStep === "pagamento" ? (
                    <SummaryRow label={strings.summary.selectedPayment} value={selectedPaymentLabel} muted={tokens.textMuted} text={tokens.text} />
                  ) : null}
                </Stack>
              </Surface>
            ) : null}

            {selectedMode === "subscription" ? (
              <Surface appearance="soft" className={styles.summaryGroup}>
                <Stack gap="sm">
                  <SummaryRow
                    label={strings.summary.meatUsage}
                    value={subscriptionSummaryUsage
                      ? `${formatMeasure(subscriptionCycleWeightUsed, "kg")}/${formatMeasure(subscriptionSummaryUsage.weightKgLimit, "kg")}`
                      : `${formatMeasure(selectedProteinKg, "kg")}/${formatMeasure(currentSubscriptionPlan.proteinKgLimit, "kg")}`}
                    muted={tokens.textMuted}
                    text={tokens.text}
                  />
                  <SummaryRow
                    label={strings.summary.charcoalUsage}
                    value={subscriptionSummaryUsage
                      ? `${formatMeasure(subscriptionCycleCharcoalUsed, "kg")}/${formatMeasure(subscriptionSummaryUsage.charcoalKgLimit, "kg")}`
                      : `${formatMeasure(selectedCharcoalKg, "kg")}/${formatMeasure(currentSubscriptionPlan.charcoalKgLimit, "kg")}`}
                    muted={tokens.textMuted}
                    text={tokens.text}
                  />
                  <SummaryRow
                    label={strings.summary.seasoningUsage}
                    value={subscriptionSummaryUsage
                      ? `${subscriptionCycleSeasoningsUsed}/${subscriptionSummaryUsage.seasoningsLimit}`
                      : `${selectedSeasoningCount}/${currentSubscriptionPlan.seasoningSelectionLimit}`}
                    muted={tokens.textMuted}
                    text={tokens.text}
                  />
                  <SummaryRow
                    label={strings.summary.sideUsage}
                    value={subscriptionSummaryUsage
                      ? `${subscriptionCycleSidesUsed}/${subscriptionSummaryUsage.sidesLimit}`
                      : `${selectedSideCount}/${currentSubscriptionPlan.sideSelectionLimit}`}
                    muted={tokens.textMuted}
                    text={tokens.text}
                  />
                  <SummaryRow
                    label={strings.summary.utensilUsage}
                    value={subscriptionSummaryUsage
                      ? `${subscriptionCycleUtensilsUsed}/${subscriptionSummaryUsage.utensilsLimit}`
                      : `${selectedUtensilCount}/${currentSubscriptionPlan.utensilSelectionLimit}`}
                    muted={tokens.textMuted}
                    text={tokens.text}
                  />
                </Stack>
              </Surface>
            ) : null}

            {selectedProductEntries.length ? (
              <Stack gap="xs">
                {selectedProductEntries.slice(0, 5).map(({ product, quantity }) => (
                  <div key={product.id} className={styles.summaryItem}>
                    <Text as="span" variant="caption" tone="inherit" style={{ color: tokens.textMuted }}>
                      {quantity}x {product.name}
                    </Text>
                    {selectedMode === "subscription" ? (
                      <Button
                        appearance="transparent"
                        size="sm"
                        style={getCheckoutSubtleActionStyle(tokens)}
                        tone="neutral"
                        type="button"
                        onClick={() => onRemoveProduct(product.id)}
                      >
                        {strings.summary.remove}
                      </Button>
                    ) : (
                      <Text as="span" variant="caption" tone="inherit" style={{ color: tokens.textMuted }}>
                        {formatMoney(product.price * quantity)}
                      </Text>
                    )}
                  </div>
                ))}
              </Stack>
            ) : (
              <Text tone="inherit" style={{ color: tokens.textMuted }}>
                {strings.summary.placeholder}
              </Text>
            )}

            <div className={styles.summaryTotal}>
              <Text as="span" variant="caption" tone="inherit" style={{ color: tokens.textMuted, fontWeight: 800, textTransform: "uppercase" }}>
                {selectedMode === "subscription"
                  ? activeSubscription ? strings.summary.activeSubscriptionLabel : strings.summary.fixedPlanPrice
                  : strings.summary.variableEstimate}
              </Text>
              <Text as="strong" variant="h3" tone="inherit" style={{ color: tokens.text }}>
                {selectedMode === "subscription" ? activeSubscriptionLabel || formatMoney(currentSubscriptionPlan.monthlyPrice) : formatMoney(orderEstimateTotal)}
              </Text>
              {selectedMode === "subscription" ? (
                <Text variant="caption" tone="inherit" style={{ color: tokens.textMuted }}>
                  {activeSubscription
                    ? `${strings.summary.subscriptionRenewPrefix} ${activeSubscription.nextBillingLabel}. ${strings.summary.activeSubscriptionHintSuffix}`
                    : strings.summary.noVariableEstimate}
                </Text>
              ) : null}
            </div>

            <Button appearance="solid" tone="neutral" style={getCheckoutPrimaryActionStyle(tokens, { width: "100%" })} onClick={onNextStep}>
              {currentStep === "montagem"
                ? strings.summary.nextStep
                : currentStep === "entrega"
                  ? strings.summary.paymentNextStep
                  : strings.summary.finishStep}
            </Button>
          </>
        ) : (
          <Text tone="inherit" style={{ color: tokens.textMuted }}>
            {strings.summary.empty}
          </Text>
        )}
      </Stack>
    </Surface>
  );
};
