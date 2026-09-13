import React, { useState } from "react";
import { Stack } from "@foundation/ui/native/Layout";
import { ProductItemCard } from "@royalprime/product-components/ecommerce/native/ProductItemCard";
import type { CatalogoContentModel } from "@royalprime/client/features/catalogo";
import { catalogoProductFeedTokens } from "./styles";

interface CatalogoProductFeedProps {
  actionLabel: string;
  catalogo: CatalogoContentModel;
  favoriteAriaLabel: string;
  onProductAction?: (productId: string) => void;
  removeFavoriteAriaLabel: string;
  strings: {
    approximateLabel: string;
    originLabel: string;
    pricePieceLabel: string;
  };
}

const moneyFormatter = new Intl.NumberFormat("pt-BR", { currency: "BRL", style: "currency" });

export const CatalogoProductFeed: React.FC<CatalogoProductFeedProps> = ({
  actionLabel,
  catalogo,
  favoriteAriaLabel,
  onProductAction,
  removeFavoriteAriaLabel,
  strings,
}) => {
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  return (
  <Stack gap={catalogoProductFeedTokens.gap}>
    {catalogo.filteredProducts.map((product) => {
      const favorite = Boolean(favorites[product.id]);
      const quantity = cartQuantities[product.id] || 0;
      return (
      <ProductItemCard
        actionLabel={quantity > 0 ? String(quantity) : actionLabel}
        actionMode="quantity"
        badge={product.badge}
        categoryLabel={product.line}
        description={product.subtitle}
        favorite={favorite}
        favoriteActionLabel={favorite ? removeFavoriteAriaLabel : favoriteAriaLabel}
        detailLabel={product.origin ? `${product.weight} · ${product.origin}` : product.weight}
        formattedPrice={moneyFormatter.format(product.price)}
        image={product.image}
        key={product.id}
        name={product.name}
        onAction={() => {
          setCartQuantities((current) => ({ ...current, [product.id]: (current[product.id] || 0) + 1 }));
          onProductAction?.(product.id);
        }}
        onFavoriteToggle={() => setFavorites((current) => ({ ...current, [product.id]: !current[product.id] }))}
        preset="catalogo"
        priceLabel={strings.pricePieceLabel}
        quantity={quantity}
        showAction
      />
      );
    })}
  </Stack>
  );
};
