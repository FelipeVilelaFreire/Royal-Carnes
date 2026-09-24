import React from "react";
import { Badge, Button } from "@foundation/ui";
import { ArrowForwardIcon, BoxIcon, CartIcon, TruckIcon } from "@foundation/ui/web/Icon/AppIcons";
import type { ClientCheckoutProductExperience } from "@/view-models/checkout.view-model";
import styles from "./AcquisitionModeCard.module.css";

export interface AcquisitionModeCardProps {
  activeSubscriptionLabel: string;
  activeSubscriptionPlanName?: string;
  hasActiveSubscription: boolean;
  isActive: boolean;
  isCompact: boolean;
  mode: ClientCheckoutProductExperience;
  onSelect: (mode: ClientCheckoutProductExperience) => void;
  strings: any;
}

export const AcquisitionModeCard: React.FC<AcquisitionModeCardProps> = ({
  activeSubscriptionLabel,
  activeSubscriptionPlanName,
  hasActiveSubscription,
  isActive,
  isCompact,
  mode,
  onSelect,
  strings,
}) => {
  const modeCopy = strings.modes[mode];
  const isActiveSubscriptionMode = mode === "subscription" && hasActiveSubscription;
  const activePlanName = activeSubscriptionPlanName || activeSubscriptionLabel;
  const modeEyebrow = isActiveSubscriptionMode ? undefined : modeCopy.eyebrow;
  const modeTitle = isActiveSubscriptionMode ? activePlanName : modeCopy.title;
  const modeDescription = isActiveSubscriptionMode
    ? `${strings.summary.activeCycleDescriptionPrefix} ${activePlanName}.`
    : modeCopy.description;
  const ModeIcon = mode === "subscription" ? CartIcon : mode === "royalBox" ? BoxIcon : TruckIcon;

  return (
    <Button
      appearance="soft"
      aria-pressed={isActive}
      className={styles.card}
      data-active={isActive || undefined}
      data-compact={isCompact || undefined}
      size="md"
      tone={isActive ? "accent" : "neutral"}
      type="button"
      onClick={() => onSelect(mode)}
    >
      <span className={styles.cardFrame}>
        {isActiveSubscriptionMode ? (
          <Badge appearance="soft" className={styles.badge} tone="primary">
            {strings.summary.activeSubscriptionBadge}
          </Badge>
        ) : null}
        <span className={styles.cardHeading}>
          <span className={styles.iconFrame}>
            <ModeIcon aria-hidden="true" className={styles.icon} />
          </span>
          <span className={styles.copy}>
            {modeEyebrow ? <span className={styles.eyebrow}>{modeEyebrow}</span> : null}
            <span className={styles.title}>{modeTitle}</span>
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
};
