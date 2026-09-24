import React from "react";
import { Skeleton } from "../../../../foundation/ui/web/Skeleton";
import styles from "../ProductItemCard.module.css";

export const ProductItemCardMetaSkeleton: React.FC = () => (
  <div className={styles.skeletonMetaHeader}>
    <Skeleton shape="text" size="xs" width="sm" />
  </div>
);
