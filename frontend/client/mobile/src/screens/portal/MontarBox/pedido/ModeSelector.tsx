import React from "react";
import { Button } from "@foundation/ui/native/Button";
import { Stack } from "@foundation/ui/native/Layout";
import { Surface } from "@foundation/ui/native/Surface";
import { Text } from "@foundation/ui/native/Text";
import type { ClientCheckoutProductExperience } from "../../../../../../shared-core/view-models/checkout.view-model";
import { createPedidoStyles } from "./styles";

export interface ModeSelectorProps {
  modeOrder: ClientCheckoutProductExperience[];
  onSelectMode: (mode: ClientCheckoutProductExperience) => void;
  selectedMode: ClientCheckoutProductExperience | null;
  strings: any;
  tokens: any;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  modeOrder,
  onSelectMode,
  selectedMode,
  strings,
  tokens,
}) => {
  const styles = createPedidoStyles(tokens);

  return (
    <Stack style={styles.compactStack}>
      {modeOrder.map((mode) => {
        const copy = strings.modes[mode];
        const active = selectedMode === mode;

        return (
          <Button
            appearance={active ? "soft" : "transparent"}
            key={mode}
            onAction={() => onSelectMode(mode)}
            style={{ ...styles.option, ...(active ? styles.optionActive : {}) }}
            tone={active ? "primary" : "neutral"}
          >
            <Surface style={{ borderWidth: 0, ...styles.compactStack }}>
              <Text style={styles.accent} variant="caption">{copy.eyebrow}</Text>
              <Text style={styles.title} variant="h3">{copy.title}</Text>
              <Text style={styles.muted}>{copy.description}</Text>
            </Surface>
          </Button>
        );
      })}
    </Stack>
  );
};
