import React from "react";
import { Grid, Surface, Text } from "@foundation/ui";
import type { ClientCheckoutStepKey } from "@/manifest/checkout.config";
import styles from "../PedidoView.module.css";

export interface CheckoutStepTrackerProps {
  cardSurface: React.CSSProperties;
  completedLabel: string;
  currentStep: ClientCheckoutStepKey;
  stepOrder: ClientCheckoutStepKey[];
  steps: Record<ClientCheckoutStepKey, string>;
  tokens: {
    border: string;
    copper: string;
    text: string;
    textMuted: string;
  };
}

export const CheckoutStepTracker: React.FC<CheckoutStepTrackerProps> = ({
  cardSurface,
  completedLabel,
  currentStep,
  stepOrder,
  steps,
  tokens,
}) => {
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
  <Surface
    appearance="soft"
    className={styles.stepTracker}
    style={{
      "--pedido-panel-bg": String(cardSurface.background || tokens.text),
      "--pedido-panel-border": tokens.border,
      "--pedido-panel-text": tokens.text,
    } as React.CSSProperties}
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
            style={{
              "--pedido-step-accent": tokens.copper,
              "--pedido-step-border": isCurrent ? tokens.copper : tokens.border,
              "--pedido-step-index": isDone || isCurrent ? tokens.copper : tokens.textMuted,
              "--pedido-step-text": isCurrent ? tokens.text : tokens.textMuted,
            } as React.CSSProperties}
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
