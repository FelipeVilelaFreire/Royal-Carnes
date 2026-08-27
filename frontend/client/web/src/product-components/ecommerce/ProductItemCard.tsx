"use client";

import React from "react";
import { Button } from "@/legacy/design-system";
import { CheckIcon, StarIcon } from "@/legacy/design-system/Icons";

export interface ProductItemCardProps {
  style?: React.CSSProperties;
  name: string;
  description: string;
  image: string;
  categoryLabel: string;
  detailLabel?: string;
  price?: number;
  originalPrice?: number;
  priceLabel?: string;
  badge?: string;
  badgeTone?: "offer" | "limited";
  showImage?: boolean;
  showName?: boolean;
  showDescription?: boolean;
  showMeta?: boolean;
  showCategory?: boolean;
  showDetail?: boolean;
  showBadge?: boolean;
  showFavorite?: boolean;
  showOriginalPrice?: boolean;
  metaMode?: "category-detail" | "category-only" | "detail-only";
  priceMode?: "unit" | "from" | "estimate" | "included" | "hidden";
  actionMode?: "none" | "select" | "add" | "quantity" | "view-details" | "configure";
  favoriteMode?: "none" | "toggle";
  quantityMode?: "none" | "stepper" | "readonly";
  selected?: boolean;
  quantity?: number;
  quantitySuffix?: string;
  favorite?: boolean;
  showPrice?: boolean;
  showAction?: boolean;
  actionLabel?: string;
  selectedActionLabel?: string;
  actionDisabled?: boolean;
  actionDisabledLabel?: string;
  disabledHint?: string;
  onAction?: () => void;
  onDecrease?: () => void;
  onFavoriteToggle?: () => void;
  favoriteAriaLabel?: string;
  removeFavoriteAriaLabel?: string;
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

export const ProductItemCard: React.FC<ProductItemCardProps> = ({
  style,
  name,
  description,
  image,
  categoryLabel,
  detailLabel,
  price,
  originalPrice,
  priceLabel,
  badge,
  badgeTone = "offer",
  showImage = true,
  showName = true,
  showDescription = true,
  showMeta = true,
  showCategory = true,
  showDetail = true,
  showBadge = true,
  showFavorite = true,
  showOriginalPrice = true,
  metaMode = "category-detail",
  priceMode = "unit",
  actionMode = "add",
  favoriteMode = "toggle",
  quantityMode = "stepper",
  selected = false,
  quantity = 0,
  quantitySuffix,
  favorite = false,
  showPrice = true,
  showAction = false,
  actionLabel,
  selectedActionLabel,
  actionDisabled = false,
  actionDisabledLabel,
  disabledHint,
  onAction,
  onDecrease,
  onFavoriteToggle,
  favoriteAriaLabel,
  removeFavoriteAriaLabel,
  isDark,
  tokens
}) => {
  const hasPrice = showPrice && priceMode !== "hidden" && priceMode !== "included" && typeof price === "number";
  const shouldShowCategory = showCategory && metaMode !== "detail-only";
  const shouldShowDetail = showDetail && metaMode !== "category-only";
  const hasMeta = showMeta && (shouldShowCategory || (shouldShowDetail && detailLabel));
  const metaLabel = [
    shouldShowCategory ? categoryLabel : null,
    shouldShowDetail && detailLabel ? detailLabel : null
  ].filter(Boolean).join(" - ");
  const badgeBg = badgeTone === "limited" ? (isDark ? "#1A1A1A" : "#2E2520") : tokens.copper;
  const hasQuantity = quantity > 0;
  const canToggleFavorite = showFavorite && favoriteMode !== "none" && onFavoriteToggle;
  const canShowAction = showAction && actionMode !== "none" && Boolean(actionLabel);
  const canUseStepper = canShowAction && quantityMode === "stepper" && actionMode !== "view-details" && actionMode !== "configure";
  const actionText = actionDisabled ? actionDisabledLabel || actionLabel : selected ? selectedActionLabel || actionLabel : actionLabel;
  const isCardDisabled = actionDisabled && !selected;
  const disabledSurface = isDark ? "rgba(255, 255, 255, 0.012)" : "rgba(246, 242, 236, 0.72)";

  return (
    <article
      className={`royal-product-card${isCardDisabled ? " royal-product-card-disabled" : ""}`}
      style={{
        position: "relative",
        border: `1px solid ${selected ? tokens.copper : tokens.border}`,
        borderRadius: "18px",
        overflow: "hidden",
        background: isCardDisabled ? disabledSurface : isDark ? "rgba(255, 255, 255, 0.025)" : "rgba(255, 255, 255, 0.68)",
        minWidth: 0,
        boxShadow: selected
          ? isDark
            ? "0 18px 38px rgba(0, 0, 0, 0.24)"
            : "0 18px 38px rgba(184, 115, 51, 0.1)"
          : "none",
        opacity: isCardDisabled ? 0.76 : 1,
        transition: "all 0.2s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        ...style
      }}
    >
      <div>
        {showImage ? (
          <div style={{ height: "156px", background: tokens.background, position: "relative" }}>
            <img
              src={image}
              alt={name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: isCardDisabled ? "grayscale(0.45) saturate(0.65)" : "none",
                opacity: isCardDisabled ? 0.58 : 1
              }}
            />
            {isCardDisabled ? (
              <span style={{ position: "absolute", inset: 0, background: isDark ? "rgba(11, 9, 8, 0.42)" : "rgba(252, 251, 247, 0.42)" }} />
            ) : null}

            {showBadge && badge ? (
              <span
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  zIndex: 2,
                  background: badgeBg,
                  color: "#FCFBF7",
                  fontSize: "10px",
                  fontWeight: 800,
                  padding: "5px 9px",
                  borderRadius: "999px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  boxShadow: "0 8px 18px rgba(0, 0, 0, 0.22)"
                }}
              >
                {badge}
              </span>
            ) : null}

            {selected ? (
              <span
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  minWidth: hasQuantity ? "42px" : "30px",
                  height: "30px",
                  borderRadius: "999px",
                  display: "grid",
                  placeItems: "center",
                  padding: hasQuantity ? "0 10px" : 0,
                  background: tokens.copper,
                  color: "#FCFBF7",
                  fontSize: "12px",
                  fontWeight: 900
                }}
              >
                {hasQuantity ? `${quantity} ${quantitySuffix || ""}`.trim() : <CheckIcon size={16} />}
              </span>
            ) : null}

            {canToggleFavorite ? (
              <button
                type="button"
                onClick={onFavoriteToggle}
                aria-label={favorite ? removeFavoriteAriaLabel : favoriteAriaLabel}
                style={{
                  position: "absolute",
                  bottom: "12px",
                  right: "12px",
                  width: "36px",
                  height: "36px",
                  borderRadius: "999px",
                  border: `1px solid ${tokens.border}`,
                  background: favorite ? tokens.copper : tokens.surfaceContainer,
                  color: favorite ? "#FCFBF7" : tokens.text,
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  boxShadow: "0 8px 18px rgba(0, 0, 0, 0.16)"
                }}
              >
                <StarIcon size={17} />
              </button>
            ) : null}
          </div>
        ) : null}

        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "13px" }}>
          {(showName || showDescription) ? (
            <div>
              {showName ? (
                <h3
                  style={{
                    margin: showDescription ? "0 0 6px" : 0,
                    color: isCardDisabled ? tokens.textMuted : tokens.text,
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "20px",
                    fontWeight: 700,
                    lineHeight: 1.18
                  }}
                >
                  {name}
                </h3>
              ) : null}
            {showDescription ? (
              <p style={{ margin: 0, color: tokens.textMuted, fontSize: "13px", lineHeight: 1.4 }}>
                {description}
              </p>
            ) : null}
            </div>
          ) : null}

          {hasMeta ? (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span
                style={{
                  border: `1px solid ${tokens.border}`,
                  borderRadius: "999px",
                  padding: "5px 9px",
                  color: tokens.textMuted,
                  background: isCardDisabled ? (isDark ? "rgba(0, 0, 0, 0.16)" : "rgba(255, 255, 255, 0.5)") : "transparent",
                  fontSize: "12px"
                }}
              >
                {metaLabel}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {showBadge && badge && !showImage ? (
        <div style={{ padding: "0 16px 12px" }}>
          <span
            style={{
              display: "inline-flex",
              background: badgeBg,
              color: "#FCFBF7",
              fontSize: "10px",
              fontWeight: 800,
              padding: "5px 9px",
              borderRadius: "999px",
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            }}
          >
            {badge}
          </span>
        </div>
      ) : null}

      {canToggleFavorite && !showImage ? (
        <div style={{ padding: "0 16px 12px" }}>
          <button
            type="button"
            onClick={onFavoriteToggle}
            aria-label={favorite ? removeFavoriteAriaLabel : favoriteAriaLabel}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "999px",
              border: `1px solid ${tokens.border}`,
              background: favorite ? tokens.copper : tokens.surfaceContainer,
              color: favorite ? "#FCFBF7" : tokens.text,
              display: "grid",
              placeItems: "center",
              cursor: "pointer"
            }}
          >
            <StarIcon size={17} />
          </button>
        </div>
      ) : null}

      {(hasPrice || canShowAction) ? (
        <div
          style={{
            padding: "0 16px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: "12px"
          }}
        >
          {hasPrice ? (
            <div>
              {priceLabel ? (
                <span
                  style={{
                    display: "block",
                    color: tokens.textMuted,
                    fontSize: "11px",
                    textTransform: "uppercase",
                    fontWeight: 800,
                    marginBottom: "3px"
                  }}
                >
                  {priceLabel}
                </span>
              ) : null}
              {showOriginalPrice && typeof originalPrice === "number" ? (
                <span style={{ display: "block", color: tokens.textMuted, fontSize: "12px", textDecoration: "line-through" }}>
                  {formatMoney(originalPrice)}
                </span>
              ) : null}
              <strong style={{ color: isCardDisabled ? tokens.textMuted : tokens.copper, fontSize: "18px" }}>{formatMoney(price)}</strong>
            </div>
          ) : (
            <span />
          )}

          {canShowAction ? (
            selected && quantity > 0 && canUseStepper ? (
              <div
                style={{
                  width: "100%",
                  height: "36px",
                  border: `1px solid ${tokens.copper}`,
                  borderRadius: "4px",
                  display: "grid",
                  gridTemplateColumns: "42px 1fr 42px",
                  alignItems: "center",
                  overflow: "hidden",
                  color: tokens.text,
                  background: isDark ? "rgba(184, 115, 51, 0.1)" : "rgba(184, 115, 51, 0.08)"
                }}
              >
                <button
                  type="button"
                  onClick={onDecrease}
                  aria-label="Remover unidade"
                  style={{
                    height: "100%",
                    border: "none",
                    borderRight: `1px solid ${tokens.border}`,
                    background: "transparent",
                    color: tokens.copper,
                    cursor: "pointer",
                    fontSize: "18px",
                    fontWeight: 900
                  }}
                >
                  -
                </button>
                <span style={{ textAlign: "center", fontWeight: 900, fontSize: "13px" }}>{quantity}</span>
                <button
                  type="button"
                  onClick={onAction}
                  disabled={actionDisabled}
                  aria-label="Adicionar unidade"
                  style={{
                    height: "100%",
                    border: "none",
                    borderLeft: `1px solid ${tokens.border}`,
                    background: "transparent",
                    color: actionDisabled ? tokens.textMuted : tokens.copper,
                    cursor: actionDisabled ? "not-allowed" : "pointer",
                    opacity: actionDisabled ? 0.62 : 1,
                    fontSize: "18px",
                    fontWeight: 900
                  }}
                >
                  +
                </button>
              </div>
            ) : quantityMode === "readonly" && quantity > 0 ? (
              <div
                style={{
                  width: "100%",
                  minHeight: "36px",
                  border: `1px solid ${tokens.border}`,
                  borderRadius: "4px",
                  display: "grid",
                  placeItems: "center",
                  color: tokens.text,
                  background: isDark ? "rgba(255, 255, 255, 0.035)" : "rgba(255, 255, 255, 0.62)",
                  fontWeight: 900,
                  fontSize: "13px"
                }}
              >
                {quantity}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                isDark={isDark}
                fullWidth
                disabled={actionDisabled}
                onClick={onAction}
                style={{
                  opacity: actionDisabled ? 0.7 : 1,
                  cursor: actionDisabled ? "not-allowed" : "pointer"
                }}
              >
                {actionText}
              </Button>
            )
          ) : null}
          {actionDisabled && disabledHint ? (
            <span style={{ color: tokens.textMuted, fontSize: "11px", lineHeight: 1.35 }}>
              {disabledHint}
            </span>
          ) : null}
        </div>
      ) : null}
    </article>
  );
};
