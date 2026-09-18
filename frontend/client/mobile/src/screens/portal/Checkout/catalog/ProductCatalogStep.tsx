import React from "react";
import { Button } from "@foundation/ui/native/Button";
import { Input } from "@foundation/ui/native/Input";
import { Stack } from "@foundation/ui/native/Layout";
import { Modal } from "@foundation/ui/native/Modal";
import { Surface } from "@foundation/ui/native/Surface";
import { Text } from "@foundation/ui/native/Text";
import type {
  ClientCheckoutProduct,
  ClientCheckoutProductCategory,
  ClientCheckoutProductExperience,
} from "../../../../../../shared-core/view-models/checkout.view-model";
import { createCheckoutStyles } from "../checkout.styles";
import { CheckoutProductGrid } from "./CheckoutProductGrid";

export interface ProductCatalogStepProps {
  availableProducts: ClientCheckoutProduct[];
  canAddProduct: (product: ClientCheckoutProduct) => boolean;
  categories: ClientCheckoutProductCategory[];
  categoryById: Map<string, ClientCheckoutProductCategory>;
  formatMoney: (value: number) => string;
  onClearFilters: () => void;
  onDecreaseProduct: (productId: string) => void;
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
  onDecreaseProduct,
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
  const styles = createCheckoutStyles(tokens);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [draftCategoryId, setDraftCategoryId] = React.useState(selectedCategoryId);

  return (
    <Surface style={styles.panel}>
      <Stack style={styles.stack}>
        <Input onChangeText={onQueryChange} placeholder={strings.hero.searchPlaceholder} value={query} />
        <Button
          appearance="outline"
          onAction={() => {
            setDraftCategoryId(selectedCategoryId);
            setFilterOpen(true);
          }}
          tone="neutral"
        >
          {strings.hero.filterLabel}
        </Button>
        {availableProducts.length ? (
          <CheckoutProductGrid
            availableProducts={availableProducts}
            canAddProduct={canAddProduct}
            categoryById={categoryById}
            formatMoney={formatMoney}
            onDecreaseProduct={onDecreaseProduct}
            onProductSelect={onProductSelect}
            selectedMode={selectedMode}
            selectedProductQuantities={selectedProductQuantities}
            strings={strings}
          />
        ) : null}
        {availableProducts.length === 0 ? (
          <Button onAction={onClearFilters}>{strings.hero.clearFilters}</Button>
        ) : null}
      </Stack>
      <Modal
        closeLabel={strings.filters.close}
        onClose={() => setFilterOpen(false)}
        open={filterOpen}
        title={strings.filters.modalTitle}
      >
        <Stack gap="sm">
          <Text style={styles.muted} variant="caption">{strings.filters.categoryTitle}</Text>
          {[{ id: "all", name: strings.filters.allCategories }, ...categories].map((category) => (
            <Button
              appearance={draftCategoryId === category.id ? "soft" : "transparent"}
              key={category.id}
              onAction={() => setDraftCategoryId(category.id)}
              tone={draftCategoryId === category.id ? "primary" : "neutral"}
            >
              {category.name}
            </Button>
          ))}
          <Button
            onAction={() => {
              onSelectCategory(draftCategoryId);
              setFilterOpen(false);
            }}
            tone="primary"
          >
            {strings.filters.apply}
          </Button>
        </Stack>
      </Modal>
    </Surface>
  );
};
