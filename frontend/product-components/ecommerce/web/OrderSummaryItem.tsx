"use client";

import React from "react";
import { Button } from "../../../foundation/ui/web/Button";
import { FlameIcon, MinusIcon, PlusIcon } from "../../../foundation/ui/web/Icon/AppIcons";
import { Text } from "../../../foundation/ui/web/Text";
import styles from "./OrderSummaryItem.module.css";

export interface OrderSummaryItemProps {
  detail: string;
  image?: string;
  name: string;
  priceLabel?: string;
  quantityControl?: {
    decrementAriaLabel: string;
    incrementAriaLabel: string;
    onDecrement: () => void;
    onIncrement: () => void;
    valueLabel: string;
  };
  secondaryAction?: {
    ariaLabel?: string;
    label: string;
    onClick: () => void;
  };
}

export const OrderSummaryItem: React.FC<OrderSummaryItemProps> = ({
  detail,
  image,
  name,
  priceLabel,
  quantityControl,
  secondaryAction,
}) => {
  const [isMediaUnavailable, setIsMediaUnavailable] = React.useState(false);
  const hasImage = Boolean(image) && !isMediaUnavailable;

  return (
    <article className={styles.item}>
      <div aria-hidden="true" className={styles.media}>
        {hasImage ? (
          <img alt="" className={styles.image} src={image} onError={() => setIsMediaUnavailable(true)} />
        ) : (
          <FlameIcon size={16} />
        )}
      </div>
      <div className={styles.content}>
        <Text as="h3" className={styles.name} tone="inherit" variant="body" weight="semibold">
          {name}
        </Text>
        <Text as="span" className={styles.detail} tone="inherit" variant="caption">
          {detail}
        </Text>
      </div>
      {priceLabel || quantityControl || secondaryAction ? (
        <div className={styles.trailing}>
          {priceLabel ? (
            <Text as="span" className={styles.price} tone="inherit" variant="caption" weight="semibold">
              {priceLabel}
            </Text>
          ) : null}
          {quantityControl ? (
            <div className={styles.quantityControl}>
              <Button
                aria-label={quantityControl.decrementAriaLabel}
                appearance="outline"
                className={styles.quantityButton}
                icon={<MinusIcon size={14} />}
                iconPosition="only"
                onClick={quantityControl.onDecrement}
                size="sm"
                tone="neutral"
                type="button"
              />
              <Text as="span" className={styles.quantityValue} tone="inherit" variant="caption" weight="semibold">
                {quantityControl.valueLabel}
              </Text>
              <Button
                aria-label={quantityControl.incrementAriaLabel}
                appearance="outline"
                className={styles.quantityButton}
                icon={<PlusIcon size={14} />}
                iconPosition="only"
                onClick={quantityControl.onIncrement}
                size="sm"
                tone="neutral"
                type="button"
              />
            </div>
          ) : null}
          {secondaryAction ? (
            <Button
              aria-label={secondaryAction.ariaLabel}
              appearance="transparent"
              className={styles.secondaryAction}
              size="sm"
              tone="neutral"
              type="button"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
};
