import React from "react";
import { Grid, Surface, Text } from "@foundation/ui";
import type { ClientCheckoutStepKey } from "@/manifest/checkout.config";
import styles from "../PedidoView.module.css";

export interface CheckoutStepTrackerProps {
  completedLabel: string;
  currentStep: ClientCheckoutStepKey;
  stepOrder: ClientCheckoutStepKey[];
  steps: Record<ClientCheckoutStepKey, string>;
}

export const CheckoutStepTracker: React.FC<CheckoutStepTrackerProps> = ({
  completedLabel,
  currentStep,
  stepOrder,
  steps,
}) => {
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
  <Surface
    appearance="soft"
    className={styles.stepTracker}
  >
    <Grid className={styles.stepGrid}>
      {stepOrder.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        const state = isDone ? "done" : isCurrent ? "current" : "pending";

        return (
          <Surface
            appearance="soft"
            className={styles.stepItem}
            data-state={state}
            key={step}
          >
            <span className={styles.stepIndex}>
              {isDone ? completedLabel : `0${index + 1}`}
            </span>
            <Text as="strong" tone="inherit" variant="caption" weight="semibold">
              {steps[step]}
            </Text>
          </Surface>
        );
      })}
    </Grid>
  </Surface>
  );
};
