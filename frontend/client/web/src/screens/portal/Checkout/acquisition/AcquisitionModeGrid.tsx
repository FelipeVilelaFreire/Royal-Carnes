import React from "react";
import type { ClientCheckoutProductExperience } from "@/view-models/checkout.view-model";
import { Button } from "@foundation/ui";
import { ArrowForwardIcon } from "@foundation/ui/web/Icon/AppIcons";
import styles from "../CheckoutView.module.css";

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
  <section
    className={styles.modeList}
  >
    {modeOrder.map((mode) => {
      const modeCopy = strings.modes[mode];
      const isActive = selectedMode === mode;
      const isActiveSubscriptionMode = mode === "subscription" && Boolean(activeSubscription && activeSubscriptionPlan);
      const modeEyebrow = isActiveSubscriptionMode ? activeSubscriptionLabel : modeCopy.eyebrow;
      const modeTitle = isActiveSubscriptionMode ? strings.summary.activeSubscriptionMode : modeCopy.title;
      const modeDescription = isActiveSubscriptionMode
        ? `${strings.summary.activeCycleDescriptionPrefix} ${activeSubscriptionLabel}.`
        : modeCopy.description;
      return (
        <Button
          appearance="soft"
          aria-pressed={isActive}
          className={styles.modeCard}
          data-active={isActive || undefined}
          key={mode}
          size="md"
          tone="neutral"
          type="button"
          onClick={() => onSelectMode(mode)}
        >
          <span className={styles.modeCardFrame}>
            <span className={styles.modeCardContent}>
              <span className={styles.modeCopy}>
                <span className={styles.modeHeading}>
                  <span className={styles.modeTitle}>
                    {modeTitle}
                  </span>
                  <span className={styles.modeEyebrow}>
                    {modeEyebrow}
                  </span>
                </span>
                {isActiveSubscriptionMode ? (
                  <span className={styles.modeBadge}>
                    {strings.summary.activeSubscriptionBadge}
                  </span>
                ) : null}
              </span>
            </span>

            <p className={styles.modeDescription}>
              {modeDescription}
            </p>
            <span className={styles.modeAction}>
              {modeCopy.action}
              <ArrowForwardIcon />
            </span>
            </span>
        </Button>
      );
    })}
  </section>
);
