import React from "react";
import { Button } from "@foundation/ui/Button";
import { ArrowForwardIcon, BoxIcon, CheckIcon, StarIcon, StoreIcon, TruckIcon } from "@foundation/ui/Icon/AppIcons";
import { Grid, Inline, Stack } from "@foundation/ui/Layout";
import { Surface } from "@foundation/ui/Surface";
import { Text } from "@foundation/ui/Text";
import { sharedAssets } from "@royalprime/client/manifest/assets";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import styles from "./HeroSection.module.css";

export interface HeroSectionProps {
  onRouteClick: (routeKey: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onRouteClick }) => {
  const strings = useClientStrings().landing.hero;
  const journeyIcons = [StoreIcon, BoxIcon, TruckIcon];

  return (
    <Grid className={styles.sectionRoot} columns={20} gap="3xl">
      <Stack className={styles.content} gap="xl">
        <Inline className={styles.badge} gap="xs" wrap={false}>
          <StarIcon className={styles.badgeIcon} />
          <span>{strings.badge}</span>
        </Inline>

        <Text as="h1" className={styles.title} lineHeight="lineHeight4xl" size="size4xl" variant="h1" weight="bold">
          {strings.title}
        </Text>

        <Text as="p" className={styles.subtitle} lineHeight="lineHeightLg" size="sizeLg" tone="text-muted" variant="body">
          {strings.subtitle}
        </Text>

        <Inline className={styles.actions} gap="md" wrap>
          <Button
            appearance="solid"
            className={styles.primaryAction}
            icon={<ArrowForwardIcon className={styles.actionIcon} />}
            iconPosition="end"
            onClick={() => onRouteClick("assinaturas")}
            size="lg"
            tone="primary"
          >
            {strings.ctaPlans}
          </Button>

          <Button
            appearance="outline"
            className={styles.secondaryAction}
            onClick={() => onRouteClick("selecao")}
            size="lg"
            tone="neutral"
          >
            {strings.ctaShowcase}
          </Button>
        </Inline>

        <Grid className={styles.statsGrid} columns={3} gap="sm">
          {strings.stats.map((stat) => (
            <div className={styles.stat} key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </Grid>
      </Stack>

      <aside className={styles.visualColumn}>
        <Surface appearance="glass" className={styles.heroCard}>
          <div className={styles.mediaFrame}>
            <img alt={strings.mediaAlt} className={styles.mediaImage} src={sharedAssets.client.landing.heroProduct} />
            <div className={styles.mediaOverlay} />
            <span className={styles.mediaBadge}>
              <StarIcon className={styles.mediaBadgeIcon} />
              <span>{strings.mediaBadge}</span>
            </span>

            <Stack className={styles.experienceCard} gap="sm">
              <Inline align="start" className={styles.experienceHeader} gap="sm" justify="between" wrap={false}>
                <Stack className={styles.cardCopy} gap="xs">
                  <Text as="h2" className={styles.cardTitle} size="sizeMd" variant="h2" weight="bold">
                    {strings.mediaTitle}
                  </Text>
                  <Text as="p" className={styles.cardDescription} lineHeight="lineHeightMd" size="sizeXs" tone="text-muted" variant="body">
                    {strings.mediaDescription}
                  </Text>
                </Stack>
                <span className={styles.experiencePill}>{strings.journey.title}</span>
              </Inline>

              <Grid className={styles.journeySteps} columns={3} gap="xs">
                {strings.journey.steps.map((step, index) => {
                  const Icon = journeyIcons[index] || CheckIcon;

                  return (
                    <Inline className={styles.journeyStep} gap="xs" key={step} wrap={false}>
                      <span className={styles.journeyIcon}>
                        <Icon className={styles.journeyIconSvg} />
                      </span>
                      <span>{step}</span>
                    </Inline>
                  );
                })}
              </Grid>
            </Stack>
          </div>
        </Surface>
      </aside>
    </Grid>
  );
};
