import React from "react";
import { Inline } from "@foundation/ui/native/Layout";
import { Surface } from "@foundation/ui/native/Surface";
import { Text } from "@foundation/ui/native/Text";
import { useUi } from "@foundation/ui/native/context";
import type { ClientCheckoutStepKey } from "../../../../../../shared-core/manifest/checkout.config";
import { createCheckoutStyles } from "../checkout.styles";

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
  const styles = createCheckoutStyles(tokens);
  const currentIndex = stepOrder.indexOf(currentStep);
  const { hosts } = useUi();
  const RailContainer = hosts.ScrollView || hosts.View;

  return (
    <Surface style={styles.tracker}>
      <RailContainer
        horizontal={Boolean(hosts.ScrollView)}
        showsHorizontalScrollIndicator={false}
        style={styles.trackerRail}
      >
        <Inline gap="sm">
          {stepOrder.map((step, index) => (
            <Surface key={step} style={index === currentIndex ? styles.trackerStepCurrent : styles.trackerStep}>
              <Text style={index <= currentIndex ? styles.accent : styles.muted} variant="caption">
                {index < currentIndex ? steps.completed : `${steps.stepPrefix} ${index + 1}`}
              </Text>
              <Text style={styles.title}>{steps[step]}</Text>
            </Surface>
          ))}
        </Inline>
      </RailContainer>
    </Surface>
  );
};
