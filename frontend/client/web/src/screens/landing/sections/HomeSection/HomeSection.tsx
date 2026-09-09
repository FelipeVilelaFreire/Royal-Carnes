import React from "react";
import { Button } from "@foundation/ui/Button";
import { ArrowForwardIcon, StarIcon } from "@foundation/ui/Icon/AppIcons";
import { Grid, Inline, Stack } from "@foundation/ui/Layout";
import { Text } from "@foundation/ui/Text";
import { sharedAssets } from "@royalprime/client/manifest/assets";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import styles from "./HomeSection.module.css";

export interface HomeSectionProps {
  onRouteClick: (routeKey: string) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ onRouteClick }) => {
  const strings = useClientStrings().landing.hero;

  return (
    <Grid className={styles.sectionRoot} columns={20} gap="3xl">
      <Stack className={styles.content} gap="xl">
        <Inline className={styles.badge} gap="xs" wrap={false}>
          <StarIcon className={styles.badgeIcon} />
          <span>{strings.badge}</span>
        </Inline>

        <Text as="h1" className={styles.title} lineHeight="lineHeight4xl" size="size4xl" variant="h1" weight="bold">
          {strings.titleLead} <span className={styles.titleAccent}>{strings.titleAccent}</span>
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
            onClick={() => onRouteClick("cortes")}
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
        <figure className={styles.mediaFrame}>
          <img alt={strings.mediaAlt} className={styles.mediaImage} src={sharedAssets.client.landing.heroProduct} />
          <span aria-hidden="true" className={styles.mediaOverlay} />
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
              {strings.journey.steps.map((step, index) => (
                <Inline className={styles.journeyStep} gap="xs" key={step} wrap={false}>
                  <span className={styles.journeyNumber}>{index + 1}</span>
                  <span>{step}</span>
                </Inline>
              ))}
            </Grid>
          </Stack>
        </figure>
      </aside>
    </Grid>
  );
};
