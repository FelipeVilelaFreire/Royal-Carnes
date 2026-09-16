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
  activeSubscriptionLabel: string;
  catalogSubscriptionPlans: ClientCheckoutSubscriptionPlan[];
  currentSubscriptionPlan: ClientCheckoutSubscriptionPlan;
  formatMeasure: (value: number, unit: string) => string;
  onSelectPlan: (planKey: ClientCheckoutSubscriptionTier) => void;
  selectedPlanKey: ClientCheckoutSubscriptionTier;
  strings: any;
  subscriptionCycleCharcoalUsed: number;
  subscriptionCycleCutsUsed: number;
  subscriptionCycleWeightUsed: number;
  tokens: any;
}

export const ActiveCycleSummary: React.FC<ActiveCycleSummaryProps> = ({
  activeCycleUsage,
  activeSubscription,
  activeSubscriptionLabel,
  catalogSubscriptionPlans,
  currentSubscriptionPlan,
  formatMeasure,
  onSelectPlan,
  selectedPlanKey,
  strings,
  subscriptionCycleCharcoalUsed,
  subscriptionCycleCutsUsed,
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
                tone={active ? "primary" : "neutral"}
              >
                {plan.name}
              </Button>
            );
          })}
        </Stack>
      </Surface>
    );
  }

  const metrics = [
    [strings.plans.renewalLabel, activeSubscription.nextBillingLabel],
    [strings.summary.cycleCuts, `${subscriptionCycleCutsUsed} / ${activeCycleUsage?.cutsLimit || currentSubscriptionPlan.productSelectionLimit}`],
    [
      strings.summary.meatUsage,
      `${formatMeasure(subscriptionCycleWeightUsed, "kg")} / ${formatMeasure(activeCycleUsage?.weightKgLimit || currentSubscriptionPlan.proteinKgLimit, "kg")}`,
    ],
    [
      strings.summary.charcoalUsage,
      `${formatMeasure(subscriptionCycleCharcoalUsed, "kg")} / ${formatMeasure(activeCycleUsage?.charcoalKgLimit || currentSubscriptionPlan.charcoalKgLimit, "kg")}`,
    ],
  ];

  return (
    <Surface style={styles.panel}>
      <Stack style={styles.stack}>
        <Text style={styles.accent} variant="caption">{strings.plans.activePlanLabel}</Text>
        <Text style={styles.title} variant="h2">{strings.plans.activeTitle}</Text>
        <Text style={styles.muted}>{activeSubscriptionLabel}</Text>
        <Text style={styles.muted}>{strings.plans.activeSubtitle}</Text>
        {metrics.map(([label, value]) => (
          <Surface key={label} style={styles.option}>
            <Text style={styles.muted}>{label}</Text>
            <Text style={styles.title}>{value}</Text>
          </Surface>
        ))}
      </Stack>
    </Surface>
  );
};
