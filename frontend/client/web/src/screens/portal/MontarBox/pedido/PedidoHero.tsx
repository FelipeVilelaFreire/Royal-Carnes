import React from "react";
import { Surface, Text } from "@foundation/ui";
import styles from "../MontarBoxView.module.css";

export interface PedidoHeroProps {
  hasMode: boolean;
  strings: {
    badge: string;
    description: string;
    title: string;
  };
}

export const PedidoHero: React.FC<PedidoHeroProps> = ({ hasMode, strings }) => (
  <section className={styles.heroWrap} data-compact={hasMode || undefined}>
    <Surface
      appearance="soft"
      className={styles.heroPanel}
      data-compact={hasMode || undefined}
    >
      <Text as="span" className={styles.sectionKicker} tone="inherit" variant="caption">
        {strings.badge}
      </Text>
      <Text
        as="h1"
        className={styles.heroTitle}
        data-compact={hasMode || undefined}
        tone="inherit"
        variant="h1"
      >
        {strings.title}
      </Text>
      <Text className={styles.heroDescription} tone="inherit">
        {strings.description}
      </Text>
    </Surface>
  </section>
);
