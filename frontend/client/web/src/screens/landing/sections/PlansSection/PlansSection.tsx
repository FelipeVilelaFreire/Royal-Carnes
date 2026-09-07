import React, { useState } from "react";
import { Badge } from "@foundation/ui/Badge";
import { Button } from "@foundation/ui/Button";
import { CheckIcon } from "@foundation/ui/Icon/AppIcons";
import { ScrollToAppear } from "@foundation/ui/ScrollToAppear/ScrollToAppear";
import { Surface } from "@foundation/ui/Surface";
import { Text } from "@foundation/ui/Text";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import styles from "./PlansSection.module.css";

export interface PlansSectionProps {
  onRouteClick: (routeKey: string) => void;
}

type PlanStrings = {
  annualPrice: string;
  annualSavings: string;
  badge: string;
  cta: string;
  features: string[];
  monthlyPrice: string;
  subtitle: string;
  tagFeatured?: string;
  title: string;
};

export const PlansSection: React.FC<PlansSectionProps> = ({ onRouteClick }) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const strings = useClientStrings().landing.plans;
  const isAnnual = billingCycle === "annual";

  const plans: Array<{
    key: "essential" | "master" | "wagyu";
    delayMs: number;
    featured?: boolean;
    emphasisFrom?: number;
    tone: "neutral" | "primary" | "danger";
    data: PlanStrings;
  }> = [
    { key: "essential", delayMs: 0, tone: "neutral", data: strings.essential },
    { key: "master", delayMs: 120, featured: true, emphasisFrom: 3, tone: "primary", data: strings.master },
    { key: "wagyu", delayMs: 240, tone: "danger", data: strings.wagyu },
  ];

  return (
    <section className={styles.section}>
      <ScrollToAppear direction="up">
        <header className={styles.header}>
          <Badge appearance="soft" tone="primary">
            {strings.badge}
          </Badge>
          <Text as="h2" className={styles.title} variant="h2">
            {strings.title}
          </Text>
          <Text as="p" className={styles.subtitle} tone="muted" variant="body">
            {strings.subtitle}
          </Text>
        </header>
      </ScrollToAppear>

      <ScrollToAppear delayMs={100} direction="up">
        <div className={styles.billingWrap}>
          <div className={styles.billingControl}>
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
          </div>
        </div>
      </ScrollToAppear>

      {isAnnual && (
        <ScrollToAppear delayMs={150} direction="up">
          <Surface className={styles.annualBanner}>
            <div className={styles.annualBannerGrid}>
              <AnnualBannerItem
                label={strings.annualBanner.savingsLabel}
                title={strings.annualBanner.savings}
                description={strings.annualBanner.savingsDesc}
              />
              <AnnualBannerItem
                description={strings.annualBanner.giftDesc}
                label={strings.annualBanner.giftLabel}
                title={strings.annualBanner.gift}
              />
              <AnnualBannerItem
                description={strings.annualBanner.priceLockDesc}
                label={strings.annualBanner.priceLockLabel}
                title={strings.annualBanner.priceLock}
              />
            </div>
          </Surface>
        </ScrollToAppear>
      )}

      <div className={styles.planGrid}>
        {plans.map((plan) => (
          <ScrollToAppear delayMs={plan.delayMs} direction="up" key={plan.key}>
            <Surface className={styles.planCard} data-featured={Boolean(plan.featured)}>
              {plan.featured && plan.data.tagFeatured ? (
                <Badge appearance="solid" className={styles.featuredBadge} tone="primary">
                  {plan.data.tagFeatured}
                </Badge>
              ) : null}

              <div className={styles.planBody}>
                <div className={styles.planMeta}>
                  <Badge appearance="soft" tone={plan.tone}>
                    {plan.data.badge}
                  </Badge>
                  {isAnnual ? <span className={styles.savingsText}>{plan.data.annualSavings}</span> : null}
                </div>

                <Text as="h3" className={styles.planTitle} variant="h3">
                  {plan.data.title}
                </Text>
                <Text as="p" className={styles.planSubtitle} tone="muted" variant="body">
                  {plan.data.subtitle}
                </Text>

                <div className={styles.priceLine}>
                  <span className={styles.currency}>{strings.currencyPrefix}</span>
                  <span className={styles.priceValue}>
                    {isAnnual ? plan.data.annualPrice : plan.data.monthlyPrice}
                  </span>
                  <span className={styles.priceSuffix}>{strings.monthlySuffix}</span>
                </div>

                <ul className={styles.featureList}>
                  {plan.data.features.map((feature, idx) => (
                    <li
                      className={styles.featureItem}
                      data-emphasis={plan.emphasisFrom !== undefined && idx >= plan.emphasisFrom}
                      key={feature}
                    >
                      <CheckIcon className={styles.featureIcon} size={14} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                appearance={plan.featured ? "solid" : "outline"}
                onClick={() => onRouteClick("plans")}
                size="lg"
                tone={plan.featured ? "primary" : "neutral"}
              >
                {plan.data.cta}
              </Button>
            </Surface>
          </ScrollToAppear>
        ))}
      </div>
    </section>
  );
};

const AnnualBannerItem: React.FC<{ description: string; label: string; title: string }> = ({
  description,
  label,
  title,
}) => (
  <div className={styles.annualBannerItem}>
    <span className={styles.annualBannerLabel}>{label}</span>
    <Text as="h3" className={styles.annualBannerTitle} variant="h3">
      {title}
    </Text>
    <Text as="p" className={styles.annualBannerDescription} tone="muted" variant="caption">
      {description}
    </Text>
  </div>
);
