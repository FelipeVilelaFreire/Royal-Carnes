import React from "react";
import { ProductItemCardCatalogCopy } from "./ProductItemCardCatalogCopy";
import { ProductItemCardCatalogFooter } from "./ProductItemCardCatalogFooter";
import { ProductItemCardCatalogMeta } from "./ProductItemCardCatalogMeta";
import styles from "../ProductItemCard.module.css";

interface ProductItemCardCatalogContentProps extends React.ComponentProps<typeof ProductItemCardCatalogFooter> {
  badge?: string;
  badgeTone: "offer" | "limited";
  categoryLabel: string;
  description: string;
  detailMetaLabel?: string;
  headerDetail?: string;
  name: string;
  showBadge: boolean;
  showCategory: boolean;
  showDescription: boolean;
  showImage: boolean;
  showName: boolean;
}

export const ProductItemCardCatalogContent: React.FC<ProductItemCardCatalogContentProps> = ({
  badge,
  badgeTone,
  categoryLabel,
  description,
  detailMetaLabel,
  headerDetail,
  name,
  showBadge,
  showCategory,
  showDescription,
  showImage,
  showName,
  ...footerProps
}) => (
  <div className={styles.catalogBody}>
    <ProductItemCardCatalogMeta badge={badge} badgeTone={badgeTone} categoryLabel={categoryLabel} headerDetail={headerDetail} showBadge={showBadge} showCategory={showCategory} showImage={showImage} />
    <ProductItemCardCatalogCopy description={description} detailMetaLabel={detailMetaLabel} name={name} showDescription={showDescription} showName={showName} />
    <ProductItemCardCatalogFooter {...footerProps} />
  </div>
);
