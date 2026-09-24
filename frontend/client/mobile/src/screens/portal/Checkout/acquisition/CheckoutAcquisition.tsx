import React from "react";
import { AcquisitionIntro } from "./AcquisitionIntro";
import { AcquisitionModeGrid } from "./AcquisitionModeGrid";

interface CheckoutAcquisitionProps {
  activeSubscription: React.ComponentProps<typeof AcquisitionModeGrid>["activeSubscription"];
  activeSubscriptionLabel: string;
  activeSubscriptionPlan: React.ComponentProps<typeof AcquisitionModeGrid>["activeSubscriptionPlan"];
  isCompact: React.ComponentProps<typeof AcquisitionModeGrid>["isCompact"];
  modeOrder: React.ComponentProps<typeof AcquisitionModeGrid>["modeOrder"];
  onSelectMode: React.ComponentProps<typeof AcquisitionModeGrid>["onSelectMode"];
  selectedMode: React.ComponentProps<typeof AcquisitionModeGrid>["selectedMode"];
  strings: React.ComponentProps<typeof AcquisitionModeGrid>["strings"];
  tokens: React.ComponentProps<typeof AcquisitionModeGrid>["tokens"];
}

export const CheckoutAcquisition: React.FC<CheckoutAcquisitionProps> = ({
  activeSubscription,
  activeSubscriptionLabel,
  activeSubscriptionPlan,
  isCompact,
  modeOrder,
  onSelectMode,
  selectedMode,
  strings,
  tokens,
}) => (
  <AcquisitionIntro isCompact={isCompact}>
    <AcquisitionModeGrid
      activeSubscription={activeSubscription}
      activeSubscriptionLabel={activeSubscriptionLabel}
      activeSubscriptionPlan={activeSubscriptionPlan}
      modeOrder={modeOrder}
      onSelectMode={onSelectMode}
      selectedMode={selectedMode}
      isCompact={isCompact}
      strings={strings}
      tokens={tokens}
    />
  </AcquisitionIntro>
);
