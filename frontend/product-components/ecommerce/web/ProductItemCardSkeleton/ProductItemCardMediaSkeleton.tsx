import React from "react";
import { Skeleton } from "../../../../foundation/ui/web/Skeleton";
import styles from "../ProductItemCard.module.css";

export const ProductItemCardMediaSkeleton: React.FC = () => (
  <div className={[styles.media, styles.skeletonMedia].join(" ")}>
    <Skeleton className={styles.skeletonMediaFill} shape="block" size="xl" />
  </div>
);
