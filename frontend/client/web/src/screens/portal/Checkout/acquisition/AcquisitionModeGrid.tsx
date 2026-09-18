import React from "react";
import type { ClientCheckoutProductExperience } from "@/view-models/checkout.view-model";
import { Button } from "@foundation/ui";
import { ArrowForwardIcon, BoxIcon, CartIcon, TruckIcon } from "@foundation/ui/web/Icon/AppIcons";
import styles from "./AcquisitionModeGrid.module.css";

export interface AcquisitionModeGridProps {
  activeSubscription?: {
    nextBillingLabel: string;
    nextDeliveryLabel: string;
  };
  activeSubscriptionLabel: string;
  activeSubscriptionPlan?: unknown;
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
    {modeOrder.map((mode) => {
      const modeCopy = strings.modes[mode];
      const isActive = selectedMode === mode;
      const isActiveSubscriptionMode = mode === "subscription" && Boolean(activeSubscription && activeSubscriptionPlan);
      const modeEyebrow = isActiveSubscriptionMode ? activeSubscriptionLabel : modeCopy.eyebrow;
      const modeTitle = isActiveSubscriptionMode ? strings.summary.activeSubscriptionMode : modeCopy.title;
      const modeDescription = isActiveSubscriptionMode
        ? `${strings.summary.activeCycleDescriptionPrefix} ${activeSubscriptionLabel}.`
        : modeCopy.description;
      const ModeIcon = mode === "subscription" ? CartIcon : mode === "royalBox" ? BoxIcon : TruckIcon;
      return (
        <Button
          appearance="soft"
          aria-pressed={isActive}
          className={styles.card}
          data-active={isActive || undefined}
          key={mode}
          size="md"
          tone={isActive ? "accent" : "neutral"}
          type="button"
          onClick={() => onSelectMode(mode)}
        >
          <span className={styles.cardFrame}>
            <span className={styles.cardHeading}>
              <span className={styles.iconFrame}>
                <ModeIcon aria-hidden="true" className={styles.icon} />
              </span>
              <span className={styles.copy}>
                <span className={styles.eyebrow}>{modeEyebrow}</span>
                <span className={styles.title}>{modeTitle}</span>
                {isActiveSubscriptionMode ? (
                  <span className={styles.badge}>{strings.summary.activeSubscriptionBadge}</span>
                ) : null}
                <span className={styles.description}>{modeDescription}</span>
              </span>
            </span>

            <span className={styles.action}>
              {modeCopy.action}
              <ArrowForwardIcon />
            </span>
          </span>
        </Button>
      );
    })}
  </section>
);
