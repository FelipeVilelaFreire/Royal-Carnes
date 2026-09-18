import React from "react";
import { AcquisitionIntro } from "./AcquisitionIntro";
import { AcquisitionModeGrid } from "./AcquisitionModeGrid";

interface CheckoutAcquisitionProps {
  activeSubscription: React.ComponentProps<typeof AcquisitionModeGrid>["activeSubscription"];
  activeSubscriptionLabel: React.ComponentProps<typeof AcquisitionModeGrid>["activeSubscriptionLabel"];
  activeSubscriptionPlan: React.ComponentProps<typeof AcquisitionModeGrid>["activeSubscriptionPlan"];
  modeOrder: React.ComponentProps<typeof AcquisitionModeGrid>["modeOrder"];
  onSelectMode: React.ComponentProps<typeof AcquisitionModeGrid>["onSelectMode"];
  selectedMode: React.ComponentProps<typeof AcquisitionModeGrid>["selectedMode"];
  strings: React.ComponentProps<typeof AcquisitionModeGrid>["strings"];
}

export const CheckoutAcquisition: React.FC<CheckoutAcquisitionProps> = ({
  activeSubscription,
  activeSubscriptionLabel,
  activeSubscriptionPlan,
  modeOrder,
  onSelectMode,
  selectedMode,
  strings,
}) => (
  <AcquisitionIntro isCompact={Boolean(selectedMode)} strings={strings.modeSelection}>
    <AcquisitionModeGrid
      activeSubscription={activeSubscription}
      activeSubscriptionLabel={activeSubscriptionLabel}
      activeSubscriptionPlan={activeSubscriptionPlan}
      modeOrder={modeOrder}
      onSelectMode={onSelectMode}
      selectedMode={selectedMode}
      strings={strings}
    />
  </AcquisitionIntro>
);
