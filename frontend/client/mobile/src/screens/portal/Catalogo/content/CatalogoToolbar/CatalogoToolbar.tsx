import React from "react";
import { DropdownPicker } from "@foundation/ui/native/DropdownPicker";
import { Input } from "@foundation/ui/native/Input";
import { Inline, Stack } from "@foundation/ui/native/Layout";
import { Text } from "@foundation/ui/native/Text";
import { useUi } from "@foundation/ui/native/context";
import type { CatalogoContentModel } from "@royalprime/client/features/catalogo";
import type { CatalogoSortKey } from "@royalprime/client/view-models/catalogo.view-model";
import { createCatalogoToolbarStyles, catalogoToolbarTokens } from "./styles";

interface CatalogoToolbarProps {
  catalogo: CatalogoContentModel;
  strings: {
    searchAriaLabel: string;
    searchPlaceholder: string;
    resultPrefix: string;
    resultSuffix: string;
    sortAriaLabel: string;
    sortLabel: string;
  };
}

export const CatalogoToolbar: React.FC<CatalogoToolbarProps> = ({ catalogo, strings }) => {
  const { designSystem } = useUi();
  const styles = createCatalogoToolbarStyles(designSystem);

  return (
  <Stack gap={catalogoToolbarTokens.gap} style={styles.root}>
    <Input
      accessibilityLabel={strings.searchAriaLabel}
      iconIntent="search"
      onChangeText={catalogo.setSearchQuery}
      placeholder={strings.searchPlaceholder}
      value={catalogo.searchQuery}
    />
    <Inline style={styles.metaRow}>
      <Stack style={styles.sortControl}>
        <Text style={styles.sortLabel} variant="caption">{strings.sortLabel}</Text>
        <DropdownPicker
          accessibilityLabel={strings.sortAriaLabel}
          onChange={(next) => catalogo.setSortBy(next as CatalogoSortKey)}
          options={catalogo.sortOptions}
          value={catalogo.sortBy}
        />
      </Stack>
      <Text style={styles.resultCount} tone="muted" variant="caption">
        {strings.resultPrefix} {catalogo.filteredProducts.length} {strings.resultSuffix}
      </Text>
    </Inline>
  </Stack>
  );
};
