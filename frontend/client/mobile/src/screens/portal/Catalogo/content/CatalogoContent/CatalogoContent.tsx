import React from "react";
import { Stack } from "@foundation/ui/native/Layout";
import type { CatalogoContentModel } from "@royalprime/client/features/catalogo";
import { CatalogoCategoryRail } from "../CatalogoCategoryRail/CatalogoCategoryRail";
import { CatalogoFeedback } from "../CatalogoFeedback/CatalogoFeedback";
import { CatalogoToolbar } from "../CatalogoToolbar/CatalogoToolbar";
import { CatalogoProductFeed } from "../CatalogoProductFeed/CatalogoProductFeed";
import { catalogoContentTokens } from "./styles";

interface CatalogoContentProps {
  actionLabel: string;
  catalogo: CatalogoContentModel;
  onProductAction?: (productId: string) => void;
  productCardStrings: {
    addFavorite: string;
    removeFavorite: string;
  };
  strings: {
    approximateLabel: string;
    addToCart: string;
    clearFilters: string;
    emptyDescription: string;
    emptyTitle: string;
    errorDescription: string;
    errorTitle: string;
    loadingDescription: string;
    loadingTitle: string;
    originLabel: string;
    pricePieceLabel: string;
    retry: string;
    resultPrefix: string;
    resultSuffix: string;
    searchAriaLabel: string;
    searchPlaceholder: string;
    sortAriaLabel: string;
    sortLabel: string;
  };
}

export const CatalogoContent: React.FC<CatalogoContentProps> = ({ actionLabel, catalogo, onProductAction, productCardStrings, strings }) => (
  <Stack gap={catalogoContentTokens.gap}>
    <CatalogoCategoryRail catalogo={catalogo} />
    <CatalogoToolbar catalogo={catalogo} strings={strings} />
    {catalogo.isLoading || catalogo.error || !catalogo.filteredProducts.length ? (
      <CatalogoFeedback catalogo={catalogo} strings={strings} />
    ) : (
      <CatalogoProductFeed
        actionLabel={actionLabel}
        catalogo={catalogo}
        favoriteAriaLabel={productCardStrings.addFavorite}
        onProductAction={onProductAction}
        removeFavoriteAriaLabel={productCardStrings.removeFavorite}
        strings={strings}
      />
    )}
  </Stack>
);
