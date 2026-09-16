import React, { type ReactNode } from "react";
import { Text } from "@foundation/ui";
import styles from "./AcquisitionIntro.module.css";

export interface AcquisitionIntroProps {
  children: ReactNode;
  strings: {
    description: string;
    eyebrow: string;
  };
}

export const AcquisitionIntro: React.FC<AcquisitionIntroProps> = ({ children, strings }) => (
  <section className={styles.root}>
    <div className={styles.copy}>
      <Text as="span" className={styles.eyebrow} tone="primary" variant="caption">
        {strings.eyebrow}
      </Text>
      <Text className={styles.description} tone="text-muted">
        {strings.description}
      </Text>
    </div>
    {children}
  </section>
);
