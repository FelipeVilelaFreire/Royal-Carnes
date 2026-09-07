"use client";

import React, { useMemo, useState } from "react";
import { SearchIcon } from "@foundation/ui/Icon/AppIcons";
import { Button } from "@foundation/ui/Button";
import { DropdownPicker } from "@foundation/ui/DropdownPicker";
import { Input } from "@foundation/ui/Input";
import { Container, Grid, Inline, Stack } from "@foundation/ui/Layout";
import { Surface } from "@foundation/ui/Surface";
import { Text } from "@foundation/ui/Text";
import {
  createCortesCatalogViewModel,
  type CortesCatalogSortKey,
} from "@/view-models/cortes-catalog.view-model";
import { useClientCatalog } from "@/hooks/useClientCatalog";
import { ProductItemCard } from "../../../product-components/ecommerce";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import styles from "./CortesView.module.css";

export interface CortesViewProps {
}

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

export const CortesView: React.FC<CortesViewProps> = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<CortesCatalogSortKey>("relevance");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [themeMode, setThemeMode] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("royal_prime_theme");
      if (stored === "dark" || stored === "light") return stored;
    }
    return "dark";
  });

  React.useEffect(() => {
    const handleThemeChange = () => {
      const current = localStorage.getItem("royal_prime_theme");
      if (current === "dark" || current === "light") {
        setThemeMode(current);
      }
    };
    window.addEventListener("royal_theme_changed", handleThemeChange);
    return () => window.removeEventListener("royal_theme_changed", handleThemeChange);
  }, []);

  const isDark = themeMode === "dark";
  const clientStrings = useClientStrings();
  const strings = clientStrings.cortes.catalogPage;
  const productCardStrings = clientStrings.pedido.productCard;
  const catalog = useClientCatalog();

  React.useEffect(() => {
    catalog.load().catch(() => undefined);
  }, [catalog.load]);

  const catalogViewModel = useMemo(
    () => createCortesCatalogViewModel({
      activeCategoryId: activeTab,
      apiProducts: catalog.snapshot.products,
      defaultLineLabel: strings.defaultLineLabel,
      searchQuery,
      sortBy,
    }),
    [activeTab, catalog.snapshot.products, searchQuery, sortBy, strings.defaultLineLabel],
  );
  const sortOptions = useMemo(
    () => [
      { value: "relevance", label: strings.sortOptions.relevance },
      { value: "best_sellers", label: strings.sortOptions.bestSellers },
      { value: "price_asc", label: strings.sortOptions.priceAsc },
      { value: "price_desc", label: strings.sortOptions.priceDesc },
    ],
    [strings.sortOptions.bestSellers, strings.sortOptions.priceAsc, strings.sortOptions.priceDesc, strings.sortOptions.relevance],
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const clearFilters = () => {
    setActiveTab("all");
    setSearchQuery("");
    setSortBy("relevance");
  };

  const filteredCuts = catalogViewModel.filteredProducts;

  return (
    <main className={styles.root}>
      <Container className={styles.main} width="wide" gutter="page">
        <Stack gap="2xl">
          <header className={styles.hero}>
            <Stack gap="sm">
              <Text className={styles.eyebrow} as="span" tone="inherit" variant="caption">
                {strings.badge}
              </Text>
              <Text className={styles.title} as="h1" tone="inherit" variant="h1">
                {strings.title}
              </Text>
              <Text className={styles.description} tone="inherit">
                {strings.description}
              </Text>
            </Stack>
          </header>

          <nav className={styles.categoryScroller} aria-label={strings.categoryNavigationLabel}>
            <ul className={styles.categoryList}>
              {catalogViewModel.categories.map((cat) => {
                const isActive = activeTab === cat.id;
                return (
                  <li key={cat.id}>
                    <Button
                      appearance={isActive ? "solid" : "outline"}
                      className={styles.categoryButton}
                      data-active={isActive || undefined}
                      onClick={() => setActiveTab(cat.id)}
                      size="sm"
                      tone={isActive ? "primary" : "neutral"}
                      type="button"
                    >
                      {cat.name}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Inline className={styles.toolbar} justify="between">
            <div className={styles.searchField}>
              <Input
                type="text"
                aria-label={strings.searchAriaLabel}
                icon={<SearchIcon size={18} />}
                placeholder={strings.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.sortGroup}>
              <DropdownPicker
                ariaLabel={strings.sortAriaLabel}
                className={styles.sortPicker}
                label={strings.sortLabel}
                options={sortOptions}
                value={sortBy}
                onChange={(next) => setSortBy(next as CortesCatalogSortKey)}
              />
            </div>
          </Inline>

          <Inline className={styles.resultsBar} justify="between">
            <Text className={styles.resultCount} as="span" tone="inherit" variant="caption">
              {strings.resultPrefix} <strong className={styles.resultNumber}>{filteredCuts.length}</strong> {strings.resultSuffix}
            </Text>
            {(searchQuery || activeTab !== "all" || sortBy !== "relevance") ? (
              <Button appearance="outline" className={styles.clearFiltersButton} size="sm" tone="neutral" type="button" onClick={clearFilters}>
                {strings.clearFilters}
              </Button>
            ) : null}
          </Inline>

          {filteredCuts.length > 0 ? (
            <Grid className={styles.productGrid}>
              {filteredCuts.map((cut) => {
                const isFav = Boolean(favorites[cut.id]);
                return (
                  <ProductItemCard
                    key={cut.id}
                    name={cut.name}
                    description={cut.subtitle}
                    image={cut.image}
                    categoryLabel={cut.line}
                    detailLabel={cut.origin ? `${cut.weight} | ${strings.originLabel}: ${cut.origin}` : cut.weight}
                    price={cut.price}
                    originalPrice={cut.originalPrice}
                    formatPrice={moneyFormatter.format}
                    badge={cut.badge}
                    badgeTone={cut.badgeType}
                    favorite={isFav}
                    showPrice={true}
                    showAction={false}
                    onFavoriteToggle={() => toggleFavorite(cut.id)}
                    favoriteAriaLabel={productCardStrings.addFavorite}
                    removeFavoriteAriaLabel={productCardStrings.removeFavorite}
                    isDark={isDark}
                  />
                );
              })}
            </Grid>
          ) : (
            <Surface appearance="solid" className={styles.emptyPanel}>
              <Stack align="center" gap="md">
                <span className={styles.emptyIcon} aria-hidden="true">
                  <SearchIcon size={24} />
                </span>
                <Stack align="center" gap="xs">
                  <Text as="h2" className={styles.emptyTitle} tone="inherit" variant="h3">
                    {strings.emptyTitle}
                  </Text>
                  <Text className={styles.emptyDescription} tone="inherit">
                    {strings.emptyDescription}
                  </Text>
                </Stack>
                <Button appearance="solid" size="sm" tone="primary" type="button" onClick={clearFilters}>
                  {strings.clearFilters}
                </Button>
              </Stack>
            </Surface>
          )}
        </Stack>
      </Container>
    </main>
  );
};
