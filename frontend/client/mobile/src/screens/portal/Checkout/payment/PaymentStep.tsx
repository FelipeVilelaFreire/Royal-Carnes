import React from "react";
import { Button } from "@foundation/ui/native/Button";
import { Stack } from "@foundation/ui/native/Layout";
import { Surface } from "@foundation/ui/native/Surface";
import { Text } from "@foundation/ui/native/Text";
import type { ClientCheckoutPaymentMethodKey } from "../../../../../../shared-core/view-models/checkout.view-model";
import { createCheckoutStyles } from "../checkout.styles";

export interface PaymentStepProps {
  onBack: () => void;
  onNext: () => void;
  onSelectPaymentMethod: (method: ClientCheckoutPaymentMethodKey) => void;
  paymentCopy: any;
  paymentMethods: Array<{ key: ClientCheckoutPaymentMethodKey; label: string; description: string }>;
  selectedPaymentMethod: ClientCheckoutPaymentMethodKey;
  tokens: any;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  onBack,
  onNext,
  onSelectPaymentMethod,
  paymentCopy,
  paymentMethods,
  selectedPaymentMethod,
  tokens,
}) => {
  const styles = createCheckoutStyles(tokens);

  return (
    <Surface style={styles.panel}>
      <Stack style={styles.stack}>
        <Text style={styles.accent} variant="caption">{paymentCopy.badge}</Text>
        <Text style={styles.title} variant="h2">{paymentCopy.title}</Text>
        <Text style={styles.muted}>{paymentCopy.description}</Text>
        <Text style={styles.title}>{paymentCopy.methodsTitle}</Text>
        {paymentMethods.map((method) => {
          const active = selectedPaymentMethod === method.key;

          return (
            <Button key={method.key} onAction={() => onSelectPaymentMethod(method.key)} style={{ ...styles.option, ...(active ? styles.optionActive : {}) }}>
              <Surface style={{ borderWidth: 0, ...styles.compactStack }}>
                <Text style={styles.title}>{method.label}</Text>
                <Text style={styles.muted}>{method.description}</Text>
              </Surface>
            </Button>
          );
        })}
        <Button onAction={onBack}>{paymentCopy.back}</Button>
        <Button onAction={onNext} style={styles.action}>{paymentCopy.next}</Button>
      </Stack>
    </Surface>
  );
};
