import React from "react";
import { Button } from "../../../../ui/Button";
import { Stack } from "../../../../ui/Layout";
import { Surface } from "../../../../ui/Surface";
import { Text } from "../../../../ui/Text";
import type { ClientCheckoutPaymentMethodKey } from "../../../../../../shared-core/view-models/checkout.view-model";
import { createPedidoStyles } from "./styles";

export interface PaymentStepProps {
  onBack: () => void;
  onNext: () => void;
  onSelectInstallments: (installments: number) => void;
  onSelectPaymentMethod: (method: ClientCheckoutPaymentMethodKey) => void;
  paymentCopy: any;
  paymentInstallments: number[];
  paymentMethods: Array<{ key: ClientCheckoutPaymentMethodKey; label: string; description: string }>;
  selectedInstallments: number;
  selectedPaymentMethod: ClientCheckoutPaymentMethodKey;
  tokens: any;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  onBack,
  onNext,
  onSelectInstallments,
  onSelectPaymentMethod,
  paymentCopy,
  paymentInstallments,
  paymentMethods,
  selectedInstallments,
  selectedPaymentMethod,
  tokens,
}) => {
  const styles = createPedidoStyles(tokens);

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
        <Text style={styles.title}>{paymentCopy.installmentsTitle}</Text>
        {paymentInstallments.map((installment) => (
          <Button
            appearance={installment === selectedInstallments ? "soft" : "transparent"}
            key={installment}
            onAction={() => onSelectInstallments(installment)}
            style={{ ...styles.option, ...(installment === selectedInstallments ? styles.optionActive : {}) }}
            tone={installment === selectedInstallments ? "primary" : "neutral"}
          >
            {`${installment}${paymentCopy.installmentsSuffix}`}
          </Button>
        ))}
        <Button onAction={onBack}>{paymentCopy.back}</Button>
        <Button onAction={onNext} style={styles.action}>{paymentCopy.next}</Button>
      </Stack>
    </Surface>
  );
};
