import React from "react";
import { Button, Stack, Surface, Text } from "@foundation/ui";
import { formatClientCheckoutUsage } from "@royalprime/client/utils/checkout.formatters";
import {
  type ClientCheckoutCycleUsage,
  type ClientCheckoutSubscriptionPlan,
  type ClientCheckoutSubscriptionTier,
} from "@/view-models/checkout.view-model";
import styles from "../CheckoutView.module.css";

export interface ActiveCycleSummaryProps {
  activeCycleUsage?: ClientCheckoutCycleUsage | null;
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
  const capacityMetrics = (activeCycleUsage?.capacity || [])
    .filter((capacity) => capacity.limitQuantity > 0)
    .map((capacity) => [
      capacity.label,
      formatClientCheckoutUsage(capacity.usedQuantity, capacity.limitQuantity, capacity.measurementUnitSymbol || "", formatMeasure),
    ]);
  const metrics = activeSubscription
    ? [
        [strings.plans.renewalLabel, activeSubscription.nextBillingLabel],
        ...(capacityMetrics.length ? capacityMetrics : [
        [
          strings.summary.meatUsage,
          formatClientCheckoutUsage(subscriptionCycleWeightUsed,
            activeCycleUsage?.weightKgLimit || currentSubscriptionPlan.proteinKgLimit,
            "kg",
            formatMeasure),
        ],
        charcoalKgLimit > 0 ? [
          strings.summary.charcoalUsage,
          formatClientCheckoutUsage(subscriptionCycleCharcoalUsed, charcoalKgLimit, "kg", formatMeasure),
        ] : null,
        ]),
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
                    <span className={styles.planButtonHeading}>
                      <Text as="strong" tone="inherit" variant="body" weight="semibold">
                        {plan.name}
                      </Text>
                    </span>
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
