import React, { type ReactNode } from "react";
import { Text } from "@foundation/ui";
import styles from "./AcquisitionIntro.module.css";

export interface AcquisitionIntroProps {
  children: ReactNode;
  isCompact?: boolean;
  strings: {
    description: string;
  };
}

export const AcquisitionIntro: React.FC<AcquisitionIntroProps> = ({ children, isCompact = false, strings }) => (
  <section className={styles.root} data-compact={isCompact || undefined}>
    <div className={styles.copy}>
      <Text className={styles.description} tone="text-muted">
        {strings.description}
      </Text>
    </div>
    {children}
  </section>
);
