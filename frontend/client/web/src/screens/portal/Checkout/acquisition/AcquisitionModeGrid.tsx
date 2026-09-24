import React from "react";
import type { ClientCheckoutProductExperience, ClientCheckoutSubscriptionPlan } from "@/view-models/checkout.view-model";
import { AcquisitionModeCard } from "./AcquisitionModeCard";
import styles from "./AcquisitionModeGrid.module.css";

export interface AcquisitionModeGridProps {
  activeSubscription?: {
    nextBillingLabel: string;
    nextDeliveryLabel: string;
  };
  activeSubscriptionLabel: string;
  activeSubscriptionPlan?: ClientCheckoutSubscriptionPlan;
  modeOrder: ClientCheckoutProductExperience[];
  onSelectMode: (mode: ClientCheckoutProductExperience) => void;
  selectedMode: ClientCheckoutProductExperience | null;
  strings: any;
}

export const AcquisitionModeGrid: React.FC<AcquisitionModeGridProps> = ({
  activeSubscription,
  activeSubscriptionLabel,
  activeSubscriptionPlan,
  modeOrder,
  onSelectMode,
  selectedMode,
  strings,
}) => (
  <section className={styles.grid} data-compact={selectedMode ? "true" : undefined}>
    {modeOrder.map((mode) => (
      <AcquisitionModeCard
        activeSubscriptionLabel={activeSubscriptionLabel}
        activeSubscriptionPlanName={activeSubscriptionPlan?.name}
        hasActiveSubscription={Boolean(activeSubscription && activeSubscriptionPlan)}
        isActive={selectedMode === mode}
        isCompact={Boolean(selectedMode)}
        key={mode}
        mode={mode}
        onSelect={onSelectMode}
        strings={strings}
      />
    ))}
  </section>
);
