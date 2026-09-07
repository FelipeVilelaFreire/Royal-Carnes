"use client";

import React from "react";
import { Button } from "@foundation/ui/Button";
import styles from "./PlanBenefitCard.module.css";

export interface PlanBenefitCardProps {
  className?: string;
  name: string;
  description: string;
  monthlyPrice?: number;
  annualMonthlyPrice?: number;
  billingCycleLabel?: string;
  annualBillingCycleLabel?: string;
  savingsLabel?: string;
  badge?: string;
  benefits?: string[];
  benefitCountLabel?: string;
  highlightLabel?: string;
  pricePrefixLabel?: string;
  selectedLabel?: string;
  showName?: boolean;
  showDescription?: boolean;
  showPrice?: boolean;
  showBillingCycle?: boolean;
  showBenefits?: boolean;
  showSavings?: boolean;
  showBadge?: boolean;
  showAction?: boolean;
  showSelectedState?: boolean;
  showHighlight?: boolean;
  priceMode?: "monthly" | "annual" | "included" | "hidden";
  benefitsMode?: "summary" | "list" | "count" | "hidden";
  promotionMode?: "none" | "annual-savings" | "limited-offer" | "recommended";
  actionMode?: "none" | "select" | "upgrade" | "manage" | "view-details";
  layoutMode?: "compact" | "standard" | "comparison";
  selected?: boolean;
  disabled?: boolean;
  actionLabel?: string;
  selectedActionLabel?: string;
  disabledHint?: string;
  onAction?: () => void;
  isDark: boolean;
  tokens: {
    background: string;
    surfaceContainer: string;
    border: string;
    text: string;
    textMuted: string;
    copper: string;
  };
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(value);

export const PlanBenefitCard: React.FC<PlanBenefitCardProps> = ({
  className,
  name,
  description,
  monthlyPrice,
  annualMonthlyPrice,
  billingCycleLabel,
  annualBillingCycleLabel,
  savingsLabel,
  badge,
  benefits = [],
  benefitCountLabel,
  highlightLabel,
  pricePrefixLabel,
  selectedLabel,
  showName = true,
  showDescription = true,
  showPrice = true,
  showBillingCycle = true,
  showBenefits = true,
  showSavings = false,
  showBadge = false,
  showAction = true,
  showSelectedState = true,
  showHighlight = false,
  priceMode = "monthly",
  benefitsMode = "list",
  promotionMode = "none",
  actionMode = "select",
  layoutMode = "standard",
  selected = false,
  disabled = false,
  actionLabel,
  selectedActionLabel,
  disabledHint,
  onAction,
  isDark: _isDark,
  tokens: _tokens,
}) => {
  const isAnnual = priceMode === "annual";
  const price = isAnnual ? annualMonthlyPrice ?? monthlyPrice : monthlyPrice;
  const hasPrice = showPrice && priceMode !== "hidden" && priceMode !== "included" && typeof price === "number";
  const hasBenefits = showBenefits && benefitsMode !== "hidden" && benefits.length > 0;
  const visibleBenefits = layoutMode === "compact" ? benefits.slice(0, 2) : benefits.slice(0, layoutMode === "comparison" ? 4 : 3);
  const shouldShowSavings = showSavings && promotionMode === "annual-savings" && Boolean(savingsLabel);
  const shouldShowBadge = showBadge && Boolean(badge);
  const shouldShowAction = showAction && actionMode !== "none" && Boolean(actionLabel);
  const actionText = selected ? selectedActionLabel || actionLabel : actionLabel;

  return (
    <article
      className={[styles.card, className].filter(Boolean).join(" ")}
      data-disabled={disabled || undefined}
      data-layout={layoutMode}
      data-selected={selected || undefined}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleStack}>
            {shouldShowBadge ? <span className={styles.badge}>{badge}</span> : null}

            {showHighlight && highlightLabel ? <code className={styles.highlight}>{highlightLabel}</code> : null}

            {showName ? <h3 className={styles.name}>{name}</h3> : null}
          </div>

          {showSelectedState && selected && selectedLabel ? (
            <span className={styles.selectedLabel}>{selectedLabel}</span>
          ) : null}
        </div>

        {showDescription ? <p className={styles.description}>{description}</p> : null}

        {hasPrice ? (
          <div className={styles.priceBlock}>
            {pricePrefixLabel ? <span className={styles.pricePrefix}>{pricePrefixLabel}</span> : null}
            <strong className={styles.price}>{formatMoney(price)}</strong>
            {showBillingCycle ? (
              <span className={styles.billingCycle}>
                {isAnnual ? annualBillingCycleLabel || billingCycleLabel : billingCycleLabel}
              </span>
            ) : null}
          </div>
        ) : null}

        {shouldShowSavings ? <span className={styles.savings}>{savingsLabel}</span> : null}

        {hasBenefits ? (
          <div className={styles.benefits}>
            {benefitsMode === "count" ? (
              <span className={styles.benefit}>{benefitCountLabel || String(benefits.length)}</span>
            ) : benefitsMode === "summary" ? (
              <span className={styles.benefit}>{visibleBenefits.join(" - ")}</span>
            ) : (
              visibleBenefits.map((benefit) => (
                <span className={styles.benefit} key={benefit}>
                  {benefit}
                </span>
              ))
            )}
          </div>
        ) : null}
      </div>

      <div className={styles.footer}>
        {shouldShowAction ? (
          <Button
            appearance={selected ? "solid" : "outline"}
            className={styles.action}
            disabled={disabled}
            onClick={onAction}
            size="sm"
            tone={selected ? "primary" : "neutral"}
          >
            {actionText}
          </Button>
        ) : null}
        {disabled && disabledHint ? <span className={styles.disabledHint}>{disabledHint}</span> : null}
      </div>
    </article>
  );
};
