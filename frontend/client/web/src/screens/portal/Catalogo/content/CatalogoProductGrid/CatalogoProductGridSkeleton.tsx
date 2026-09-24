import React from "react";
import { ProductItemCardSkeleton } from "@royalprime/product-components/ecommerce";
import styles from "./CatalogoProductGrid.module.css";

const productSkeletonItems = Array.from({ length: 8 }, (_, index) => index);

export const CatalogoProductGridSkeleton: React.FC = () => (
  <div aria-busy="true" className={styles.productGrid}>
    {productSkeletonItems.map((index) => <ProductItemCardSkeleton key={index} preset="catalogo" />)}
  </div>
);
