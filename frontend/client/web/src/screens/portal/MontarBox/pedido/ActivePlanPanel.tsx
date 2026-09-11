import React from "react";
import { Button, Inline, Stack, Surface, Text } from "@foundation/ui";
import type { ClientCheckoutSubscriptionPlan, ClientCheckoutSubscriptionTier } from "@/view-models/checkout.view-model";
import styles from "../MontarBoxView.module.css";

export interface ActivePlanPanelProps {
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
}

export const ActivePlanPanel: React.FC<ActivePlanPanelProps> = ({
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
}) => {
  const metrics = activeSubscription
    ? [
        [strings.plans.renewalLabel, activeSubscription.nextBillingLabel],
        [
          strings.summary.cycleCuts,
          `${subscriptionCycleCutsUsed} / ${activeCycleUsage?.cutsLimit || currentSubscriptionPlan.productSelectionLimit}`,
        ],
        [
          strings.summary.meatUsage,
          `${formatMeasure(subscriptionCycleWeightUsed, "kg")} / ${formatMeasure(
            activeCycleUsage?.weightKgLimit || currentSubscriptionPlan.proteinKgLimit,
            "kg",
          )}`,
        ],
        [
          strings.summary.charcoalUsage,
          `${formatMeasure(subscriptionCycleCharcoalUsed, "kg")} / ${formatMeasure(
            activeCycleUsage?.charcoalKgLimit || currentSubscriptionPlan.charcoalKgLimit,
            "kg",
          )}`,
        ],
      ]
    : [];

  return (
    <Surface
      appearance="soft"
      className={styles.activePlanPanel}
    >
      {activeSubscription ? (
        <Stack className={styles.activePlanContent}>
        <Inline align="start" className={styles.activePlanHeader} justify="between">
          <div className={styles.activePlanCopy}>
            <Text as="span" className={styles.activePlanKicker} tone="inherit" variant="caption">
              {strings.plans.activePlanLabel}
            </Text>
            <Text as="h2" className={styles.activePlanTitle} tone="inherit" variant="h3">
              {strings.plans.activeTitle} {activeSubscriptionLabel}
            </Text>
            <Text className={styles.activePlanDescription} tone="inherit">
              {strings.plans.activeSubtitle}
            </Text>
          </div>
          <Text as="span" className={styles.activePlanBadge} tone="inherit" variant="caption">
            {activeSubscriptionLabel}
          </Text>
        </Inline>

        <div className={styles.activePlanMetrics}>
          {metrics.map(([label, value]) => (
            <Surface appearance="soft" className={styles.activePlanMetric} key={label}>
              <span className={styles.metricLabel}>{label}</span>
              <strong className={styles.metricValue}>{value}</strong>
            </Surface>
          ))}
        </div>
        </Stack>
      ) : (
        <Stack className={styles.activePlanContent}>
          <div className={styles.activePlanCopy}>
            <Text as="h2" className={styles.activePlanTitle} tone="inherit" variant="h3">
              {strings.plans.title}
            </Text>
            <Text className={styles.activePlanDescription} tone="inherit">
              {strings.plans.subtitle}
            </Text>
          </div>

          <div className={styles.planGrid}>
            {catalogSubscriptionPlans.map((plan) => {
              const isPlanActive = selectedPlanKey === plan.key;

              return (
                <Button
                  appearance="soft"
                  aria-pressed={isPlanActive}
                  className={styles.planButton}
                  key={plan.id}
                  onClick={() => onSelectPlan(plan.key)}
                  size="md"
                  tone="neutral"
                  type="button"
                >
                  <Text as="strong" tone="inherit" variant="body" weight="semibold">
                    {plan.name}
                  </Text>
                </Button>
              );
            })}
          </div>
        </Stack>
      )}
    </Surface>
  );
};
