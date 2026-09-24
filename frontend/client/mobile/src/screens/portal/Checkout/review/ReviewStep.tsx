import React from "react";
import { Button } from "@foundation/ui/native/Button";
import { Stack } from "@foundation/ui/native/Layout";
import { Surface } from "@foundation/ui/native/Surface";
import { Text } from "@foundation/ui/native/Text";
import type {
  ClientCheckoutProduct,
  ClientCheckoutProductExperience,
  ClientCheckoutSubscriptionPlan,
} from "../../../../../../shared-core/view-models/checkout.view-model";
import { createCheckoutStyles } from "../checkout.styles";

export interface ReviewStepProps {
  currentSubscriptionPlan: ClientCheckoutSubscriptionPlan;
  finalTotal: number;
  formatMoney: (value: number) => string;
  onBack: () => void;
  onFinish: () => Promise<unknown>;
  createdOrderCode: string;
  isSubmitting: boolean;
  reviewCopy: any;
  selectedAddressSummary: string;
  selectedMode: ClientCheckoutProductExperience;
  selectedPaymentLabel: string;
  selectedProductEntries: Array<{ product: ClientCheckoutProduct; quantity: number }>;
  submitError: string;
  strings: any;
  tokens: any;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  currentSubscriptionPlan,
  finalTotal,
  formatMoney,
  onBack,
  onFinish,
  createdOrderCode,
  isSubmitting,
  reviewCopy,
  selectedAddressSummary,
  selectedMode,
  selectedPaymentLabel,
  selectedProductEntries,
  submitError,
  strings,
  tokens,
}) => {
  const styles = createCheckoutStyles(tokens);
  const submit = () => {
    void onFinish().catch(() => undefined);
  };

  if (createdOrderCode) {
    return (
      <Surface style={styles.panel}>
        <Stack style={styles.stack}>
          <Text style={styles.accent} variant="caption">{reviewCopy.badge}</Text>
          <Text style={styles.title} variant="h2">{reviewCopy.successTitle}</Text>
          <Text style={styles.muted}>{reviewCopy.successDescription}</Text>
          <Surface style={styles.option}>
            <Text style={styles.muted}>{reviewCopy.successOrderCode}</Text>
            <Text style={styles.title}>{createdOrderCode}</Text>
          </Surface>
        </Stack>
      </Surface>
    );
  }

  return (
    <Surface style={styles.panel}>
      <Stack style={styles.stack}>
        <Text style={styles.accent} variant="caption">{reviewCopy.badge}</Text>
        <Text style={styles.title} variant="h2">{reviewCopy.title}</Text>
        <Text style={styles.muted}>{reviewCopy.description}</Text>
        <Surface style={styles.option}>
          <Text style={styles.title}>{strings.summary.selectedMode}</Text>
          <Text style={styles.muted}>{strings.modes[selectedMode].title}</Text>
          {selectedMode === "subscription" ? <Text style={styles.muted}>{currentSubscriptionPlan.name}</Text> : null}
          <Text style={styles.muted}>{selectedAddressSummary}</Text>
          <Text style={styles.muted}>{selectedPaymentLabel}</Text>
        </Surface>
        <Surface style={styles.option}>
          <Text style={styles.title}>{reviewCopy.itemsTitle}</Text>
          {selectedProductEntries.map(({ product, quantity }) => (
            <Text key={product.id} style={styles.muted}>{`${quantity}x ${product.name}`}</Text>
          ))}
          <Text style={styles.accent}>{formatMoney(finalTotal)}</Text>
        </Surface>
        <Button disabled={isSubmitting} onAction={onBack}>{reviewCopy.back}</Button>
        <Button disabled={isSubmitting} onAction={submit} style={styles.action}>{isSubmitting ? reviewCopy.submitting : reviewCopy.finish}</Button>
        {submitError ? <Text style={styles.muted}>{submitError}</Text> : null}
      </Stack>
    </Surface>
  );
};
