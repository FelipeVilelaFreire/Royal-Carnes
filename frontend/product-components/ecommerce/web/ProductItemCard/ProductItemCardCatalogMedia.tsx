import React from "react";
import { Button } from "../../../../foundation/ui/web/Button";
import { FlameIcon, HeartIcon } from "../../../../foundation/ui/web/Icon/AppIcons";
import styles from "../ProductItemCard.module.css";

interface ProductItemCardCatalogMediaProps {
  badge?: string;
  badgeTone: "offer" | "limited";
  canToggleFavorite: boolean;
  favorite: boolean;
  favoriteAriaLabel?: string;
  image: string;
  isCardDisabled: boolean;
  isMediaUnavailable: boolean;
  onFavoriteToggle?: () => void;
  onImageUnavailable: () => void;
  removeFavoriteAriaLabel?: string;
  showBadge: boolean;
}

export const ProductItemCardCatalogMedia: React.FC<ProductItemCardCatalogMediaProps> = ({
  badge,
  badgeTone,
  canToggleFavorite,
  favorite,
  favoriteAriaLabel,
  image,
  isCardDisabled,
  isMediaUnavailable,
  onFavoriteToggle,
  onImageUnavailable,
  removeFavoriteAriaLabel,
  showBadge,
}) => (
  <div className={styles.media}>
    {image && !isMediaUnavailable ? (
      <img className={styles.mediaImage} src={image} alt="" aria-hidden="true" onError={onImageUnavailable} />
    ) : (
      <div className={styles.mediaFallback} aria-hidden="true"><FlameIcon size={28} /></div>
    )}
    {isCardDisabled ? <span className={styles.mediaScrim} aria-hidden="true" /> : null}
    {showBadge && badge ? <span className={styles.badge} data-tone={badgeTone}>{badge}</span> : null}
    {canToggleFavorite ? (
      <Button
        aria-label={favorite ? removeFavoriteAriaLabel : favoriteAriaLabel}
        appearance="soft"
        className={[styles.favoriteButton, favorite ? styles.favoriteActive : undefined].filter(Boolean).join(" ")}
        icon={<HeartIcon fill={favorite ? "currentColor" : "none"} size={14} />}
        iconPosition="only"
        onClick={onFavoriteToggle}
        size="sm"
        tone="neutral"
        type="button"
      />
    ) : null}
  </div>
);
