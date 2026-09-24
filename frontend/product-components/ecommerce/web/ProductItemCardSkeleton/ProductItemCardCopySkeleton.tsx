import React from "react";
import { Skeleton } from "../../../../foundation/ui/web/Skeleton";
import styles from "../ProductItemCard.module.css";

export const ProductItemCardCopySkeleton: React.FC = () => (
  <div className={styles.skeletonCopy}>
    <Skeleton className={styles.skeletonTitle} shape="text" size="lg" width="lg" />
    <Skeleton className={styles.skeletonDescription} shape="text" size="sm" width="md" />
    <Skeleton className={styles.skeletonDetail} shape="text" size="xs" width="xs" />
  </div>
);
