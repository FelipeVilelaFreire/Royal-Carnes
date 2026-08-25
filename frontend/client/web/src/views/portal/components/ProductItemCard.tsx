"use client";

import React from "react";
import { Button } from "../../../design-system";
import { CheckIcon, StarIcon } from "../../../design-system/Icons";

export interface ProductItemCardProps {
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
  selected?: boolean;
  quantity?: number;
  quantitySuffix?: string;
  favorite?: boolean;
  showPrice?: boolean;
  showAction?: boolean;
  actionLabel?: string;
  selectedActionLabel?: string;
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
  selected = false,
  quantity = 0,
  quantitySuffix,
  favorite = false,
  showPrice = true,
  showAction = false,
  actionLabel,
  selectedActionLabel,
  onAction,
  onDecrease,
  onFavoriteToggle,
  favoriteAriaLabel,
  removeFavoriteAriaLabel,
  isDark,
  tokens
}) => {
  const hasPrice = showPrice && typeof price === "number";
  const badgeBg = badgeTone === "limited" ? (isDark ? "#1A1A1A" : "#2E2520") : tokens.copper;
  const hasQuantity = quantity > 0;

  return (
    <article
      className="royal-product-card"
      style={{
        position: "relative",
        border: `1px solid ${selected ? tokens.copper : tokens.border}`,
        borderRadius: "18px",
        overflow: "hidden",
        background: isDark ? "rgba(255, 255, 255, 0.025)" : "rgba(255, 255, 255, 0.68)",
        minWidth: 0,
        boxShadow: selected
          ? isDark
            ? "0 18px 38px rgba(0, 0, 0, 0.24)"
            : "0 18px 38px rgba(184, 115, 51, 0.1)"
          : "none",
        transition: "all 0.2s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <div>
        <div style={{ height: "156px", background: tokens.background, position: "relative" }}>
          <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

          {badge ? (
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

          {onFavoriteToggle ? (
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

        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "13px" }}>
          <div>
            <h3
              style={{
                margin: "0 0 6px",
                color: tokens.text,
                fontFamily: "'Playfair Display', serif",
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: 1.18
              }}
            >
              {name}
            </h3>
            <p style={{ margin: 0, color: tokens.textMuted, fontSize: "13px", lineHeight: 1.4 }}>
              {description}
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span
              style={{
                border: `1px solid ${tokens.border}`,
                borderRadius: "999px",
                padding: "5px 9px",
                color: tokens.textMuted,
                fontSize: "12px"
              }}
            >
              {categoryLabel}
            </span>
            {detailLabel ? (
              <span
                style={{
                  border: `1px solid ${tokens.border}`,
                  borderRadius: "999px",
                  padding: "5px 9px",
                  color: tokens.textMuted,
                  fontSize: "12px"
                }}
              >
                {detailLabel}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {(hasPrice || showAction) ? (
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
              {typeof originalPrice === "number" ? (
                <span style={{ display: "block", color: tokens.textMuted, fontSize: "12px", textDecoration: "line-through" }}>
                  {formatMoney(originalPrice)}
                </span>
              ) : null}
              <strong style={{ color: tokens.copper, fontSize: "18px" }}>{formatMoney(price)}</strong>
            </div>
          ) : (
            <span />
          )}

          {showAction && actionLabel ? (
            selected && quantity > 0 ? (
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
                  aria-label="Adicionar unidade"
                  style={{
                    height: "100%",
                    border: "none",
                    borderLeft: `1px solid ${tokens.border}`,
                    background: "transparent",
                    color: tokens.copper,
                    cursor: "pointer",
                    fontSize: "18px",
                    fontWeight: 900
                  }}
                >
                  +
                </button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                isDark={isDark}
                fullWidth
                onClick={onAction}
              >
                {selected ? selectedActionLabel || actionLabel : actionLabel}
              </Button>
            )
          ) : null}
        </div>
      ) : null}
    </article>
  );
};
