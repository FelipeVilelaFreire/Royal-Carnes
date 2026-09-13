import React from "react";
import { Button } from "@foundation/ui/native/Button";
import { Stack } from "@foundation/ui/native/Layout";
import { Surface } from "@foundation/ui/native/Surface";
import { Text } from "@foundation/ui/native/Text";
import { useUi } from "@foundation/ui/native/context";
import {
  resolveProductItemCardComposition,
  type ProductItemCardActionMode,
  type ProductItemCardFavoriteMode,
  type ProductItemCardMetaMode,
  type ProductItemCardPreset,
  type ProductItemCardPriceMode,
  type ProductItemCardQuantityMode,
} from "../product-item-card.config";
import { createProductItemCardStyles } from "./ProductItemCard.styles";

export interface ProductItemCardProps {
  actionLabel?: string;
  actionMode?: ProductItemCardActionMode;
  badge?: string;
  categoryLabel?: string;
  description?: string;
  detailLabel?: string;
  favorite?: boolean;
  favoriteActionLabel?: string;
  favoriteMode?: ProductItemCardFavoriteMode;
  formattedPrice?: string;
  image?: string;
  metaMode?: ProductItemCardMetaMode;
  name: string;
  onAction?: () => void;
  onFavoriteToggle?: () => void;
  priceLabel?: string;
  preset?: ProductItemCardPreset;
  priceMode?: ProductItemCardPriceMode;
  quantityMode?: ProductItemCardQuantityMode;
  quantity?: number;
  showAction?: boolean;
  showBadge?: boolean;
  showCategory?: boolean;
  showDescription?: boolean;
  showDetail?: boolean;
  showFavorite?: boolean;
  showImage?: boolean;
  showMeta?: boolean;
  showName?: boolean;
  showPrice?: boolean;
}

export const ProductItemCard: React.FC<ProductItemCardProps> = ({
  actionLabel,
  actionMode,
  badge,
  categoryLabel,
  description,
  detailLabel,
  favorite = false,
  favoriteActionLabel,
  favoriteMode,
  formattedPrice,
  image,
  metaMode,
  name,
  onAction,
  onFavoriteToggle,
  priceLabel,
  preset = "catalogo",
  priceMode,
  quantityMode,
  quantity = 0,
  showAction,
  showBadge,
  showCategory,
  showDescription,
  showDetail,
  showFavorite,
  showImage,
  showMeta,
  showName,
  showPrice,
}) => {
  const { designSystem, hosts } = useUi();
  const NativeImage = hosts.Image;
  const styles = createProductItemCardStyles(designSystem);
  const composition = resolveProductItemCardComposition(preset, {
    actionMode,
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
    showPrice,
  });
  const showPriceSlot = composition.showPrice && composition.priceMode !== "hidden" && composition.priceMode !== "included" && Boolean(formattedPrice);
  const showActionSlot = composition.showAction && composition.actionMode !== "none" && Boolean(actionLabel) && Boolean(onAction);
  const showFavoriteSlot = composition.showFavorite && composition.favoriteMode === "toggle" && Boolean(onFavoriteToggle) && Boolean(favoriteActionLabel);
  const actionText = quantity > 0 ? String(quantity) : actionLabel;
  const meta = [
    composition.showCategory && composition.metaMode !== "detail-only" ? categoryLabel : undefined,
    composition.showDetail && composition.metaMode !== "category-only" ? detailLabel : undefined,
  ].filter(Boolean).join(" · ");

  return (
    <Surface appearance="soft" style={styles.surface}>
      {composition.showImage && image && NativeImage ? (
        <NativeImage
          accessibilityLabel={name}
          source={{ uri: image }}
          style={styles.media}
        />
      ) : null}
      <Stack style={styles.card} gap="sm">
        {composition.showBadge && badge ? <Text style={styles.badge} tone="primary" variant="caption" weight="bold">{badge}</Text> : null}
        {composition.showCategory && composition.metaMode !== "detail-only" && categoryLabel ? <Text style={styles.category} tone="primary" variant="caption" weight="bold">{categoryLabel}</Text> : null}
        {composition.showName ? <Text variant="h3">{name}</Text> : null}
        {composition.showDescription && description ? <Text tone="muted">{description}</Text> : null}
        {composition.showMeta && composition.showDetail && composition.metaMode !== "category-only" && detailLabel ? <Text style={styles.meta} variant="caption">{detailLabel}</Text> : null}
        {(showPriceSlot || showActionSlot || showFavoriteSlot) ? (
          <Stack style={styles.footer} gap="sm">
            {showPriceSlot ? (
              <Stack gap="xs">
                {priceLabel ? <Text style={styles.priceLabel} variant="caption">{priceLabel}</Text> : null}
                <Text style={styles.price} weight="bold">{formattedPrice}</Text>
              </Stack>
            ) : null}
            {showActionSlot ? <Button onAction={onAction} style={styles.action} tone="primary">{actionText}</Button> : null}
            {showFavoriteSlot ? <Button appearance="transparent" onAction={onFavoriteToggle} style={styles.favoriteAction} tone="neutral">{favoriteActionLabel}</Button> : null}
          </Stack>
        ) : null}
      </Stack>
    </Surface>
  );
};
