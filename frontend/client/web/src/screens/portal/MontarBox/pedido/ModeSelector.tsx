import React from "react";
import type { ClientCheckoutProductExperience } from "@/view-models/checkout.view-model";
import { Button } from "@foundation/ui";
import { BoxIcon, CheckIcon, StarIcon as OfferTagIcon, TruckIcon } from "@foundation/ui/Icon/AppIcons";
import styles from "../MontarBoxView.module.css";

const modeIcons = {
  subscription: OfferTagIcon,
  royalBox: BoxIcon,
  royalDelivery: TruckIcon,
};

export interface ModeSelectorProps {
  activeCycleUsage?: {
    weightKgLimit: number;
    weightKgUsed: number;
  } | null;
  activeSubscription?: {
    nextBillingLabel: string;
    nextDeliveryLabel: string;
  };
  activeSubscriptionLabel: string;
  activeSubscriptionPlan?: unknown;
  formatMeasure: (value: number, unit: string) => string;
  hasMode: boolean;
  modeOrder: ClientCheckoutProductExperience[];
  onSelectMode: (mode: ClientCheckoutProductExperience) => void;
  selectedMode: ClientCheckoutProductExperience | null;
  strings: any;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  activeCycleUsage,
  activeSubscription,
  activeSubscriptionLabel,
  activeSubscriptionPlan,
  formatMeasure,
  hasMode,
  modeOrder,
  onSelectMode,
  selectedMode,
  strings,
}) => (
  <section
    className={styles.modeList}
    data-compact={hasMode || undefined}
  >
    {modeOrder.map((mode) => {
      const modeCopy = strings.modes[mode];
      const Icon = modeIcons[mode];
      const isActive = selectedMode === mode;
      const isActiveSubscriptionMode = mode === "subscription" && Boolean(activeSubscription && activeSubscriptionPlan);
      const modeEyebrow = isActiveSubscriptionMode ? activeSubscriptionLabel : modeCopy.eyebrow;
      const modeTitle = isActiveSubscriptionMode ? strings.summary.activeSubscriptionMode : modeCopy.title;
      const modeDescription = isActiveSubscriptionMode
        ? `${strings.summary.activeCycleDescriptionPrefix} ${activeSubscriptionLabel}.`
        : modeCopy.description;
      const modeDetails = isActiveSubscriptionMode
        ? [
            `${strings.summary.subscriptionRenewPrefix} ${activeSubscription?.nextBillingLabel}`,
            activeSubscription?.nextDeliveryLabel
              ? `${strings.summary.nextDeliveryPrefix} ${activeSubscription.nextDeliveryLabel}`
              : strings.summary.currentCycleFallback,
            activeCycleUsage
              ? `${formatMeasure(activeCycleUsage.weightKgUsed, "kg")}/${formatMeasure(
                  activeCycleUsage.weightKgLimit,
                  "kg",
                )} ${strings.summary.cycleUsedSuffix}`
              : strings.summary.currentCycleFallback,
          ]
        : modeCopy.details;

      return (
        <Button
          appearance="soft"
          aria-pressed={isActive}
          className={styles.modeCard}
          data-active={isActive || undefined}
          data-compact={hasMode || undefined}
          key={mode}
          size="md"
          tone="neutral"
          type="button"
          onClick={() => onSelectMode(mode)}
        >
          <span className={styles.modeCardContent}>
            <span className={styles.modeIcon}>
              <Icon />
            </span>
            <span className={styles.modeCopy}>
              <span className={styles.modeEyebrow}>
                {modeEyebrow}
              </span>
              <span className={styles.modeTitle}>
                {modeTitle}
              </span>
              {isActiveSubscriptionMode ? (
                <span className={styles.modeBadge}>
                  {strings.summary.activeSubscriptionBadge}
                </span>
              ) : null}
            </span>
          </span>

          {!hasMode ? (
            <p className={styles.modeDescription}>
              {modeDescription}
            </p>
          ) : null}

          <span className={styles.modeDetails} hidden={hasMode}>
            {modeDetails.map((detail: string) => (
              <span
                key={detail}
                className={styles.modeDetail}
              >
                {detail}
              </span>
            ))}
          </span>
        </Button>
      );
    })}
  </section>
);
