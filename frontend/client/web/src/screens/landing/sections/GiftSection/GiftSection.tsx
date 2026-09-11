import React from "react";
import { Button } from "@foundation/ui/web/Button";
import { ScrollToAppear } from "@foundation/ui/web/ScrollToAppear/ScrollToAppear";
import { Surface } from "@foundation/ui/web/Surface";
import { Text } from "@foundation/ui/web/Text";
import { sharedAssets } from "@royalprime/client/manifest/assets";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import styles from "./GiftSection.module.css";

export interface GiftSectionProps {
  onRouteClick: (routeKey: string) => void;
}

export const GiftSection: React.FC<GiftSectionProps> = ({ onRouteClick }) => {
  const strings = useClientStrings().landing.gift;

  return (
    <div className={styles.sectionRoot}>
      <ScrollToAppear direction="up">
        <Surface className={styles.card}>
          <div className={styles.grid}>
            <div className={styles.content}>
              <span className={styles.badge}>{strings.badge}</span>

              <Text as="h2" className={styles.title} lineHeight="lineHeight2xl" size="size3xl" variant="h2" weight="bold">
                {strings.title}
              </Text>

              <Text as="p" className={styles.description} lineHeight="lineHeightLg" size="sizeMd" tone="text-muted" variant="body">
                {strings.description}
              </Text>

              <div className={styles.action}>
                <Button appearance="solid" onClick={() => onRouteClick("plans")} size="lg" tone="primary">
                  {strings.cta}
                </Button>
              </div>
            </div>

            <div className={styles.mediaColumn}>
              <div className={styles.mediaFrame}>
                <img
                  alt={strings.imageAlt}
                  className={styles.mediaImage}
                  src={sharedAssets.client.landing.royalBoxGift}
                />
              </div>
            </div>
          </div>
        </Surface>
      </ScrollToAppear>
    </div>
  );
};
