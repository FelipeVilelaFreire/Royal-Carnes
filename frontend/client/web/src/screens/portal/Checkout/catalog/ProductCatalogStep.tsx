import React from "react";
import { Button, Grid, Inline, Input, Stack, Surface, Text } from "@foundation/ui";
import { FlameIcon as CutMeatIcon, SearchIcon, SettingsIcon } from "@foundation/ui/web/Icon/AppIcons";
import type {
  ClientCheckoutProduct,
  ClientCheckoutProductCategory,
  ClientCheckoutProductExperience,
} from "@/view-models/checkout.view-model";
import styles from "../CheckoutView.module.css";
import { CheckoutProductGrid } from "./CheckoutProductGrid";

export interface ProductCatalogStepProps {
  availableProducts: ClientCheckoutProduct[];
  canAddProduct: (product: ClientCheckoutProduct) => boolean;
  categoryById: Map<string, ClientCheckoutProductCategory>;
  formatMoney: (value: number) => string;
  header?: React.ReactNode;
  onClearFilters: () => void;
  onDecreaseProduct: (productId: string) => void;
  onOpenFilters: () => void;
  onProductSelect: (product: ClientCheckoutProduct) => void;
  onQueryChange: (value: string) => void;
  query: string;
  selectedCategoryId: string;
  selectedMode: ClientCheckoutProductExperience | null;
  selectedProductQuantities: Record<string, number>;
  strings: any;
  tokens: {
    background: string;
    border: string;
    copper: string;
    surfaceContainer: string;
    text: string;
    textMuted: string;
  };
}

export const ProductCatalogStep: React.FC<ProductCatalogStepProps> = ({
  availableProducts,
  canAddProduct,
  categoryById,
  formatMoney,
  header,
  onClearFilters,
  onDecreaseProduct,
  onOpenFilters,
  onProductSelect,
  onQueryChange,
  query,
  selectedCategoryId,
  selectedMode,
  selectedProductQuantities,
  strings,
  tokens,
}) => {
  const hasActiveFilter = selectedCategoryId !== "all" || Boolean(query);

  return (
    <Surface
      appearance="soft"
      className={styles.catalogPanel}
    >
      {header ? <div className={styles.catalogHeader}>{header}</div> : null}
      <Stack gap="lg">
        <Grid className={styles.toolbar}>
          <Input
            icon={<SearchIcon size={18} />}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={strings.hero.searchPlaceholder}
          />
          <Button
            appearance="outline"
            tone="neutral"
            icon={<SettingsIcon size={19} />}
            type="button"
            onClick={onOpenFilters}
            aria-label={strings.hero.filterLabel}
            className={styles.filterButton}
          >
            {strings.hero.filterLabel}
          </Button>
        </Grid>

        {hasActiveFilter ? (
          <Inline className={styles.filterResultBar} justify="between">
            <Text as="span" tone="muted" variant="caption">
              {availableProducts.length} {strings.catalog.foundLabel}
            </Text>
            <Button appearance="transparent" tone="neutral" size="sm" type="button" onClick={onClearFilters}>
              {strings.hero.clearFilters}
            </Button>
          </Inline>
        ) : null}

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
        ) : (
          <Surface appearance="outline" className={styles.emptyCatalog}>
            <CutMeatIcon className={styles.emptyCatalogIcon} size={28} />
            <Text as="h3" tone="inherit" variant="h3">
              {strings.catalog.emptyTitle}
            </Text>
            <Text className={styles.emptyCatalogDescription} tone="inherit">
              {strings.catalog.emptyDescription}
            </Text>
          </Surface>
        )}
      </Stack>
    </Surface>
  );
};
