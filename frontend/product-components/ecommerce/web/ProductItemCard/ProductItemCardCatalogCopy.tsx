import React from "react";
import { Text } from "../../../../foundation/ui/web/Text";
import styles from "../ProductItemCard.module.css";

interface ProductItemCardCatalogCopyProps {
  description: string;
  detailMetaLabel?: string;
  name: string;
  showDescription: boolean;
  showName: boolean;
}

export const ProductItemCardCatalogCopy: React.FC<ProductItemCardCatalogCopyProps> = ({
  description,
  detailMetaLabel,
  name,
  showDescription,
  showName,
}) => (
  <>
    {showName ? <Text as="h3" className={styles.catalogTitle} tone="inherit" variant="h3">{name}</Text> : null}
    {showDescription && description ? <Text className={styles.catalogDescription} tone="inherit" variant="caption">{description}</Text> : null}
    {detailMetaLabel ? <span className={styles.catalogMeta}>{detailMetaLabel}</span> : null}
  </>
);
