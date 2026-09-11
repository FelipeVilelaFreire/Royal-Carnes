import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@foundation/native/client-ui/Button";
import { DropdownPicker } from "@foundation/native/client-ui/DropdownPicker";
import { Input } from "@foundation/native/client-ui/Input";
import { Container, Inline, Stack } from "@foundation/native/client-ui/Layout";
import { Surface } from "@foundation/native/client-ui/Surface";
import { Text } from "@foundation/native/client-ui/Text";
import { ProductItemCard } from "@royalprime/product-components/ecommerce/native/ProductItemCard";
import { useClientApiConfig } from "../../../../../shared-core/runtime/ClientApiProvider";
import { useClientCatalog } from "../../../../../shared-core/hooks/useClientCatalog";
import type { useClientStrings } from "../../../../../shared-core/hooks/useClientStrings";
import { createCortesCatalogViewModel } from "../../../../../shared-core/view-models/cortes-catalog.view-model";
import type { CortesCatalogSortKey } from "../../../../../shared-core/view-models/cortes-catalog.view-model";

export interface CortesViewProps {
  onProductAction?: (productId: string) => void;
  strings: ReturnType<typeof useClientStrings>;
}

const moneyFormatter = new Intl.NumberFormat("pt-BR", { currency: "BRL", style: "currency" });

export const CortesView: React.FC<CortesViewProps> = ({ onProductAction, strings: clientStrings }) => {
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<CortesCatalogSortKey>("relevance");
  const apiConfig = useClientApiConfig();
  const catalog = useClientCatalog({ apiConfig });
  const strings = clientStrings.cortes.catalogPage;
  const catalogViewModel = useMemo(
    () => createCortesCatalogViewModel({
      activeCategoryId,
      allCategoriesLabel: strings.allCategoriesLabel,
      apiProducts: catalog.snapshot.products,
      defaultLineLabel: strings.defaultLineLabel,
      searchQuery,
      sortBy,
    }),
    [activeCategoryId, catalog.snapshot.products, searchQuery, sortBy, strings.allCategoriesLabel, strings.defaultLineLabel],
  );

  useEffect(() => {
    void catalog.load().catch(() => undefined);
  }, [catalog.load]);

  const sortOptions = useMemo(
    () => [
      { value: "relevance", label: strings.sortOptions.relevance },
      { value: "best_sellers", label: strings.sortOptions.bestSellers },
      { value: "price_asc", label: strings.sortOptions.priceAsc },
      { value: "price_desc", label: strings.sortOptions.priceDesc },
    ],
    [strings.sortOptions.bestSellers, strings.sortOptions.priceAsc, strings.sortOptions.priceDesc, strings.sortOptions.relevance],
  );

  return (
    <Container>
      <Stack gap="lg">
        <Text variant="h1">{strings.title}</Text>
        <Text tone="muted">{strings.description}</Text>
        <Input
          accessibilityLabel={strings.searchAriaLabel}
          iconIntent="search"
          onChangeText={setSearchQuery}
          placeholder={strings.searchPlaceholder}
          value={searchQuery}
        />
        <DropdownPicker
          accessibilityLabel={strings.sortAriaLabel}
          onChange={(next) => setSortBy(next as CortesCatalogSortKey)}
          options={sortOptions}
          value={sortBy}
        />
        <Inline gap="xs">
          {catalogViewModel.categories.map((category) => (
            <Button
              key={category.id}
              onAction={() => setActiveCategoryId(category.id)}
              tone={category.id === activeCategoryId ? "primary" : "neutral"}
            >
              {category.name}
            </Button>
          ))}
        </Inline>
        {catalog.isLoading ? (
          <Surface appearance="soft">
            <Stack gap="sm">
              <Text variant="h3">{strings.loadingTitle}</Text>
              <Text tone="muted">{strings.loadingDescription}</Text>
            </Stack>
          </Surface>
        ) : catalog.error ? (
          <Surface appearance="soft" tone="danger">
            <Stack gap="sm">
              <Text variant="h3">{strings.errorTitle}</Text>
              <Text tone="muted">{strings.errorDescription}</Text>
              <Button onAction={() => void catalog.load()}>{strings.retry}</Button>
            </Stack>
          </Surface>
        ) : catalogViewModel.filteredProducts.length > 0 ? (
          <Stack gap="md">
            {catalogViewModel.filteredProducts.map((product) => (
              <ProductItemCard
                actionLabel={onProductAction ? clientStrings.cortes.ctaBuy : undefined}
                description={product.subtitle}
                formattedPrice={moneyFormatter.format(product.price)}
                image={product.image}
                key={product.id}
                name={product.name}
                onAction={() => onProductAction?.(product.id)}
              />
            ))}
          </Stack>
        ) : (
          <Surface appearance="soft">
            <Stack gap="sm">
              <Text variant="h3">{strings.emptyTitle}</Text>
              <Text tone="muted">{strings.emptyDescription}</Text>
              <Button onAction={() => {
                setActiveCategoryId("all");
                setSearchQuery("");
                setSortBy("relevance");
              }}>{strings.clearFilters}</Button>
            </Stack>
          </Surface>
        )}
      </Stack>
    </Container>
  );
};
