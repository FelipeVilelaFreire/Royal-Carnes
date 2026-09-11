import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@foundation/ui/native/Button";
import { DropdownPicker } from "@foundation/ui/native/DropdownPicker";
import { Input } from "@foundation/ui/native/Input";
import { Container, Inline, Stack } from "@foundation/ui/native/Layout";
import { Surface } from "@foundation/ui/native/Surface";
import { Text } from "@foundation/ui/native/Text";
import { useUi } from "@foundation/ui/native/context";
import { ProductItemCard } from "@royalprime/product-components/ecommerce/native/ProductItemCard";
import { ScreenHeader } from "@foundation/product-components/screens/native/ScreenHeader";
import { normalizeScreenHeaderScrollProgress } from "@foundation/product-components/screens/shared";
import { useClientApiConfig } from "../../../../../shared-core/runtime/ClientApiProvider";
import { useClientCatalog } from "../../../../../shared-core/hooks/useClientCatalog";
import type { useClientStrings } from "../../../../../shared-core/hooks/useClientStrings";
import { createCortesCatalogViewModel } from "../../../../../shared-core/view-models/cortes-catalog.view-model";
import type { CortesCatalogSortKey } from "../../../../../shared-core/view-models/cortes-catalog.view-model";

export interface CortesViewProps {
  onProductAction?: (productId: string) => void;
  strings: ReturnType<typeof useClientStrings>;
}

type NativeScrollEvent = {
  nativeEvent?: {
    contentOffset?: {
      y?: number;
    };
  };
};

const moneyFormatter = new Intl.NumberFormat("pt-BR", { currency: "BRL", style: "currency" });

export const CortesView: React.FC<CortesViewProps> = ({ onProductAction, strings: clientStrings }) => {
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<CortesCatalogSortKey>("relevance");
  const [headerScrollProgress, setHeaderScrollProgress] = useState(0);
  const { designSystem, hosts } = useUi();
  const ScrollContainer = hosts.ScrollView || hosts.View;
  const screenHeaderScrollRange = Math.max(Number(designSystem.theme.tokens.spacing?.space3xl || 0), 1);
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
    <ScrollContainer
      onScroll={hosts.ScrollView ? (event: NativeScrollEvent) => setHeaderScrollProgress(
        normalizeScreenHeaderScrollProgress((event.nativeEvent?.contentOffset?.y || 0) / screenHeaderScrollRange),
      ) : undefined}
      scrollEventThrottle={hosts.ScrollView ? 16 : undefined}
      stickyHeaderIndices={hosts.ScrollView ? [0] : undefined}
    >
      <ScreenHeader
        description={strings.description}
        eyebrow={strings.badge}
        mobileMode="collapsible"
        mobileTitle={strings.mobileTitle}
        scrollProgress={headerScrollProgress}
        title={strings.title}
      />
      <Container>
        <Stack gap="lg">
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
    </ScrollContainer>
  );
};
