import React from "react";
import { Button } from "@foundation/ui/native/Button";
import { Stack } from "@foundation/ui/native/Layout";
import { Surface } from "@foundation/ui/native/Surface";
import { Text } from "@foundation/ui/native/Text";
import { Inline } from "@foundation/ui/native/Layout";
import { createCheckoutStyles } from "../checkout.styles";

export interface MobileSelectionSummaryProps {
  estimateLabel: string;
  estimateValue: string;
  itemCount: number;
  itemLabel: string;
  nextStepLabel: string;
  onNextStep: () => void;
  placeholder: string;
  title: string;
  tokens: any;
}

export const MobileSelectionSummary: React.FC<MobileSelectionSummaryProps> = ({
  estimateLabel,
  estimateValue,
  itemCount,
  itemLabel,
  nextStepLabel,
  onNextStep,
  placeholder,
  title,
  tokens,
}) => {
  const styles = createCheckoutStyles(tokens);

  return (
    <Surface style={styles.panel}>
      <Stack style={styles.compactStack}>
        <Text style={styles.title}>{title}</Text>
        <Inline style={styles.summaryRow}>
          <Text style={styles.muted}>{itemLabel}</Text>
          <Text style={styles.title}>{String(itemCount)}</Text>
        </Inline>
        <Inline style={styles.summaryRow}>
          <Text style={styles.muted}>{estimateLabel}</Text>
          <Text style={styles.accent}>{estimateValue}</Text>
        </Inline>
        <Text style={styles.muted}>{placeholder}</Text>
        <Button onAction={onNextStep}>{nextStepLabel}</Button>
      </Stack>
    </Surface>
  );
};
