import React from "react";
import { ButtonSkeleton } from "../../../../foundation/ui/web/Button";
import { Skeleton } from "../../../../foundation/ui/web/Skeleton";
import styles from "../ProductItemCard.module.css";

interface ProductItemCardFooterSkeletonProps {
  actionPresentation: "icon" | "label";
  showPrice: boolean;
}

export const ProductItemCardFooterSkeleton: React.FC<ProductItemCardFooterSkeletonProps> = ({
  actionPresentation,
  showPrice,
}) => (
  <div className={styles.skeletonFooter} data-action-presentation={actionPresentation} data-with-price={showPrice ? "true" : "false"}>
    {showPrice ? (
      <div className={styles.skeletonPrice}>
        <Skeleton className={styles.skeletonPriceLabel} shape="text" size="xs" width="xs" />
        <Skeleton className={styles.skeletonPriceValue} shape="text" size="lg" width="sm" />
      </div>
    ) : null}
    <ButtonSkeleton className={styles.skeletonAction} size="md" width="md" />
  </div>
);
