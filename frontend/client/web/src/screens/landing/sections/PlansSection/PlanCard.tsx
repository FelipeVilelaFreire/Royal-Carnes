import React from "react";
import { Badge } from "@foundation/ui/Badge";
import { Button } from "@foundation/ui/Button";
import { CheckIcon } from "@foundation/ui/Icon/AppIcons";
import { Inline, Stack } from "@foundation/ui/Layout";
import { Surface } from "@foundation/ui/Surface";
import { Text } from "@foundation/ui/Text";
import styles from "./PlansSection.module.css";

export type PlanCardData = {
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

export interface PlanCardProps {
  currencyPrefix: string;
  data: PlanCardData;
  featured?: boolean;
  isAnnual: boolean;
  monthlySuffix: string;
  onSelect: () => void;
  tone: "neutral" | "primary" | "danger";
  variant: "essential" | "master" | "wagyu";
}

export const PlanCard: React.FC<PlanCardProps> = ({
  currencyPrefix,
  data,
  featured = false,
  isAnnual,
  monthlySuffix,
  onSelect,
  tone,
  variant,
}) => (
  <Surface className={styles.planCard} data-featured={featured || undefined} data-variant={variant}>
    {featured && data.tagFeatured ? (
      <Badge appearance="solid" className={styles.featuredBadge} tone="primary">
        {data.tagFeatured}
      </Badge>
    ) : null}

    <Stack className={styles.planBody} gap="xs">
      <Badge appearance="soft" className={styles.planBadge} tone={tone}>
        {data.badge}
      </Badge>

      <Text as="h3" className={styles.planTitle} variant="h3">
        {data.title}
      </Text>
      <Text as="p" className={styles.planDescription} tone="muted" variant="body">
        {data.subtitle}
      </Text>

      <Inline align="end" className={styles.priceLine} gap="2xs" wrap={false}>
        <span className={styles.currency}>{currencyPrefix}</span>
        <span className={styles.priceValue}>{isAnnual ? data.annualPrice : data.monthlyPrice}</span>
        <span className={styles.priceSuffix}>{monthlySuffix}</span>
      </Inline>

      <ul className={styles.featureList}>
        {data.features.map((feature) => (
          <li className={styles.featureItem} key={feature}>
            <CheckIcon className={styles.featureIcon} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </Stack>

    <Button
      appearance={featured ? "solid" : "outline"}
      className={featured ? styles.planActionPrimary : styles.planAction}
      onClick={onSelect}
      size="lg"
      tone={featured ? "primary" : "neutral"}
    >
      {data.cta}
    </Button>
  </Surface>
);
