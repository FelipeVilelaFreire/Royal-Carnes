import React from "react";
import { Button } from "@foundation/ui/native/Button";
import { Stack } from "@foundation/ui/native/Layout";
import { Surface } from "@foundation/ui/native/Surface";
import { Text } from "@foundation/ui/native/Text";
import { Inline } from "@foundation/ui/native/Layout";
import { createCheckoutStyles } from "../checkout.styles";

export interface MobileSelectionSummaryProps {
  contextLabel: string;
  estimateLabel: string;
  estimateValue: string;
  itemCount: number;
  itemLabel: string;
  nextStepLabel: string;
  onNextStep: () => void;
  title: string;
  tokens: any;
}

export const MobileSelectionSummary: React.FC<MobileSelectionSummaryProps> = ({
  estimateLabel,
  estimateValue,
  contextLabel,
  itemCount,
  itemLabel,
  nextStepLabel,
  onNextStep,
  title,
  tokens,
}) => {
  const styles = createCheckoutStyles(tokens);

  return (
    <Surface style={styles.panel}>
      <Stack style={styles.compactStack}>
        <Text style={styles.accent} variant="caption">{contextLabel}</Text>
        <Text style={styles.title}>{title}</Text>
        <Inline style={styles.summaryRow}>
          <Text style={styles.muted}>{itemLabel}</Text>
          <Text style={styles.title}>{String(itemCount)}</Text>
        </Inline>
        <Inline style={styles.summaryRow}>
          <Text style={styles.muted}>{estimateLabel}</Text>
          <Text style={styles.accent}>{estimateValue}</Text>
        </Inline>
        <Button onAction={onNextStep}>{nextStepLabel}</Button>
      </Stack>
    </Surface>
  );
};
