import React from "react";
import { Surface, Text } from "@foundation/ui";
import styles from "../PedidoView.module.css";

export interface PedidoHeroProps {
  cardSurface: React.CSSProperties;
  hasMode: boolean;
  strings: {
    badge: string;
    description: string;
    title: string;
  };
  tokens: {
    copper: string;
    surfaceContainer: string;
    border: string;
    text: string;
    textMuted: string;
  };
}

export const PedidoHero: React.FC<PedidoHeroProps> = ({ cardSurface, hasMode, strings, tokens }) => (
  <section className={styles.heroWrap} style={{ "--pedido-hero-margin": hasMode ? "var(--theme--spacing-spaceLg)" : "var(--theme--spacing-spaceXl)" } as React.CSSProperties}>
    <Surface
      appearance="soft"
      className={styles.heroPanel}
      style={{
        ...cardSurface,
        "--pedido-hero-bg": tokens.surfaceContainer,
        "--pedido-hero-border": tokens.border,
        "--pedido-hero-padding-x": hasMode ? "var(--theme--spacing-spaceLg)" : "var(--theme--spacing-spaceXl)",
        "--pedido-hero-padding-y": hasMode ? "var(--theme--spacing-spaceLg)" : "var(--theme--spacing-spaceXl)",
        "--pedido-hero-text": tokens.text,
      } as React.CSSProperties}
    >
      <Text as="span" className={styles.sectionKicker} style={{ color: tokens.copper }} tone="inherit" variant="caption">
        {strings.badge}
      </Text>
      <Text
        as="h1"
        className={styles.heroTitle}
        tone="inherit"
        variant="h1"
        style={{ fontSize: hasMode ? "var(--theme--typography-size3xl)" : "var(--theme--typography-size4xl)" }}
      >
        {strings.title}
      </Text>
      <Text tone="inherit" style={{ color: tokens.textMuted }}>
        {strings.description}
      </Text>
    </Surface>
  </section>
);
