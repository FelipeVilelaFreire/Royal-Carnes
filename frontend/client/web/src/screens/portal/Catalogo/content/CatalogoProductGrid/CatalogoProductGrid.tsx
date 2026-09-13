import React, { useState } from "react";
import { ProductItemCard } from "@royalprime/product-components/ecommerce";
import type { CatalogoContentModel } from "@royalprime/client/features/catalogo";
import styles from "./CatalogoProductGrid.module.css";

interface CatalogoProductGridProps {
  addToCartLabel: string;
  addedToCartLabel: string;
  decreaseQuantityAriaLabel: string;
  approximateLabel: string;
  catalogo: CatalogoContentModel;
  favoriteAriaLabel: string;
  isDark: boolean;
  increaseQuantityAriaLabel: string;
  originLabel: string;
  pricePieceLabel: string;
  removeFavoriteAriaLabel: string;
}

const moneyFormatter = new Intl.NumberFormat("pt-BR", { currency: "BRL", style: "currency" });

export const CatalogoProductGrid: React.FC<CatalogoProductGridProps> = ({
  addToCartLabel,
  addedToCartLabel,
  decreaseQuantityAriaLabel,
  approximateLabel,
  catalogo,
  favoriteAriaLabel,
  isDark,
  increaseQuantityAriaLabel,
  originLabel,
  pricePieceLabel,
  removeFavoriteAriaLabel,
}) => {
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  return (
    <div className={styles.productGrid}>
      {catalogo.filteredProducts.map((product) => {
        const isFavorite = Boolean(favorites[product.id]);
        const quantity = cartQuantities[product.id] || 0;
        return (
          <ProductItemCard
            actionLabel={addToCartLabel}
            actionMode="quantity"
            badge={product.badge}
            badgeTone={product.badgeType}
            categoryLabel={product.line}
            description={product.subtitle}
            detailLabel={product.origin ? `${approximateLabel} ${product.weight} | ${originLabel}: ${product.origin}` : `${approximateLabel} ${product.weight}`}
            decreaseQuantityAriaLabel={decreaseQuantityAriaLabel}
            favorite={isFavorite}
            favoriteAriaLabel={favoriteAriaLabel}
            formatPrice={moneyFormatter.format}
            image={product.image}
            isDark={isDark}
            increaseQuantityAriaLabel={increaseQuantityAriaLabel}
            key={product.id}
            name={product.name}
            onAction={() => setCartQuantities((current) => ({ ...current, [product.id]: (current[product.id] || 0) + 1 }))}
            onDecrease={() => setCartQuantities((current) => ({ ...current, [product.id]: Math.max((current[product.id] || 0) - 1, 0) }))}
            onFavoriteToggle={() => setFavorites((current) => ({ ...current, [product.id]: !current[product.id] }))}
            originalPrice={product.originalPrice}
            preset="catalogo"
            price={product.price}
            priceLabel={pricePieceLabel}
            removeFavoriteAriaLabel={removeFavoriteAriaLabel}
            quantity={quantity}
            quantityMode="stepper"
            selectedActionLabel={addedToCartLabel}
            showAction
          />
        );
      })}
    </div>
  );
};
