import React from "react";
import { Button } from "../../../../foundation/ui/web/Button";
import { CartIcon, MinusIcon, PlusIcon } from "../../../../foundation/ui/web/Icon/AppIcons";
import styles from "../ProductItemCard.module.css";

interface ProductItemCardCatalogFooterProps {
  actionDisabled: boolean;
  actionPresentation: "icon" | "label";
  actionText?: string;
  canShowAction: boolean;
  canUseStepper: boolean;
  decreaseQuantityAriaLabel?: string;
  formatPriceValue: (value: number) => string;
  hasPrice: boolean;
  increaseQuantityAriaLabel?: string;
  onAction?: () => void;
  onDecrease?: () => void;
  originalPrice?: number;
  price?: number;
  priceLabel?: string;
  quantity: number;
  showOriginalPrice: boolean;
}

export const ProductItemCardCatalogFooter: React.FC<ProductItemCardCatalogFooterProps> = ({
  actionDisabled,
  actionPresentation,
  actionText,
  canShowAction,
  canUseStepper,
  decreaseQuantityAriaLabel,
  formatPriceValue,
  hasPrice,
  increaseQuantityAriaLabel,
  onAction,
  onDecrease,
  originalPrice,
  price,
  priceLabel,
  quantity,
  showOriginalPrice,
}) => {
  if (!hasPrice && !canShowAction) return null;

  return (
    <div className={styles.catalogFooter}>
      {hasPrice && typeof price === "number" ? (
        <div className={styles.priceBlock}>
          {priceLabel ? <span className={styles.priceLabel}>{priceLabel}</span> : null}
          {showOriginalPrice && typeof originalPrice === "number" ? <span className={styles.originalPrice}>{formatPriceValue(originalPrice)}</span> : null}
          <strong className={styles.price}>{formatPriceValue(price)}</strong>
        </div>
      ) : null}
      {canShowAction ? (
        <div className={styles.catalogAction} data-expanded={canUseStepper && quantity > 0 || undefined} data-presentation={actionPresentation}>
          <Button aria-label={actionText} appearance="solid" className={styles.catalogCartButton} disabled={actionDisabled} icon={<CartIcon />} iconPosition={actionPresentation === "label" ? "start" : "only"} onClick={onAction} size="sm" tone="primary" type="button">
            {actionPresentation === "label" ? actionText : null}
          </Button>
          {canUseStepper ? (
            <div className={styles.catalogQuantityControl} role="group">
              <button aria-label={decreaseQuantityAriaLabel} className={styles.catalogQuantityButton} onClick={onDecrease} type="button"><MinusIcon aria-hidden="true" size={14} /></button>
              <span className={styles.catalogQuantityValue}>{quantity}</span>
              <button aria-label={increaseQuantityAriaLabel} className={styles.catalogQuantityButton} disabled={actionDisabled} onClick={onAction} type="button"><PlusIcon aria-hidden="true" size={14} /></button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
