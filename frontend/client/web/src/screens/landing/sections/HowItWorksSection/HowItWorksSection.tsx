import React from "react";
import { Badge } from "@foundation/ui/Badge";
import { Button } from "@foundation/ui/Button";
import { ArrowForwardIcon, BoxIcon, CartIcon, CheckIcon, SettingsIcon, StarIcon, StoreIcon, TruckIcon, UserIcon } from "@foundation/ui/Icon/AppIcons";
import { Grid, Inline, Stack } from "@foundation/ui/Layout";
import { Surface } from "@foundation/ui/Surface";
import { Text } from "@foundation/ui/Text";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import styles from "./HowItWorksSection.module.css";

export interface HowItWorksSectionProps {
  onRouteClick: (routeKey: string) => void;
}

const stepIcons = [StoreIcon, CartIcon, TruckIcon, UserIcon];
const chipIcons = [BoxIcon, CheckIcon, UserIcon];

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onRouteClick }) => {
  const strings = useClientStrings().landing.howItWorks;

  return (
    <Stack className={styles.section} gap="3xl">
      <Stack align="center" className={styles.header} gap="sm">
        <Badge appearance="soft" className={styles.sectionBadge} tone="primary">
          {strings.badge}
        </Badge>
        <Text as="h2" className={styles.title} lineHeight="lineHeight3xl" size="size4xl" variant="h2" weight="bold">
          {strings.titleLead} <span className={styles.titleAccent}>{strings.titleAccent}</span>
        </Text>
        <Text as="p" className={styles.subtitle} lineHeight="lineHeightLg" size="sizeLg" tone="text-muted" variant="body">
          {strings.subtitle}
        </Text>
      </Stack>

      <Grid className={styles.stepsGrid} columns={4} gap="lg">
        {strings.steps.map((step, index) => {
          const Icon = stepIcons[index] || CheckIcon;
          const isFinal = index === strings.steps.length - 1;

          return (
            <Surface className={styles.stepCard} data-final={isFinal || undefined} key={step.number}>
              <Stack className={styles.stepBody} gap="lg">
                <Inline className={styles.stepHeader} justify="between" wrap={false}>
                  <span className={styles.stepNumber}>{step.number}</span>
                  <span className={styles.stepIcon}>
                    <Icon className={styles.stepIconSvg} />
                  </span>
                </Inline>

                <Stack gap="xs">
                  <Text as="h3" className={styles.stepTitle} variant="h3">
                    {step.title}
                  </Text>
                  <Text as="p" className={styles.stepDescription} lineHeight="lineHeightMd" tone="text-muted" variant="body">
                    {step.description}
                  </Text>
                </Stack>
              </Stack>

              <span className={styles.stepLabel}>{step.label}</span>
            </Surface>
          );
        })}
      </Grid>

      <Surface className={styles.portalPanel}>
        <span aria-hidden="true" className={styles.portalGlow} />
        <Inline align="center" className={styles.portalInner} justify="between">
          <Stack className={styles.portalCopy} gap="xs">
            <Inline className={styles.portalEyebrow} gap="xs" wrap={false}>
              <StarIcon className={styles.portalEyebrowIcon} />
              <span>{strings.portal.eyebrow}</span>
            </Inline>
            <Text as="h3" className={styles.portalTitle} variant="h3">
              {strings.portal.title}
            </Text>
            <Text as="p" className={styles.portalDescription} lineHeight="lineHeightMd" tone="text-muted" variant="body">
              {strings.portal.description}
            </Text>
          </Stack>

          <Inline className={styles.portalActions} gap="md">
            <Inline className={styles.portalChips} gap="xs">
              {strings.portal.chips.map((chip, index) => {
                const Icon = chipIcons[index] || SettingsIcon;

                return (
                  <Inline className={styles.portalChip} gap="xs" key={chip} wrap={false}>
                    <Icon className={styles.portalChipIcon} />
                    <span>{chip}</span>
                  </Inline>
                );
              })}
            </Inline>

            <Button
              appearance="outline"
              className={styles.portalAction}
              icon={<ArrowForwardIcon className={styles.portalActionIcon} />}
              iconPosition="end"
              onClick={() => onRouteClick("home")}
              size="md"
              tone="primary"
            >
              {strings.portal.cta}
            </Button>
          </Inline>
        </Inline>
      </Surface>
    </Stack>
  );
};
