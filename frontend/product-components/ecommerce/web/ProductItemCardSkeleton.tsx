import React from "react";
import { Card } from "../../../foundation/ui/web/Card";
import type { ProductItemCardPreset } from "../product-item-card.config";
import styles from "./ProductItemCard.module.css";
import { ProductItemCardCopySkeleton } from "./ProductItemCardSkeleton/ProductItemCardCopySkeleton";
import { ProductItemCardFooterSkeleton } from "./ProductItemCardSkeleton/ProductItemCardFooterSkeleton";
import { ProductItemCardMediaSkeleton } from "./ProductItemCardSkeleton/ProductItemCardMediaSkeleton";
import { ProductItemCardMetaSkeleton } from "./ProductItemCardSkeleton/ProductItemCardMetaSkeleton";

export interface ProductItemCardSkeletonProps {
  actionPresentation?: "icon" | "label";
  preset?: ProductItemCardPreset;
  showPrice?: boolean;
}

export const ProductItemCardSkeleton: React.FC<ProductItemCardSkeletonProps> = ({
  actionPresentation = "icon",
  preset = "catalogo",
  showPrice = true,
}) => (
  <Card aria-busy="true" className={[styles.card, styles.skeletonCard].join(" ")} data-preset={preset} data-with-image="true" size="md">
    <ProductItemCardMediaSkeleton />
    <div className={styles.catalogBody}>
      <ProductItemCardMetaSkeleton />
      <ProductItemCardCopySkeleton />
      <ProductItemCardFooterSkeleton actionPresentation={actionPresentation} showPrice={showPrice} />
    </div>
  </Card>
);
