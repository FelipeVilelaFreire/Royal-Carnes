import React from "react";
import { CheckIcon, FlameIcon, SnowflakeIcon } from "@foundation/ui/web/Icon/AppIcons";
import { ScrollToAppear } from "@foundation/ui/web/ScrollToAppear/ScrollToAppear";
import { Surface } from "@foundation/ui/web/Surface";
import { Text } from "@foundation/ui/web/Text";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import styles from "./DifferentialsSection.module.css";

export const DifferentialsSection: React.FC = () => {
  const strings = useClientStrings().landing.differentials;

  const items = [
    { icon: <SnowflakeIcon className={styles.cardIconSvg} />, ...strings.coldChain },
    { icon: <CheckIcon className={styles.cardIconSvg} />, ...strings.curatorship },
    { icon: <FlameIcon className={styles.cardIconSvg} />, ...strings.flexibility },
  ];

  return (
    <div className={styles.sectionRoot}>
      <ScrollToAppear direction="up">
        <header className={styles.header}>
          <span className={styles.eyebrow}>{strings.badge}</span>
          <Text as="h2" className={styles.title} size="size3xl" variant="h2" weight="bold">
            {strings.title}
          </Text>
        </header>
      </ScrollToAppear>

      <div className={styles.grid}>
        {items.map((item, index) => (
          <ScrollToAppear delayMs={index * 120} direction="up" key={item.title}>
            <Surface className={styles.card}>
              <div className={styles.cardIcon}>{item.icon}</div>
              <Text as="h3" className={styles.cardTitle} size="sizeXl" variant="h3" weight="bold">
                {item.title}
              </Text>
              <Text as="p" className={styles.cardDescription} lineHeight="lineHeightLg" size="sizeSm" tone="text-muted" variant="body">
                {item.description}
              </Text>
            </Surface>
          </ScrollToAppear>
        ))}
      </div>
    </div>
  );
};
