import React from "react";
import { Stack } from "@foundation/ui/web/Layout";
import type { CatalogoContentModel } from "@royalprime/client/features/catalogo";
import { CatalogoCategoryRail } from "../CatalogoCategoryRail/CatalogoCategoryRail";
import { CatalogoFeedback } from "../CatalogoFeedback/CatalogoFeedback";
import { CatalogoProductGrid } from "../CatalogoProductGrid/CatalogoProductGrid";
import { CatalogoToolbar } from "../CatalogoToolbar/CatalogoToolbar";
import styles from "./CatalogoContent.module.css";

interface CatalogoContentProps {
  catalogo: CatalogoContentModel;
  isDark: boolean;
  productCardStrings: { addFavorite: string; removeFavorite: string };
  strings: {
    categoryNavigationLabel: string;
    approximateLabel: string;
    addToCart: string;
    addedToCart: string;
    decreaseQuantity: string;
    clearFilters: string;
    emptyDescription: string;
    emptyTitle: string;
    errorDescription: string;
    errorTitle: string;
    loadingDescription: string;
    loadingTitle: string;
    increaseQuantity: string;
    originLabel: string;
    pricePieceLabel: string;
    resultPrefix: string;
    resultSuffix: string;
    retry: string;
    searchAriaLabel: string;
    searchPlaceholder: string;
    sortAriaLabel: string;
    sortLabel: string;
  };
}

export const CatalogoContent: React.FC<CatalogoContentProps> = ({ catalogo, isDark, productCardStrings, strings }) => (
  <Stack className={styles.content} gap="lg">
    <CatalogoCategoryRail
      catalogo={catalogo}
      navigationLabel={strings.categoryNavigationLabel}
    />
    <CatalogoToolbar catalogo={catalogo} strings={strings} />
    {catalogo.isLoading || catalogo.error || !catalogo.filteredProducts.length ? (
      <CatalogoFeedback catalogo={catalogo} strings={strings} />
    ) : (
      <CatalogoProductGrid
        catalogo={catalogo}
        favoriteAriaLabel={productCardStrings.addFavorite}
        isDark={isDark}
        approximateLabel={strings.approximateLabel}
        addToCartLabel={strings.addToCart}
        addedToCartLabel={strings.addedToCart}
        decreaseQuantityAriaLabel={strings.decreaseQuantity}
        increaseQuantityAriaLabel={strings.increaseQuantity}
        originLabel={strings.originLabel}
        pricePieceLabel={strings.pricePieceLabel}
        removeFavoriteAriaLabel={productCardStrings.removeFavorite}
      />
    )}
  </Stack>
);
