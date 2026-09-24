import React from "react";
import { Stack } from "@foundation/ui/native/Layout";
import { ProductItemCard } from "@royalprime/product-components/ecommerce/native/ProductItemCard";
import type {
  ClientCheckoutProduct,
  ClientCheckoutProductCategory,
  ClientCheckoutProductExperience,
} from "../../../../../../shared-core/view-models/checkout.view-model";

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
  <Stack gap="md">
    {availableProducts.map((product) => {
      const quantity = selectedProductQuantities[product.id] || 0;
      const actionDisabled = selectedMode === "subscription" && !canAddProduct(product);
      const category = categoryById.get(product.categoryId);

      return (
        <ProductItemCard
          key={product.id}
          actionDisabled={actionDisabled}
          actionDisabledLabel={strings.productCard.limitReached}
          actionLabel={strings.productCard.add}
          actionMode="quantity"
          categoryLabel={category?.name || strings.productCard.categoryLabel}
          decreaseQuantityAriaLabel={strings.productCard.decreaseQuantity}
          description={product.description}
          detailLabel={product.weightLabel || product.unit}
          formattedPrice={selectedMode === "subscription" ? undefined : formatMoney(product.price)}
          image={product.image}
          increaseQuantityAriaLabel={strings.productCard.increaseQuantity}
          name={product.name}
          onAction={() => onProductSelect(product)}
          onDecrease={() => onDecreaseProduct(product.id)}
          preset="catalogo"
          priceLabel={strings.productCard.fromLabel}
          quantity={quantity}
          quantityMode="stepper"
          selected={quantity > 0}
          showAction
          showPrice={selectedMode !== "subscription"}
        />
      );
    })}
  </Stack>
);
