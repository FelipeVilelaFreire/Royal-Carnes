import React from "react";
import { Surface, Text } from "@foundation/ui";
import styles from "../MontarBoxView.module.css";

export interface CheckoutPanelProps {
  badge: string;
  children: React.ReactNode;
  description: string;
  title: string;
}

export const CheckoutPanel: React.FC<CheckoutPanelProps> = ({
  badge,
  children,
  description,
  title,
}) => (
  <Surface
    appearance="soft"
    className={styles.checkoutPanel}
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
