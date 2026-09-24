import React from "react";
import { Inline, Text } from "@foundation/ui";
import styles from "../CheckoutView.module.css";

export interface SummaryRowProps {
  detail?: string;
  icon?: React.ReactNode;
  label: string;
  truncate?: boolean;
  value: string;
}

export const SummaryRow: React.FC<SummaryRowProps> = ({ detail, icon, label, truncate = false, value }) => (
  <Inline className={styles.summaryRow} justify="between">
    <span className={styles.summaryRowLeading}>
      {icon ? <span className={styles.summaryRowIcon}>{icon}</span> : null}
      <Text as="span" className={styles.summaryRowLabel} variant="body">{label}</Text>
    </span>
    <span className={styles.summaryRowValue} data-truncate={truncate || undefined}>
      <Text as="strong" className={styles.summaryRowValueText} variant="body" weight="bold">{value}</Text>
      {detail ? <Text as="span" className={styles.summaryRowValueDetail} tone="inherit" variant="caption">{detail}</Text> : null}
    </span>
  </Inline>
);
