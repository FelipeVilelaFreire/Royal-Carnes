import React from "react";
import { Button } from "@foundation/ui/Button";
import { BoxIcon, CheckIcon, StoreIcon, TruckIcon } from "@foundation/ui/Icon/AppIcons";
import { Surface } from "@foundation/ui/Surface";
import { Text } from "@foundation/ui/Text";
import { sharedAssets } from "@royalprime/client/manifest/assets";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import styles from "./HeroSection.module.css";

export interface HeroSectionProps {
  onRouteClick: (routeKey: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const strings = useClientStrings().landing.hero;
  const journeyIcons = [StoreIcon, BoxIcon, TruckIcon];

  return (
    <div className={styles.sectionRoot}>
      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span>{strings.badge}</span>
        </div>

        <Text as="h1" className={styles.title} lineHeight="lineHeight4xl" size="size4xl" variant="h1" weight="bold">
          {strings.title}
        </Text>

        <Text as="p" className={styles.subtitle} lineHeight="lineHeightLg" size="sizeLg" tone="text-muted" variant="body">
          {strings.subtitle}
        </Text>

        <div className={styles.actions}>
          <Button
            appearance="solid"
            onClick={() => {
              document.getElementById("assinaturas")?.scrollIntoView({ behavior: "smooth" });
            }}
            size="lg"
            tone="primary"
          >
            {strings.ctaPlans}
          </Button>

          <Button
            appearance="outline"
            onClick={() => {
              document.getElementById("selecao")?.scrollIntoView({ behavior: "smooth" });
            }}
            size="lg"
            tone="neutral"
          >
            {strings.ctaShowcase}
          </Button>
        </div>

        <div className={styles.statsGrid}>
          {strings.stats.map((stat) => (
            <div className={styles.stat} key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <aside className={styles.visualColumn}>
        <Surface appearance="glass" className={styles.heroCard}>
          <div className={styles.mediaFrame}>
            <img alt={strings.mediaAlt} className={styles.mediaImage} src={sharedAssets.client.landing.heroProduct} />
            <div className={styles.mediaOverlay} />
            <span className={styles.mediaBadge}>{strings.mediaBadge}</span>
          </div>

          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <img alt="" aria-hidden="true" className={styles.brandMark} src={sharedAssets.client.brandLogo} />
              <div className={styles.cardCopy}>
                <Text as="h2" className={styles.cardTitle} size="sizeXl" variant="h2" weight="bold">
                  {strings.mediaTitle}
                </Text>
                <Text as="p" lineHeight="lineHeightMd" size="sizeSm" tone="text-muted" variant="body">
                  {strings.mediaDescription}
                </Text>
              </div>
            </div>

            <div className={styles.journey}>
              <span className={styles.journeyTitle}>{strings.journey.title}</span>
              <div className={styles.journeySteps}>
                {strings.journey.steps.map((step, index) => {
                  const Icon = journeyIcons[index] || CheckIcon;

                  return (
                    <div className={styles.journeyStep} key={step}>
                      <span className={styles.journeyIcon}>
                        <Icon size={16} />
                      </span>
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Surface>
      </aside>
    </div>
  );
};
