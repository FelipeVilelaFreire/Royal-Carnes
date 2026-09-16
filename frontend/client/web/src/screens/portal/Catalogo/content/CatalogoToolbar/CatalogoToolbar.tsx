import React from "react";
import { SearchIcon } from "@foundation/ui/web/Icon/AppIcons";
import { DropdownPicker } from "@foundation/ui/web/DropdownPicker";
import { Input } from "@foundation/ui/web/Input";
import { Inline } from "@foundation/ui/web/Layout";
import { Text } from "@foundation/ui/web/Text";
import type { CatalogoContentModel } from "@royalprime/client/features/catalogo";
import type { CatalogoSortKey } from "@royalprime/client/view-models/catalogo.view-model";
import styles from "./CatalogoToolbar.module.css";

interface CatalogoToolbarProps {
  catalogo: CatalogoContentModel;
  strings: {
    resultPrefix: string;
    resultSuffix: string;
    searchAriaLabel: string;
    searchPlaceholder: string;
    sortAriaLabel: string;
    sortLabel: string;
  };
}

export const CatalogoToolbar: React.FC<CatalogoToolbarProps> = ({ catalogo, strings }) => (
  <section className={styles.toolbar}>
    <div className={styles.searchField}>
      <Input
        aria-label={strings.searchAriaLabel}
        className={styles.searchInput}
        icon={<SearchIcon size={18} />}
        onChange={(event) => catalogo.setSearchQuery(event.target.value)}
        placeholder={strings.searchPlaceholder}
        type="text"
        value={catalogo.searchQuery}
      />
    </div>
    <Inline className={styles.metaControls} justify="between">
      <Text as="span" className={styles.resultCount} tone="inherit" variant="caption">
        {strings.resultPrefix} <strong className={styles.resultNumber}>{catalogo.filteredProducts.length}</strong> {strings.resultSuffix}
      </Text>
      <div className={styles.sortGroup}>
        <DropdownPicker
          ariaLabel={strings.sortAriaLabel}
          className={styles.sortPicker}
          label={strings.sortLabel}
          onChange={(next) => catalogo.setSortBy(next as CatalogoSortKey)}
          options={catalogo.sortOptions}
          value={catalogo.sortBy}
          width="auto"
        />
      </div>
    </Inline>
  </section>
);
