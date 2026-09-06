import React, { useMemo, useState } from "react";
import { Button } from "../../../ui/Button";
import { DropdownPicker } from "../../../ui/DropdownPicker";
import { Input } from "../../../ui/Input";
import { Container, Stack } from "../../../ui/Layout";
import { Text } from "../../../ui/Text";
import { ProductItemCard } from "../../../product-components/ecommerce/ProductItemCard";
import { createCortesModel, type CortesModelInput } from "./cortes.model";
import type { CortesCatalogSortKey } from "../../../../../shared-core/view-models/cortes-catalog.view-model";

export interface CortesViewProps extends CortesModelInput {
  onProductAction?: (productId: string) => void;
}

export const CortesView: React.FC<CortesViewProps> = ({ onProductAction, ...input }) => {
  const [activeCategoryId, setActiveCategoryId] = useState(input.activeCategoryId || "all");
  const [searchQuery, setSearchQuery] = useState(input.searchQuery || "");
  const [sortBy, setSortBy] = useState<CortesCatalogSortKey>(input.sortBy || "relevance");
  const model = createCortesModel({ ...input, activeCategoryId, searchQuery, sortBy });
  const firstProducts = model.catalog.filteredProducts.slice(0, 6);
  const sortOptions = useMemo(
    () => [
      { value: "relevance", label: model.strings.sortOptions.relevance },
      { value: "best_sellers", label: model.strings.sortOptions.bestSellers },
      { value: "price_asc", label: model.strings.sortOptions.priceAsc },
      { value: "price_desc", label: model.strings.sortOptions.priceDesc },
    ],
    [model.strings.sortOptions.bestSellers, model.strings.sortOptions.priceAsc, model.strings.sortOptions.priceDesc, model.strings.sortOptions.relevance],
  );

  return (
    <Container>
      <Stack>
        <Text variant="h1">{model.strings.title}</Text>
        <Text tone="muted">{model.strings.description}</Text>
        <Input
          accessibilityLabel={model.strings.searchAriaLabel}
          iconIntent="search"
          onChangeText={setSearchQuery}
          placeholder={model.strings.searchPlaceholder}
          value={searchQuery}
        />
        <DropdownPicker
          accessibilityLabel={model.strings.sortAriaLabel}
          onChange={(next) => setSortBy(next as CortesCatalogSortKey)}
          options={sortOptions}
          value={sortBy}
        />
        <Stack>
          {model.catalog.categories.map((category) => (
            <Button
              key={category.id}
              onAction={() => setActiveCategoryId(category.id)}
              tone={category.id === activeCategoryId ? "primary" : "neutral"}
            >
              {category.name}
            </Button>
          ))}
        </Stack>
        {firstProducts.map((product) => (
          <ProductItemCard
            key={product.id}
            name={product.name}
            description={product.subtitle}
            image={product.image}
            onAction={() => onProductAction?.(product.id)}
          />
        ))}
        {firstProducts.length === 0 ? (
          <Button onAction={() => undefined}>{model.strings.clearFilters}</Button>
        ) : null}
      </Stack>
    </Container>
  );
};
