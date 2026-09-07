import React from "react";
import { ScrollToAppear } from "@foundation/ui/ScrollToAppear/ScrollToAppear";
import { Surface } from "@foundation/ui/Surface";
import { Text } from "@foundation/ui/Text";
import { sharedAssets } from "@royalprime/client/manifest/assets";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import styles from "./ShowcaseSection.module.css";

export const ShowcaseSection: React.FC = () => {
  const strings = useClientStrings().landing.showcase;

  const cards = [
    {
      ...strings.tomahawk,
      image: sharedAssets.client.landing.showcaseMostOrdered,
    },
    {
      ...strings.wagyu,
      image: sharedAssets.client.landing.showcaseFamily,
    },
    {
      ...strings.picanha,
      image: sharedAssets.client.landing.showcasePremium,
    },
  ];

  return (
    <div className={styles.sectionRoot}>
      <ScrollToAppear direction="up">
        <header className={styles.header}>
          <span className={styles.eyebrow}>{strings.badge}</span>
          <Text as="h2" className={styles.title} size="size3xl" variant="h2" weight="bold">
            {strings.title}
          </Text>
          <Text as="p" className={styles.subtitle} size="sizeMd" tone="text-muted" variant="body">
            {strings.subtitle}
          </Text>
        </header>
      </ScrollToAppear>

      <div className={styles.grid}>
        {cards.map((card, index) => (
          <ScrollToAppear delayMs={index * 120} direction="up" key={card.title}>
            <Surface className={styles.card}>
              <div className={styles.media}>
                <img alt={card.title} className={styles.image} src={card.image} />
                <div className={styles.imageOverlay} />
                <span className={styles.cardBadge}>{card.badge}</span>
              </div>
              <div className={styles.cardBody}>
                <Text as="h3" className={styles.cardTitle} size="sizeXl" variant="h3" weight="bold">
                  {card.title}
                </Text>
                <Text as="p" className={styles.cardDescription} lineHeight="lineHeightLg" size="sizeSm" tone="text-muted" variant="body">
                  {card.description}
                </Text>
              </div>
            </Surface>
          </ScrollToAppear>
        ))}
      </div>
    </div>
  );
};
