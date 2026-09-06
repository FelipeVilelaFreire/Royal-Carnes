import React from "react";
import { Button, Grid, Inline, Input, Stack, Surface, Text } from "@foundation/ui";
import { FlameIcon as CutMeatIcon, SearchIcon, SettingsIcon } from "@foundation/ui/Icon/AppIcons";
import type {
  ClientCheckoutProduct,
  ClientCheckoutProductCategory,
  ClientCheckoutProductExperience,
} from "@/view-models/checkout.view-model";
import { ProductItemCard } from "../../../../product-components/ecommerce";
import styles from "../PedidoView.module.css";

export interface ProductCatalogStepProps {
  availableProducts: ClientCheckoutProduct[];
  canAddProduct: (product: ClientCheckoutProduct) => boolean;
  categoryById: Map<string, ClientCheckoutProductCategory>;
  formatMoney: (value: number) => string;
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
      style={{
        "--pedido-panel-bg": tokens.surfaceContainer,
        "--pedido-panel-border": tokens.border,
        "--pedido-panel-text": tokens.text,
      } as React.CSSProperties}
    >
      <Stack gap="lg">
        <Stack className={styles.catalogHeader}>
          <Text as="h2" tone="inherit" variant="h3">
            {strings.catalog.title}
          </Text>
          <Text tone="inherit" style={{ color: tokens.textMuted }}>
            {strings.catalog.subtitle}
          </Text>
        </Stack>

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
            style={{
              "--ui-surface-bg": tokens.surfaceContainer,
              "--ui-surface-border": tokens.border,
              "--ui-surface-color": tokens.text,
              width: "100%",
            } as React.CSSProperties}
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
          <Grid className={styles.productGrid}>
            {availableProducts.map((product) => {
              const category = categoryById.get(product.categoryId);
              const selectedQuantity = selectedProductQuantities[product.id] || 0;
              const isSelected = selectedQuantity > 0;
              const isActionDisabled = selectedMode === "subscription" && !canAddProduct(product);

              return (
                <ProductItemCard
                  key={product.id}
                  name={product.name}
                  description={product.description}
                  image={product.image}
                  categoryLabel={category?.name || strings.productCard.categoryLabel}
                  detailLabel={product.weightLabel || product.unit}
                  price={product.price}
                  priceLabel={strings.productCard.fromLabel}
                  formatPrice={formatMoney}
                  selected={isSelected}
                  quantity={selectedQuantity}
                  quantitySuffix={strings.productCard.quantitySuffix}
                  showPrice={selectedMode !== "subscription"}
                  showAction
                  actionLabel={strings.productCard.add}
                  selectedActionLabel={strings.productCard.add}
                  actionDisabled={isActionDisabled}
                  actionDisabledLabel={strings.productCard.limitReached}
                  disabledHint={strings.productCard.limitReachedHint}
                  onAction={() => onProductSelect(product)}
                  onDecrease={() => onDecreaseProduct(product.id)}
                  increaseQuantityAriaLabel={strings.productCard.increaseQuantity}
                  decreaseQuantityAriaLabel={strings.productCard.decreaseQuantity}
                  tokens={tokens}
                />
              );
            })}
          </Grid>
        ) : (
          <Surface appearance="outline" className={styles.emptyCatalog}>
            <CutMeatIcon size={28} color={tokens.copper} />
            <Text as="h3" tone="inherit" variant="h3">
              {strings.catalog.emptyTitle}
            </Text>
            <Text tone="inherit" style={{ color: tokens.textMuted }}>
              {strings.catalog.emptyDescription}
            </Text>
          </Surface>
        )}
      </Stack>
    </Surface>
  );
};
