"use client";

import React from "react";
import { Button } from "../../foundation/ui/Button";
import { Card } from "../../foundation/ui/Card";
import { CheckIcon, StarIcon } from "../../foundation/ui/Icon/AppIcons";
import { Icon } from "../../foundation/ui/Icon";
import { Box, Inline, Stack } from "../../foundation/ui/Layout";
import { Text } from "../../foundation/ui/Text";
import styles from "./ProductItemCard.module.css";

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
  formatPrice?: (value: number) => string;
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
  increaseQuantityAriaLabel?: string;
  decreaseQuantityAriaLabel?: string;
  isDark?: boolean;
  tokens?: {
    background: string;
    surfaceContainer: string;
    border: string;
    text: string;
    textMuted: string;
    copper: string;
  };
}

const joinClassName = (...values: Array<string | undefined>) => values.filter(Boolean).join(" ");

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
  formatPrice,
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
  increaseQuantityAriaLabel,
  decreaseQuantityAriaLabel,
  isDark = true,
  tokens,
}) => {
  const hasPrice = showPrice && priceMode !== "hidden" && priceMode !== "included" && typeof price === "number";
  const shouldShowCategory = showCategory && metaMode !== "detail-only";
  const shouldShowDetail = showDetail && metaMode !== "category-only";
  const hasMeta = showMeta && (shouldShowCategory || (shouldShowDetail && detailLabel));
  const metaLabel = [
    shouldShowCategory ? categoryLabel : null,
    shouldShowDetail && detailLabel ? detailLabel : null,
  ].filter(Boolean).join(" - ");
  const hasQuantity = quantity > 0;
  const canToggleFavorite = showFavorite && favoriteMode !== "none" && Boolean(onFavoriteToggle);
  const canShowAction = showAction && actionMode !== "none" && Boolean(actionLabel);
  const canUseStepper = canShowAction && quantityMode === "stepper" && actionMode !== "view-details" && actionMode !== "configure";
  const actionText = actionDisabled ? actionDisabledLabel || actionLabel : selected ? selectedActionLabel || actionLabel : actionLabel;
  const isCardDisabled = actionDisabled && !selected;
  const formatPriceValue = (value: number) => formatPrice ? formatPrice(value) : String(value);
  const tokenStyle = {
    "--product-card-bg": tokens?.surfaceContainer || "var(--theme--color-surfaceContainer, var(--theme--color-surface))",
    "--product-card-surface": tokens?.background || "var(--theme--color-background)",
    "--product-card-border": tokens?.border || "var(--theme--color-border)",
    "--product-card-outer-border": selected
      ? "var(--product-card-accent)"
      : isDark
        ? "color-mix(in srgb, var(--product-card-border) 56%, var(--product-card-accent))"
        : "color-mix(in srgb, var(--product-card-border) 86%, var(--product-card-accent))",
    "--product-card-text": tokens?.text || "var(--theme--color-text)",
    "--product-card-muted": tokens?.textMuted || "var(--theme--color-textMuted, var(--theme--color-text-muted))",
    "--product-card-accent": tokens?.copper || "var(--theme--color-accent, var(--app-shell-accent))",
    "--product-card-accent-contrast": (isDark ? tokens?.background : tokens?.text) || "var(--theme--color-accentContrast, var(--app-shell-accent-contrast))",
    "--ui-surface-bg": "var(--product-card-bg)",
    "--ui-surface-border": "var(--product-card-outer-border)",
    "--ui-surface-color": "var(--product-card-text)",
    ...style,
  } as React.CSSProperties;

  return (
    <Card
      className={styles.card}
      data-disabled={isCardDisabled || undefined}
      data-mode={isDark ? "dark" : "light"}
      data-selected={selected || undefined}
      data-with-image={showImage || undefined}
      size="md"
      style={tokenStyle}
    >
      <Stack gap="md">
        {showImage ? (
          <div className={styles.media}>
            <img className={styles.mediaImage} src={image} alt="" aria-hidden="true" />
            {isCardDisabled ? <span className={styles.mediaScrim} aria-hidden="true" /> : null}
            {showBadge && badge ? (
              <span className={styles.badge} data-tone={badgeTone}>
                {badge}
              </span>
            ) : null}
            {selected ? (
              <span className={styles.selectedIndicator}>
                {hasQuantity ? `${quantity} ${quantitySuffix || ""}`.trim() : <CheckIcon size={16} />}
              </span>
            ) : null}
            {canToggleFavorite ? (
              <Button
                aria-label={favorite ? removeFavoriteAriaLabel : favoriteAriaLabel}
                appearance={favorite ? "solid" : "soft"}
                className={styles.favoriteButton}
                icon={<StarIcon />}
                iconPosition="only"
                onClick={onFavoriteToggle}
                size="sm"
                tone={favorite ? "primary" : "neutral"}
                type="button"
              />
            ) : null}
          </div>
        ) : null}

        <Stack className={styles.content} gap="sm">
          {showBadge && badge && !showImage ? (
            <Box>
              <span className={joinClassName(styles.badge, styles.badgeInline)} data-tone={badgeTone}>
                {badge}
              </span>
            </Box>
          ) : null}
          {canToggleFavorite && !showImage ? (
            <Box>
              <Button
                aria-label={favorite ? removeFavoriteAriaLabel : favoriteAriaLabel}
                appearance={favorite ? "solid" : "soft"}
                icon={<StarIcon />}
                iconPosition="only"
                onClick={onFavoriteToggle}
                size="sm"
                tone={favorite ? "primary" : "neutral"}
                type="button"
              />
            </Box>
          ) : null}
          {showName ? (
            <Text
              as="h3"
              className={styles.title}
              lineHeight="lineHeightMd"
              size="sizeMd"
              tone="inherit"
              variant="body"
              weight="semibold"
            >
              {name}
            </Text>
          ) : null}
          {showDescription ? (
            <Text className={styles.description} tone="inherit" variant="caption">
              {description}
            </Text>
          ) : null}
          {hasMeta ? (
            <div className={styles.metaList}>
              <span className={styles.metaPill}>{metaLabel}</span>
            </div>
          ) : null}
        </Stack>
      </Stack>

      {(hasPrice || canShowAction) ? (
        <Stack className={styles.footer} gap="sm">
          {hasPrice ? (
            <div className={styles.priceBlock}>
              {priceLabel ? <span className={styles.priceLabel}>{priceLabel}</span> : null}
              {showOriginalPrice && typeof originalPrice === "number" ? (
                <span className={styles.originalPrice}>{formatPriceValue(originalPrice)}</span>
              ) : null}
              <strong className={styles.price}>{formatPriceValue(price)}</strong>
            </div>
          ) : null}

          {canShowAction ? (
            selected && quantity > 0 && canUseStepper ? (
              <div className={styles.quantityControl}>
                <Button
                  aria-label={decreaseQuantityAriaLabel}
                  appearance="outline"
                  className={styles.quantityButton}
                  onClick={onDecrease}
                  size="sm"
                  tone="neutral"
                  type="button"
                >
                  -
                </Button>
                <span className={styles.quantityValue}>{quantity}</span>
                <Button
                  aria-label={increaseQuantityAriaLabel}
                  appearance="outline"
                  className={styles.quantityButton}
                  disabled={actionDisabled}
                  onClick={onAction}
                  size="sm"
                  tone="neutral"
                  type="button"
                >
                  +
                </Button>
              </div>
            ) : quantityMode === "readonly" && quantity > 0 ? (
              <span className={styles.readonlyQuantity}>{quantity}</span>
            ) : (
              <Button
                appearance="outline"
                disabled={actionDisabled}
                onClick={onAction}
                size="sm"
                tone="neutral"
                type="button"
              >
                {actionText}
              </Button>
            )
          ) : null}
          {actionDisabled && disabledHint ? (
            <Inline>
              <Icon tone="inherit" size="sm"><CheckIcon /></Icon>
              <span className={styles.disabledHint}>{disabledHint}</span>
            </Inline>
          ) : null}
        </Stack>
      ) : null}
    </Card>
  );
};
