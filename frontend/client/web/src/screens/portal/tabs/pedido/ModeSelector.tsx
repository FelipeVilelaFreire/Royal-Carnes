import React from "react";
import type { ClientCheckoutProductExperience } from "@/view-models/checkout.view-model";
import { Button } from "@foundation/ui";
import { BoxIcon, CheckIcon, StarIcon as OfferTagIcon, TruckIcon } from "@foundation/ui/Icon/AppIcons";
import styles from "../PedidoView.module.css";

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
  cardSurface: React.CSSProperties;
  formatMeasure: (value: number, unit: string) => string;
  hasMode: boolean;
  modeOrder: ClientCheckoutProductExperience[];
  onSelectMode: (mode: ClientCheckoutProductExperience) => void;
  selectedMode: ClientCheckoutProductExperience | null;
  strings: any;
  tokens: {
    border: string;
    copper: string;
    ivory: string;
    surfaceContainer: string;
    text: string;
    textMuted: string;
  };
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  activeCycleUsage,
  activeSubscription,
  activeSubscriptionLabel,
  activeSubscriptionPlan,
  cardSurface,
  formatMeasure,
  hasMode,
  modeOrder,
  onSelectMode,
  selectedMode,
  strings,
  tokens,
}) => (
  <section
    className={styles.modeList}
    style={{
      "--pedido-mode-gap": hasMode ? "var(--theme--spacing-spaceXs)" : "var(--theme--spacing-spaceMd)",
      marginBottom: hasMode ? "var(--theme--spacing-spaceLg)" : "0",
      transition: "all 0.28s ease",
    } as React.CSSProperties}
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
          style={{
            "--pedido-mode-accent": tokens.copper,
            "--pedido-mode-bg": isActive
              ? "color-mix(in srgb, var(--pedido-mode-accent) 7%, var(--pedido-mode-surface))"
              : tokens.surfaceContainer,
            "--pedido-mode-border": tokens.border,
            "--pedido-mode-surface": tokens.surfaceContainer,
            "--pedido-mode-text": tokens.text,
            "--pedido-mode-muted": tokens.textMuted,
            "--pedido-mode-title-size": hasMode ? "var(--theme--typography-size2xl)" : "var(--theme--typography-size3xl)",
            "--pedido-mode-icon-bg": isActive
              ? "color-mix(in srgb, var(--pedido-mode-accent) 14%, var(--pedido-mode-surface))"
              : tokens.surfaceContainer,
            "--pedido-mode-icon-border": isActive
              ? "color-mix(in srgb, var(--pedido-mode-accent) 72%, var(--pedido-mode-border))"
              : "color-mix(in srgb, var(--pedido-mode-text) 12%, var(--pedido-mode-border))",
            "--pedido-mode-icon-color": tokens.copper,
            "--pedido-mode-icon-size": hasMode ? "var(--theme--dimensions-height-lg)" : "var(--theme--dimensions-height-xl)",
            "--ui-surface-bg": "var(--pedido-mode-bg)",
            "--ui-surface-border": isActive
              ? "color-mix(in srgb, var(--pedido-mode-accent) 76%, var(--pedido-mode-border))"
              : "color-mix(in srgb, var(--pedido-mode-text) 14%, var(--pedido-mode-border))",
            "--ui-surface-border-width": "var(--theme--borders-hairline)",
            "--ui-surface-color": tokens.text,
            "--ui-surface-shadow": cardSurface.boxShadow,
          } as React.CSSProperties}
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
