import React, { useState } from "react";
import { Badge } from "@foundation/ui/Badge";
import { Grid, Inline, Stack } from "@foundation/ui/Layout";
import { ScrollToAppear } from "@foundation/ui/ScrollToAppear/ScrollToAppear";
import { Text } from "@foundation/ui/Text";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import { PlanCard, type PlanCardData } from "./PlanCard";
import styles from "./PlansSection.module.css";

export interface PlansSectionProps {
  onRouteClick: (routeKey: string) => void;
}

export const PlansSection: React.FC<PlansSectionProps> = ({ onRouteClick }) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const strings = useClientStrings().landing.plans;
  const isAnnual = billingCycle === "annual";

  const plans: Array<{
    key: "essential" | "master" | "wagyu";
    delayMs: number;
    featured?: boolean;
    tone: "neutral" | "primary" | "danger";
    data: PlanCardData;
  }> = [
    { key: "essential", delayMs: 0, tone: "neutral", data: strings.essential },
    { key: "master", delayMs: 120, featured: true, tone: "primary", data: strings.master },
    { key: "wagyu", delayMs: 240, tone: "danger", data: strings.wagyu },
  ];

  return (
    <section className={styles.section}>
      <ScrollToAppear direction="up">
        <header className={styles.header}>
          <Stack align="center" gap="sm">
            <Badge appearance="soft" tone="primary">
              {strings.badge}
            </Badge>
            <Text as="h2" className={styles.title} variant="h2">
              {strings.title}
            </Text>
            <Text as="p" className={styles.subtitle} tone="muted" variant="body">
              {strings.subtitle}
            </Text>
          </Stack>
        </header>
      </ScrollToAppear>

      <ScrollToAppear delayMs={100} direction="up">
        <Inline className={styles.billingWrap} justify="center">
          <Inline className={styles.billingControl} gap="xs" role="group" aria-label={strings.title}>
            <button
              className={styles.billingButton}
              data-active={!isAnnual}
              onClick={() => setBillingCycle("monthly")}
              type="button"
            >
              {strings.billingMonthly}
            </button>
            <button
              className={styles.billingButton}
              data-active={isAnnual}
              onClick={() => setBillingCycle("annual")}
              type="button"
            >
              <span>{strings.billingAnnual}</span>
              <Badge appearance="solid" tone="danger">
                {strings.annualDiscountBadge}
              </Badge>
            </button>
          </Inline>
        </Inline>
      </ScrollToAppear>

      <Grid className={styles.planGrid} columns={3} gap="lg">
        {plans.map((plan) => (
          <ScrollToAppear delayMs={plan.delayMs} direction="up" key={plan.key}>
            <PlanCard
              currencyPrefix={strings.currencyPrefix}
              data={plan.data}
              featured={plan.featured}
              isAnnual={isAnnual}
              monthlySuffix={strings.monthlySuffix}
              onSelect={() => onRouteClick("plans")}
              tone={plan.tone}
              variant={plan.key}
            />
          </ScrollToAppear>
        ))}
      </Grid>
    </section>
  );
};
