import React from "react";
import { Button } from "@foundation/ui/native/Button";
import { Stack } from "@foundation/ui/native/Layout";
import { Surface } from "@foundation/ui/native/Surface";
import { Text } from "@foundation/ui/native/Text";
import type { ClientCheckoutSubscriptionPlan, ClientCheckoutSubscriptionTier } from "../../../../../../shared-core/view-models/checkout.view-model";
import { createCheckoutStyles } from "../checkout.styles";

export interface ActiveCycleSummaryProps {
  activeCycleUsage?: {
    charcoalKgLimit: number;
    cutsLimit: number;
    weightKgLimit: number;
  } | null;
  activeSubscription?: {
    nextBillingLabel: string;
  };
  catalogSubscriptionPlans: ClientCheckoutSubscriptionPlan[];
  currentSubscriptionPlan: ClientCheckoutSubscriptionPlan;
  formatMeasure: (value: number, unit: string) => string;
  onSelectPlan: (planKey: ClientCheckoutSubscriptionTier) => void;
  selectedPlanKey: ClientCheckoutSubscriptionTier;
  strings: any;
  subscriptionCycleCharcoalUsed: number;
  subscriptionCycleWeightUsed: number;
  tokens: any;
}

export const ActiveCycleSummary: React.FC<ActiveCycleSummaryProps> = ({
  activeCycleUsage,
  activeSubscription,
  catalogSubscriptionPlans,
  currentSubscriptionPlan,
  formatMeasure,
  onSelectPlan,
  selectedPlanKey,
  strings,
  subscriptionCycleCharcoalUsed,
  subscriptionCycleWeightUsed,
  tokens,
}) => {
  const styles = createCheckoutStyles(tokens);

  if (!activeSubscription) {
    return (
      <Surface style={styles.panel}>
        <Stack style={styles.stack}>
          <Text style={styles.title} variant="h2">{strings.plans.title}</Text>
          <Text style={styles.muted}>{strings.plans.subtitle}</Text>
          {catalogSubscriptionPlans.map((plan) => {
            const active = selectedPlanKey === plan.key;

            return (
              <Button
                appearance={active ? "soft" : "transparent"}
                key={plan.id}
                onAction={() => onSelectPlan(plan.key)}
                style={active ? styles.optionActive : styles.option}
                tone="neutral"
              >
                <Stack style={styles.compactStack}>
                  <Text style={styles.title}>{plan.name}</Text>
                  <Text style={styles.muted} variant="caption">{formatMeasure(plan.proteinKgLimit, "kg")}</Text>
                </Stack>
              </Button>
            );
          })}
        </Stack>
      </Surface>
    );
  }

  const charcoalKgLimit = activeCycleUsage?.charcoalKgLimit || currentSubscriptionPlan.charcoalKgLimit;
  const metrics = [
    [strings.plans.renewalLabel, activeSubscription.nextBillingLabel],
    [
      strings.summary.meatUsage,
      `${formatMeasure(subscriptionCycleWeightUsed, "kg")} / ${formatMeasure(activeCycleUsage?.weightKgLimit || currentSubscriptionPlan.proteinKgLimit, "kg")}`,
    ],
    charcoalKgLimit > 0 ? [
      strings.summary.charcoalUsage,
      `${formatMeasure(subscriptionCycleCharcoalUsed, "kg")} / ${formatMeasure(charcoalKgLimit, "kg")}`,
    ] : null,
  ].filter(Boolean);

  return (
    <Surface style={styles.panel}>
      <Stack style={styles.stack}>
        <Text style={styles.title} variant="h2">{strings.plans.activeTitle}</Text>
        {metrics.map(([label, value]: any) => (
          <Text key={label} style={styles.muted} variant="caption">
            {strings.format.dashSeparated.replace("{first}", label).replace("{second}", value)}
          </Text>
        ))}
      </Stack>
    </Surface>
  );
};
