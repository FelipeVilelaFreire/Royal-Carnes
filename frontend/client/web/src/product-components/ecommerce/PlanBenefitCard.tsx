"use client";

import React from "react";
import { Button } from "@/legacy/design-system";

export interface PlanBenefitCardProps {
  style?: React.CSSProperties;
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
    style: "currency",
    currency: "BRL"
  }).format(value);

export const PlanBenefitCard: React.FC<PlanBenefitCardProps> = ({
  style,
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
  isDark,
  tokens
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
      className="royal-plan-benefit-card"
      style={{
        border: `1px solid ${selected ? tokens.copper : tokens.border}`,
        borderRadius: "18px",
        padding: layoutMode === "compact" ? "14px" : "18px",
        background: selected ? (isDark ? "rgba(184, 115, 51, 0.1)" : "rgba(184, 115, 51, 0.08)") : tokens.surfaceContainer,
        color: tokens.text,
        minWidth: 0,
        minHeight: layoutMode === "compact" ? "220px" : "320px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: "18px",
        opacity: disabled ? 0.68 : 1,
        boxShadow: selected ? "0 18px 38px rgba(0, 0, 0, 0.2)" : "none",
        transition: "all 0.2s ease",
        ...style
      }}
    >
      <div style={{ display: "grid", gap: layoutMode === "compact" ? "10px" : "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "start" }}>
          <div style={{ minWidth: 0, display: "grid", gap: "6px" }}>
            {shouldShowBadge ? (
              <span
                style={{
                  width: "fit-content",
                  maxWidth: "100%",
                  borderRadius: "999px",
                  padding: "5px 9px",
                  background: tokens.copper,
                  color: "#FCFBF7",
                  fontSize: "10px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {badge}
              </span>
            ) : null}

            {showHighlight && highlightLabel ? (
              <code style={{ color: tokens.copper, fontSize: "11px", fontWeight: 900 }}>
                {highlightLabel}
              </code>
            ) : null}

            {showName ? (
              <h3
                style={{
                  margin: 0,
                  color: tokens.text,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: layoutMode === "compact" ? "22px" : "28px",
                  lineHeight: 1.05,
                  letterSpacing: 0
                }}
              >
                {name}
              </h3>
            ) : null}
          </div>

          {showSelectedState && selected && selectedLabel ? (
            <span
              style={{
                borderRadius: "999px",
                border: `1px solid ${tokens.copper}`,
                padding: "5px 9px",
                color: tokens.copper,
                fontSize: "10px",
                fontWeight: 900,
                whiteSpace: "nowrap"
              }}
            >
              {selectedLabel}
            </span>
          ) : null}
        </div>

        {showDescription ? (
          <p style={{ margin: 0, color: tokens.textMuted, fontSize: "13px", lineHeight: 1.45 }}>
            {description}
          </p>
        ) : null}

        {hasPrice ? (
          <div style={{ display: "grid", gap: "4px" }}>
            {pricePrefixLabel ? (
              <span style={{ color: tokens.textMuted, fontSize: "11px", fontWeight: 800, textTransform: "uppercase" }}>
                {pricePrefixLabel}
              </span>
            ) : null}
            <strong style={{ color: tokens.copper, fontSize: layoutMode === "compact" ? "22px" : "30px", lineHeight: 1 }}>
              {formatMoney(price)}
            </strong>
            {showBillingCycle ? (
              <span style={{ color: tokens.textMuted, fontSize: "12px" }}>
                {isAnnual ? annualBillingCycleLabel || billingCycleLabel : billingCycleLabel}
              </span>
            ) : null}
          </div>
        ) : null}

        {shouldShowSavings ? (
          <span
            style={{
              border: `1px solid ${tokens.border}`,
              borderRadius: "8px",
              padding: "8px 10px",
              color: tokens.copper,
              background: isDark ? "rgba(184, 115, 51, 0.08)" : "rgba(184, 115, 51, 0.06)",
              fontSize: "12px",
              fontWeight: 800
            }}
          >
            {savingsLabel}
          </span>
        ) : null}

        {hasBenefits ? (
          <div style={{ display: "grid", gap: "8px" }}>
            {benefitsMode === "count" ? (
              <span style={{ color: tokens.textMuted, fontSize: "13px" }}>
                {benefitCountLabel || String(benefits.length)}
              </span>
            ) : benefitsMode === "summary" ? (
              <span style={{ color: tokens.textMuted, fontSize: "13px", lineHeight: 1.45 }}>
                {visibleBenefits.join(" - ")}
              </span>
            ) : (
              visibleBenefits.map((benefit) => (
                <span key={benefit} style={{ color: tokens.textMuted, fontSize: "13px", lineHeight: 1.35 }}>
                  {benefit}
                </span>
              ))
            )}
          </div>
        ) : null}
      </div>

      <div style={{ display: "grid", gap: "8px" }}>
        {shouldShowAction ? (
          <Button
            variant={selected ? "primary" : "outline"}
            size="sm"
            isDark={isDark}
            fullWidth
            disabled={disabled}
            onClick={onAction}
            style={{
              opacity: disabled ? 0.7 : 1,
              cursor: disabled ? "not-allowed" : "pointer"
            }}
          >
            {actionText}
          </Button>
        ) : null}
        {disabled && disabledHint ? (
          <span style={{ color: tokens.textMuted, fontSize: "11px", lineHeight: 1.35 }}>
            {disabledHint}
          </span>
        ) : null}
      </div>
    </article>
  );
};
