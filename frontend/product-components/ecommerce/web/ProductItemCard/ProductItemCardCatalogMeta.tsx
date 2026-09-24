import React from "react";
import styles from "../ProductItemCard.module.css";

interface ProductItemCardCatalogMetaProps {
  badge?: string;
  badgeTone: "offer" | "limited";
  categoryLabel: string;
  headerDetail?: string;
  showBadge: boolean;
  showCategory: boolean;
  showImage: boolean;
}

export const ProductItemCardCatalogMeta: React.FC<ProductItemCardCatalogMetaProps> = ({
  badge,
  badgeTone,
  categoryLabel,
  headerDetail,
  showBadge,
  showCategory,
  showImage,
}) => (
  <>
    {showBadge && badge && !showImage ? <span className={[styles.badge, styles.badgeInline].join(" ")} data-tone={badgeTone}>{badge}</span> : null}
    {showCategory || headerDetail ? (
      <div className={styles.catalogMetaHeader}>
        {showCategory ? <span className={styles.catalogCategory}>{categoryLabel}</span> : <span />}
        {headerDetail ? <span className={styles.catalogHeaderDetail}>{headerDetail}</span> : null}
      </div>
    ) : null}
  </>
);
