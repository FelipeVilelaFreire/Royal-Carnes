import React from "react";
import { ProductItemCard, ProductItemCardSkeleton } from "@royalprime/product-components/ecommerce";
import type {
  ClientCheckoutProduct,
  ClientCheckoutProductCategory,
  ClientCheckoutProductExperience,
} from "@/view-models/checkout.view-model";
import styles from "./CheckoutProductGrid.module.css";

interface CheckoutProductGridProps {
  availableProducts: ClientCheckoutProduct[];
  canAddProduct: (product: ClientCheckoutProduct) => boolean;
  categoryById: Map<string, ClientCheckoutProductCategory>;
  formatMoney: (value: number) => string;
  onDecreaseProduct: (productId: string) => void;
  onProductSelect: (product: ClientCheckoutProduct) => void;
  selectedMode: ClientCheckoutProductExperience | null;
  selectedProductQuantities: Record<string, number>;
  strings: any;
}

const productSkeletonItems = Array.from({ length: 6 }, (_, index) => index);

export const CheckoutProductGridSkeleton: React.FC<Pick<CheckoutProductGridProps, "selectedMode">> = ({ selectedMode }) => (
  <div aria-busy="true" className={styles.productGrid}>
    {productSkeletonItems.map((index) => (
      <ProductItemCardSkeleton
        key={index}
        preset="catalogo"
        showPrice={selectedMode !== "subscription"}
      />
    ))}
  </div>
);

/**
 * Checkout owns the product-selection rules; the visual product anatomy stays
 * entirely in the shared ecommerce ProductItemCard, just like Catalogo.
 */
export const CheckoutProductGrid: React.FC<CheckoutProductGridProps> = ({
  availableProducts,
  canAddProduct,
  categoryById,
  formatMoney,
  onDecreaseProduct,
  onProductSelect,
  selectedMode,
  selectedProductQuantities,
  strings,
}) => (
  <div className={styles.productGrid}>
    {availableProducts.map((product) => {
      const category = categoryById.get(product.categoryId);
      const quantity = selectedProductQuantities[product.id] || 0;
      const actionDisabled = selectedMode === "subscription" && !canAddProduct(product);

      return (
        <ProductItemCard
          key={product.id}
          actionDisabled={actionDisabled}
          actionDisabledLabel={strings.productCard.limitReached}
          actionLabel={strings.productCard.add}
          actionMode="quantity"
          actionPresentation="label"
          categoryLabel={category?.name || strings.productCard.categoryLabel}
          decreaseQuantityAriaLabel={strings.productCard.decreaseQuantity}
          description={product.description}
          detailLabel={product.weightLabel || product.unit}
          disabledHint={strings.productCard.limitReachedHint}
          formatPrice={formatMoney}
          image={product.image}
          increaseQuantityAriaLabel={strings.productCard.increaseQuantity}
          name={product.name}
          onAction={() => onProductSelect(product)}
          onDecrease={() => onDecreaseProduct(product.id)}
          preset="catalogo"
          price={product.price}
          priceLabel={strings.productCard.fromLabel}
          quantity={quantity}
          quantityMode="stepper"
          selected={quantity > 0}
          selectedActionLabel={strings.productCard.add}
          showAction
          showOriginalPrice={false}
          showPrice={selectedMode !== "subscription"}
        />
      );
    })}
  </div>
);
