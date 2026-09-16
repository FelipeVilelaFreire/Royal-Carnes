"use client";

import React from "react";
import { Button } from "../../../foundation/ui/web/Button";
import { Card } from "../../../foundation/ui/web/Card";
import { CartIcon, CheckIcon, FlameIcon, HeartIcon, MinusIcon, PlusIcon, StarIcon } from "../../../foundation/ui/web/Icon/AppIcons";
import { Icon } from "../../../foundation/ui/web/Icon";
import { Box, Inline, Stack } from "../../../foundation/ui/web/Layout";
import { Text } from "../../../foundation/ui/web/Text";
import {
  resolveProductItemCardComposition,
  type ProductItemCardActionMode,
  type ProductItemCardDensity,
  type ProductItemCardFavoriteMode,
  type ProductItemCardMetaMode,
  type ProductItemCardPreset,
  type ProductItemCardPriceMode,
  type ProductItemCardQuantityMode,
} from "../product-item-card.config";
import styles from "./ProductItemCard.module.css";

export interface ProductItemCardProps {
  preset?: ProductItemCardPreset;
  name: string;
  description: string;
  image: string;
  categoryLabel: string;
  detailLabel?: string;
  headerDetail?: string;
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
  metaMode?: ProductItemCardMetaMode;
  priceMode?: ProductItemCardPriceMode;
  actionMode?: ProductItemCardActionMode;
  actionPresentation?: "icon" | "label";
  density?: ProductItemCardDensity;
  favoriteMode?: ProductItemCardFavoriteMode;
  quantityMode?: ProductItemCardQuantityMode;
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
}

const joinClassName = (...values: Array<string | undefined>) => values.filter(Boolean).join(" ");

export const ProductItemCard: React.FC<ProductItemCardProps> = ({
  preset = "catalogo",
  name,
  description,
  image,
  categoryLabel,
  detailLabel,
  headerDetail,
  price,
  originalPrice,
  priceLabel,
  formatPrice,
  badge,
  badgeTone = "offer",
  showImage,
  showName,
  showDescription,
  showMeta,
  showCategory,
  showDetail,
  showBadge,
  showFavorite,
  showOriginalPrice,
  metaMode,
  priceMode,
  actionMode,
  actionPresentation = "icon",
  density,
  favoriteMode,
  quantityMode,
  selected = false,
  quantity = 0,
  quantitySuffix,
  favorite = false,
  showPrice,
  showAction,
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
}) => {
  const [isMediaUnavailable, setIsMediaUnavailable] = React.useState(false);
  const composition = resolveProductItemCardComposition(preset, {
    actionMode,
    density,
    favoriteMode,
    metaMode,
    priceMode,
    quantityMode,
    showAction,
    showBadge,
    showCategory,
    showDescription,
    showDetail,
    showFavorite,
    showImage,
    showMeta,
    showName,
    showOriginalPrice,
    showPrice,
  });
  const {
    actionMode: resolvedActionMode,
    density: resolvedDensity,
    favoriteMode: resolvedFavoriteMode,
    metaMode: resolvedMetaMode,
    priceMode: resolvedPriceMode,
    quantityMode: resolvedQuantityMode,
    showAction: resolvedShowAction,
    showBadge: resolvedShowBadge,
    showCategory: resolvedShowCategory,
    showDescription: resolvedShowDescription,
    showDetail: resolvedShowDetail,
    showFavorite: resolvedShowFavorite,
    showImage: resolvedShowImage,
    showMeta: resolvedShowMeta,
    showName: resolvedShowName,
    showOriginalPrice: resolvedShowOriginalPrice,
    showPrice: resolvedShowPrice,
  } = composition;
  const hasPrice = resolvedShowPrice && resolvedPriceMode !== "hidden" && resolvedPriceMode !== "included" && typeof price === "number";
  const shouldShowCategory = resolvedShowCategory && resolvedMetaMode !== "detail-only";
  const shouldShowDetail = resolvedShowDetail && resolvedMetaMode !== "category-only";
  const hasMeta = resolvedShowMeta && (shouldShowCategory || (shouldShowDetail && detailLabel));
  const metaLabel = [
    shouldShowCategory ? categoryLabel : null,
    shouldShowDetail && detailLabel ? detailLabel : null,
  ].filter(Boolean).join(" - ");
  const detailMetaLabel = shouldShowDetail && detailLabel ? detailLabel : undefined;
  const hasQuantity = quantity > 0;
  const canToggleFavorite = resolvedShowFavorite && resolvedFavoriteMode !== "none" && Boolean(onFavoriteToggle);
  const canShowAction = resolvedShowAction && resolvedActionMode !== "none" && Boolean(actionLabel) && Boolean(onAction);
  const canUseStepper = canShowAction && resolvedQuantityMode === "stepper" && resolvedActionMode !== "view-details" && resolvedActionMode !== "configure";
  const actionText = actionDisabled ? actionDisabledLabel || actionLabel : selected ? selectedActionLabel || actionLabel : actionLabel;
  const isCardDisabled = actionDisabled && !selected;
  const formatPriceValue = (value: number) => formatPrice ? formatPrice(value) : String(value);
  const hasMediaImage = Boolean(image) && !isMediaUnavailable;
  if (preset === "catalogo" || resolvedDensity === "selection") {
    return (
      <Card
        className={styles.card}
        data-disabled={isCardDisabled || undefined}
        data-density={resolvedDensity}
        data-mode={isDark ? "dark" : "light"}
        data-preset={preset}
        data-selected={selected || undefined}
        data-with-image={resolvedShowImage || undefined}
        size="md"
      >
        {resolvedShowImage ? (
          <div className={styles.media}>
            {hasMediaImage ? (
              <img className={styles.mediaImage} src={image} alt="" aria-hidden="true" onError={() => setIsMediaUnavailable(true)} />
            ) : (
              <div className={styles.mediaFallback} aria-hidden="true"><FlameIcon size={28} /></div>
            )}
            {isCardDisabled ? <span className={styles.mediaScrim} aria-hidden="true" /> : null}
            {resolvedShowBadge && badge ? (
              <span className={styles.badge} data-tone={badgeTone}>{badge}</span>
            ) : null}
            {canToggleFavorite ? (
              <Button
                aria-label={favorite ? removeFavoriteAriaLabel : favoriteAriaLabel}
                appearance="soft"
                className={joinClassName(styles.favoriteButton, favorite ? styles.favoriteActive : undefined)}
                icon={<HeartIcon fill={favorite ? "currentColor" : "none"} size={14} />}
                iconPosition="only"
                onClick={onFavoriteToggle}
                size="sm"
                tone="neutral"
                type="button"
              />
            ) : null}
          </div>
        ) : null}
        <div className={styles.catalogBody}>
          {resolvedShowBadge && badge && !resolvedShowImage ? (
            <span className={joinClassName(styles.badge, styles.badgeInline)} data-tone={badgeTone}>{badge}</span>
          ) : null}
          {shouldShowCategory || headerDetail ? (
            <div className={styles.catalogMetaHeader}>
              {shouldShowCategory ? <span className={styles.catalogCategory}>{categoryLabel}</span> : <span />}
              {headerDetail ? <span className={styles.catalogHeaderDetail}>{headerDetail}</span> : null}
            </div>
          ) : null}
          {resolvedShowName ? <Text as="h3" className={styles.catalogTitle} tone="inherit" variant="h3">{name}</Text> : null}
          {resolvedShowDescription && description ? <Text className={styles.catalogDescription} tone="inherit" variant="caption">{description}</Text> : null}
          {detailMetaLabel ? <span className={styles.catalogMeta}>{detailMetaLabel}</span> : null}
          {(hasPrice || canShowAction) ? (
            <div className={styles.catalogFooter}>
              {hasPrice ? (
                <div className={styles.priceBlock}>
                  {priceLabel ? <span className={styles.priceLabel}>{priceLabel}</span> : null}
                  {resolvedShowOriginalPrice && typeof originalPrice === "number" ? <span className={styles.originalPrice}>{formatPriceValue(originalPrice)}</span> : null}
                  <strong className={styles.price}>{formatPriceValue(price)}</strong>
                </div>
              ) : null}
              {canShowAction ? (
                <div
                  className={styles.catalogAction}
                  data-expanded={canUseStepper && quantity > 0 || undefined}
                  data-presentation={actionPresentation}
                >
                  <Button
                    aria-label={actionText}
                    appearance="solid"
                    className={styles.catalogCartButton}
                    disabled={actionDisabled}
                    icon={<CartIcon />}
                    iconPosition={actionPresentation === "label" ? "start" : "only"}
                    onClick={onAction}
                    size="sm"
                    tone="primary"
                    type="button"
                  >
                    {actionPresentation === "label" ? actionText : null}
                  </Button>
                  {canUseStepper ? (
                    <div className={styles.catalogQuantityControl} role="group">
                      <button
                        aria-label={decreaseQuantityAriaLabel}
                        className={styles.catalogQuantityButton}
                        onClick={onDecrease}
                        type="button"
                      >
                        <MinusIcon aria-hidden="true" size={14} />
                      </button>
                      <span className={styles.catalogQuantityValue}>{quantity}</span>
                      <button
                        aria-label={increaseQuantityAriaLabel}
                        className={styles.catalogQuantityButton}
                        disabled={actionDisabled}
                        onClick={onAction}
                        type="button"
                      >
                        <PlusIcon aria-hidden="true" size={14} />
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={styles.card}
      data-disabled={isCardDisabled || undefined}
      data-density={resolvedDensity}
      data-mode={isDark ? "dark" : "light"}
      data-preset={preset}
      data-selected={selected || undefined}
      data-with-image={resolvedShowImage || undefined}
      size="md"
    >
      <Stack className={styles.main} gap="md">
        {resolvedShowImage ? (
          <div className={styles.media}>
            {hasMediaImage ? (
              <img className={styles.mediaImage} src={image} alt="" aria-hidden="true" onError={() => setIsMediaUnavailable(true)} />
            ) : (
              <div className={styles.mediaFallback} aria-hidden="true"><FlameIcon size={28} /></div>
            )}
            {isCardDisabled ? <span className={styles.mediaScrim} aria-hidden="true" /> : null}
            {resolvedShowBadge && badge ? (
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
          {resolvedShowBadge && badge && !resolvedShowImage ? (
            <Box>
              <span className={joinClassName(styles.badge, styles.badgeInline)} data-tone={badgeTone}>
                {badge}
              </span>
            </Box>
          ) : null}
          {canToggleFavorite && !resolvedShowImage ? (
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
          {resolvedShowName ? (
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
          {resolvedShowDescription ? (
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
              {resolvedShowOriginalPrice && typeof originalPrice === "number" ? (
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
                  icon={<MinusIcon size={14} />}
                  iconPosition="only"
                />
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
                  icon={<PlusIcon size={14} />}
                  iconPosition="only"
                />
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
