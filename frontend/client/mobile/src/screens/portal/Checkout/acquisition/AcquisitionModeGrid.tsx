import React from "react";
import { Button } from "@foundation/ui/native/Button";
import { Inline, Stack } from "@foundation/ui/native/Layout";
import { Surface } from "@foundation/ui/native/Surface";
import { Text } from "@foundation/ui/native/Text";
import { useUi } from "@foundation/ui/native/context";
import type { ClientCheckoutProductExperience } from "../../../../../../shared-core/view-models/checkout.view-model";
import { createCheckoutStyles } from "../checkout.styles";

export interface AcquisitionModeGridProps {
  activeSubscription?: {
    nextBillingLabel: string;
    nextDeliveryLabel: string;
  };
  activeSubscriptionLabel: string;
  activeSubscriptionPlan?: unknown;
  isCompact: boolean;
  modeOrder: ClientCheckoutProductExperience[];
  onSelectMode: (mode: ClientCheckoutProductExperience) => void;
  selectedMode: ClientCheckoutProductExperience | null;
  strings: any;
  tokens: any;
}

export const AcquisitionModeGrid: React.FC<AcquisitionModeGridProps> = ({
  activeSubscription,
  activeSubscriptionLabel,
  activeSubscriptionPlan,
  isCompact,
  modeOrder,
  onSelectMode,
  selectedMode,
  strings,
  tokens,
}) => {
  const styles = createCheckoutStyles(tokens);
  const { hosts } = useUi();
  const RailContainer = hosts.ScrollView || hosts.View;

  return (
    <RailContainer
      horizontal={Boolean(hosts.ScrollView)}
      showsHorizontalScrollIndicator={false}
      style={styles.modeRail}
    >
      <Inline gap="sm">
        {modeOrder.map((mode) => {
          const copy = strings.modes[mode];
          const active = selectedMode === mode;
          const isActiveSubscriptionMode = mode === "subscription" && Boolean(activeSubscription && activeSubscriptionPlan);
          const modeEyebrow = isActiveSubscriptionMode ? activeSubscriptionLabel : copy.eyebrow;
          const modeTitle = isActiveSubscriptionMode ? strings.summary.activeSubscriptionMode : copy.title;
          const modeDescription = isActiveSubscriptionMode
            ? `${strings.summary.activeCycleDescriptionPrefix} ${activeSubscriptionLabel}.`
            : copy.description;

          return (
            <Button
              appearance={active ? "soft" : "transparent"}
              key={mode}
              onAction={() => onSelectMode(mode)}
              style={isCompact ? active ? styles.modeCardCompactActive : styles.modeCardCompact : active ? styles.modeCardActive : styles.modeCard}
              tone={active ? "primary" : "neutral"}
            >
              <Surface style={styles.modeCardContent}>
                <Text style={styles.accent} variant="caption">{modeEyebrow}</Text>
                <Text style={styles.title} variant="h3">{modeTitle}</Text>
                {isActiveSubscriptionMode ? (
                  <Text style={styles.accent} variant="caption">{strings.summary.activeSubscriptionBadge}</Text>
                ) : null}
                <Text style={styles.muted}>{modeDescription}</Text>
              </Surface>
            </Button>
          );
        })}
      </Inline>
    </RailContainer>
  );
};
