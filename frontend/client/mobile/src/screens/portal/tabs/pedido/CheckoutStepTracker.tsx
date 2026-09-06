import React from "react";
import { Stack } from "../../../../ui/Layout";
import { Surface } from "../../../../ui/Surface";
import { Text } from "../../../../ui/Text";
import type { ClientCheckoutStepKey } from "../../../../../../shared-core/manifest/checkout.config";
import { createPedidoStyles } from "./styles";

export interface CheckoutStepTrackerProps {
  currentStep: ClientCheckoutStepKey;
  stepOrder: ClientCheckoutStepKey[];
  steps: Record<ClientCheckoutStepKey, string> & { completed: string; stepPrefix: string };
  tokens: any;
}

export const CheckoutStepTracker: React.FC<CheckoutStepTrackerProps> = ({
  currentStep,
  stepOrder,
  steps,
  tokens,
}) => {
  const styles = createPedidoStyles(tokens);
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <Stack style={styles.compactStack}>
      {stepOrder.map((step, index) => (
        <Surface key={step} style={{ ...styles.option, ...(index === currentIndex ? styles.optionActive : {}) }}>
          <Text style={index <= currentIndex ? styles.accent : styles.muted} variant="caption">
            {index < currentIndex ? steps.completed : `${steps.stepPrefix} ${index + 1}`}
          </Text>
          <Text style={styles.title}>{steps[step]}</Text>
        </Surface>
      ))}
    </Stack>
  );
};
