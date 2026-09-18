import React from "react";
import { Button, Inline, Stack, Surface, Text } from "@foundation/ui";
import type { ClientCheckoutSubscriptionPlan, ClientCheckoutSubscriptionTier } from "@/view-models/checkout.view-model";
import styles from "../CheckoutView.module.css";

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
  embedded?: boolean;
  formatMeasure: (value: number, unit: string) => string;
  onSelectPlan: (planKey: ClientCheckoutSubscriptionTier) => void;
  selectedPlanKey: ClientCheckoutSubscriptionTier;
  strings: any;
  subscriptionCycleCharcoalUsed: number;
  subscriptionCycleWeightUsed: number;
}

export const ActiveCycleSummary: React.FC<ActiveCycleSummaryProps> = ({
  activeCycleUsage,
  activeSubscription,
  catalogSubscriptionPlans,
  currentSubscriptionPlan,
  embedded = false,
  formatMeasure,
  onSelectPlan,
  selectedPlanKey,
  strings,
  subscriptionCycleCharcoalUsed,
  subscriptionCycleWeightUsed,
}) => {
  const charcoalKgLimit = activeCycleUsage?.charcoalKgLimit || currentSubscriptionPlan.charcoalKgLimit;
  const metrics = activeSubscription
    ? [
        [strings.plans.renewalLabel, activeSubscription.nextBillingLabel],
        [
          strings.summary.meatUsage,
          `${formatMeasure(subscriptionCycleWeightUsed, "kg")} / ${formatMeasure(
            activeCycleUsage?.weightKgLimit || currentSubscriptionPlan.proteinKgLimit,
            "kg",
          )}`,
        ],
        charcoalKgLimit > 0 ? [
          strings.summary.charcoalUsage,
          `${formatMeasure(subscriptionCycleCharcoalUsed, "kg")} / ${formatMeasure(charcoalKgLimit, "kg")}`,
        ] : null,
      ].filter(Boolean)
    : [];

  return (
    <Surface
      appearance="soft"
      className={styles.activePlanPanel}
      data-active-cycle={activeSubscription ? "true" : undefined}
      data-embedded={embedded || undefined}
    >
      {activeSubscription ? (
        <Stack className={styles.activePlanContent}>
        <Inline align="start" className={styles.activePlanHeader} justify="between">
          <div className={styles.activePlanCopy}>
            <Text as="h2" className={styles.activePlanTitle} tone="inherit" variant="h3">
              {strings.plans.activeTitle}
            </Text>
          </div>
        </Inline>

        <div className={styles.activePlanMetrics}>
          {metrics.map(([label, value]: any) => (
            <Text as="span" className={styles.activePlanMetric} key={label} tone="inherit" variant="caption">
              {strings.format.dashSeparated.replace("{first}", label).replace("{second}", value)}
            </Text>
          ))}
        </div>
        </Stack>
      ) : (
      <Stack className={styles.activePlanContent} gap="sm">
          <div className={styles.activePlanCopy}>
            <Text as="h2" className={styles.activePlanTitle} tone="inherit" variant="h3">
              {strings.plans.title}
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
                  <span className={styles.planButtonContent}>
                    <Text as="strong" tone="inherit" variant="body" weight="semibold">
                      {plan.name}
                    </Text>
                    <Text as="span" className={styles.planLimit} tone="inherit" variant="caption">
                      {formatMeasure(plan.proteinKgLimit, "kg")}
                    </Text>
                  </span>
                </Button>
              );
            })}
          </div>
        </Stack>
      )}
    </Surface>
  );
};
