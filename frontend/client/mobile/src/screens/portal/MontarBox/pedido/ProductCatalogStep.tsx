import React from "react";
import { Button } from "@foundation/native/client-ui/Button";
import { Input } from "@foundation/native/client-ui/Input";
import { Stack } from "@foundation/native/client-ui/Layout";
import { Surface } from "@foundation/native/client-ui/Surface";
import { Text } from "@foundation/native/client-ui/Text";
import { ProductItemCard } from "@royalprime/product-components/ecommerce/native/ProductItemCard";
import type {
  ClientCheckoutProduct,
  ClientCheckoutProductCategory,
  ClientCheckoutProductExperience,
} from "../../../../../../shared-core/view-models/checkout.view-model";
import { createPedidoStyles } from "./styles";

export interface ProductCatalogStepProps {
  availableProducts: ClientCheckoutProduct[];
  canAddProduct: (product: ClientCheckoutProduct) => boolean;
  categories: ClientCheckoutProductCategory[];
  categoryById: Map<string, ClientCheckoutProductCategory>;
  formatMoney: (value: number) => string;
  onClearFilters: () => void;
  onProductSelect: (product: ClientCheckoutProduct) => void;
  onQueryChange: (value: string) => void;
  onSelectCategory: (categoryId: string) => void;
  query: string;
  selectedCategoryId: string;
  selectedMode: ClientCheckoutProductExperience | null;
  selectedProductQuantities: Record<string, number>;
  strings: any;
  tokens: any;
}

export const ProductCatalogStep: React.FC<ProductCatalogStepProps> = ({
  availableProducts,
  canAddProduct,
  categories,
  categoryById,
  formatMoney,
  onClearFilters,
  onProductSelect,
  onQueryChange,
  onSelectCategory,
  query,
  selectedCategoryId,
  selectedMode,
  selectedProductQuantities,
  strings,
  tokens,
}) => {
  const styles = createPedidoStyles(tokens);

  return (
    <Surface style={styles.panel}>
      <Stack style={styles.stack}>
        <Text style={styles.title} variant="h2">{strings.catalog.title}</Text>
        <Text style={styles.muted}>{strings.catalog.subtitle}</Text>
        <Input onChangeText={onQueryChange} placeholder={strings.hero.searchPlaceholder} value={query} />
        <Stack style={styles.compactStack}>
          {categories.map((category) => (
            <Button
              appearance={category.id === selectedCategoryId ? "soft" : "transparent"}
              key={category.id}
              onAction={() => onSelectCategory(category.id)}
              style={{ ...styles.option, ...(category.id === selectedCategoryId ? styles.optionActive : {}) }}
              tone={category.id === selectedCategoryId ? "primary" : "neutral"}
            >
              {category.name}
            </Button>
          ))}
        </Stack>
        {availableProducts.slice(0, 8).map((product) => {
          const category = categoryById.get(product.categoryId);
          const canAdd = canAddProduct(product);

          return (
            <ProductItemCard
              key={product.id}
              actionLabel={canAdd ? strings.productCard.add : strings.productCard.limitReached}
              description={`${product.description} ${category?.name || strings.productCard.categoryLabel}`}
              formattedPrice={selectedMode === "subscription" ? undefined : formatMoney(product.price)}
              name={product.name}
              onAction={canAdd ? () => onProductSelect(product) : undefined}
            />
          );
        })}
        {availableProducts.length === 0 ? (
          <Button onAction={onClearFilters}>{strings.hero.clearFilters}</Button>
        ) : null}
      </Stack>
    </Surface>
  );
};
