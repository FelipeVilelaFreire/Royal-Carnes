import React from "react";
import { Surface, Text } from "@foundation/ui";
import styles from "../PedidoView.module.css";

export interface CheckoutPanelProps {
  badge: string;
  children: React.ReactNode;
  description: string;
  title: string;
  tokens: {
    border: string;
    copper: string;
    surfaceContainer: string;
    text: string;
    textMuted: string;
  };
}

export const CheckoutPanel: React.FC<CheckoutPanelProps> = ({
  badge,
  children,
  description,
  title,
  tokens,
}) => (
  <Surface
    appearance="soft"
    className={styles.checkoutPanel}
    style={{
      "--pedido-panel-accent": tokens.copper,
      "--pedido-panel-bg": tokens.surfaceContainer,
      "--pedido-panel-border": tokens.border,
      "--pedido-panel-muted": tokens.textMuted,
      "--pedido-panel-text": tokens.text,
    } as React.CSSProperties}
  >
    <Text as="span" className={styles.sectionKicker} tone="inherit" variant="caption">
      {badge}
    </Text>
    <Text as="h2" tone="inherit" variant="h2">
      {title}
    </Text>
    <Text className={styles.checkoutDescription} tone="inherit">
      {description}
    </Text>
    {children}
  </Surface>
);
