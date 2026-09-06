import React from "react";
import { Inline, Text } from "@foundation/ui";
import styles from "../PedidoView.module.css";

export interface SummaryRowProps {
  label: string;
  value: string;
  muted?: string;
  text?: string;
}

export const SummaryRow: React.FC<SummaryRowProps> = ({ label, value, muted, text }) => (
  <Inline className={styles.summaryRow} justify="between">
    <Text as="span" className={styles.summaryRowLabel} variant="caption" style={muted ? { color: muted } : undefined}>{label}</Text>
    <Text as="strong" className={styles.summaryRowValue} variant="body" weight="bold" style={text ? { color: text } : undefined}>{value}</Text>
  </Inline>
);
