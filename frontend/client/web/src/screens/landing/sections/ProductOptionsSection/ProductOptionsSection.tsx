import React from "react";
import { Badge } from "@foundation/ui/Badge";
import { Button } from "@foundation/ui/Button";
import { ArrowForwardIcon, BoxIcon, CheckIcon, StarIcon, StoreIcon, TruckIcon } from "@foundation/ui/Icon/AppIcons";
import { Grid, Inline, Stack } from "@foundation/ui/Layout";
import { Surface } from "@foundation/ui/Surface";
import { Text } from "@foundation/ui/Text";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import styles from "./ProductOptionsSection.module.css";

export interface ProductOptionsSectionProps {
  onRouteClick: (routeKey: string) => void;
}

const optionIcons = {
  subscription: StoreIcon,
  box: BoxIcon,
  delivery: TruckIcon,
};

const routeByOption = {
  subscription: "assinaturas",
  box: "montar-box",
  delivery: "royal-delivery",
};

export const ProductOptionsSection: React.FC<ProductOptionsSectionProps> = ({ onRouteClick }) => {
  const strings = useClientStrings().landing.productOptions;

  return (
    <Stack className={styles.section} gap="3xl">
      <Stack align="center" className={styles.header} gap="sm">
        <Badge appearance="soft" className={styles.sectionBadge} tone="primary">
          {strings.badge}
        </Badge>
        <Text as="h2" className={styles.title} lineHeight="lineHeight3xl" size="size4xl" variant="h2" weight="bold">
          {strings.titleLead} <span className={styles.titleAccent}>{strings.titleAccent}</span> {strings.titleTail}
        </Text>
        <Text as="p" className={styles.subtitle} lineHeight="lineHeightLg" size="sizeLg" tone="text-muted" variant="body">
          {strings.subtitle}
        </Text>
      </Stack>

      <Grid className={styles.optionsGrid} columns={3} gap="lg">
        {strings.options.map((option) => {
          const Icon = optionIcons[option.key as keyof typeof optionIcons] || StoreIcon;
          const routeKey = routeByOption[option.key as keyof typeof routeByOption] || "assinaturas";
          const isFeatured = option.key === "box";

          return (
            <Surface className={styles.optionCard} data-featured={isFeatured || undefined} key={option.key}>
              {isFeatured && option.featuredBadge ? (
                <Badge appearance="solid" className={styles.featuredBadge} tone="primary">
                  <StarIcon className={styles.featuredIcon} />
                  {option.featuredBadge}
                </Badge>
              ) : null}

              <Stack className={styles.optionBody} gap="lg">
                <Inline className={styles.optionHeader} justify="between" wrap={false}>
                  <Badge appearance="soft" className={styles.optionBadge} tone={isFeatured ? "primary" : "neutral"}>
                    {option.badge}
                  </Badge>
                  <span className={styles.optionIcon}>
                    <Icon className={styles.optionIconSvg} />
                  </span>
                </Inline>

                <Stack gap="sm">
                  <Text as="h3" className={styles.optionTitle} variant="h3">
                    {option.title}
                  </Text>
                  <Text as="p" className={styles.optionDescription} lineHeight="lineHeightMd" tone="text-muted" variant="body">
                    {option.description}
                  </Text>
                </Stack>

                <ul className={styles.bulletList}>
                  {option.bullets.map((bullet) => (
                    <li className={styles.bulletItem} key={bullet}>
                      <CheckIcon className={styles.checkIcon} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </Stack>

              <Button
                appearance={isFeatured ? "solid" : "outline"}
                className={isFeatured ? styles.primaryAction : styles.secondaryAction}
                icon={<ArrowForwardIcon className={styles.actionIcon} />}
                iconPosition="end"
                onClick={() => onRouteClick(routeKey)}
                size="lg"
                tone={isFeatured ? "primary" : "neutral"}
              >
                {option.cta}
              </Button>
            </Surface>
          );
        })}
      </Grid>

    </Stack>
  );
};
