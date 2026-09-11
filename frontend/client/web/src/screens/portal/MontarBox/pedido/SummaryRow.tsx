import React from "react";
import { Inline, Text } from "@foundation/ui";
import styles from "../MontarBoxView.module.css";

export interface SummaryRowProps {
  label: string;
  value: string;
}

export const SummaryRow: React.FC<SummaryRowProps> = ({ label, value }) => (
  <Inline className={styles.summaryRow} justify="between">
    <Text as="span" className={styles.summaryRowLabel} variant="caption">{label}</Text>
    <Text as="strong" className={styles.summaryRowValue} variant="body" weight="bold">{value}</Text>
  </Inline>
);
