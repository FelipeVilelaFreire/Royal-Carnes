import React, { type ReactNode } from "react";
import styles from "./AcquisitionIntro.module.css";

export interface AcquisitionIntroProps {
  children: ReactNode;
  isCompact?: boolean;
}

export const AcquisitionIntro: React.FC<AcquisitionIntroProps> = ({ children, isCompact = false }) => (
  <section className={styles.root} data-compact={isCompact || undefined}>
    {children}
  </section>
);
