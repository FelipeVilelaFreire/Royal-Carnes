import React from "react";
import { Button, Inline, Modal, Stack, Text } from "@foundation/ui";
import type { ClientCheckoutProductCategory } from "@/view-models/checkout.view-model";
import styles from "./ProductFilterModal.module.css";

export interface ProductFilterModalProps {
  categories: ClientCheckoutProductCategory[];
  onApply: () => void;
  onClose: () => void;
  onSelectCategory: (categoryId: string) => void;
  selectedCategoryId: string;
  strings: {
    allCategories: string;
    apply: string;
    categoryTitle: string;
    close: string;
    modalTitle: string;
  };
  tokens: {
    background: string;
    border: string;
    copper: string;
    surfaceContainer: string;
    text: string;
    textMuted: string;
  };
}

export const ProductFilterModal: React.FC<ProductFilterModalProps> = ({
  categories,
  onApply,
  onClose,
  onSelectCategory,
  selectedCategoryId,
  strings,
  tokens,
}) => {
  const primaryActionStyle = {
    "--ui-surface-bg": tokens.text,
    "--ui-surface-border": tokens.text,
    "--ui-surface-color": tokens.background,
  } as React.CSSProperties;

  const categoryListStyle = {
    "--pedido-filter-option-border": tokens.border,
    "--pedido-filter-option-color": tokens.text,
    "--pedido-filter-option-active-bg": tokens.surfaceContainer,
    "--pedido-filter-option-active-border": tokens.text,
    "--pedido-filter-option-active-color": tokens.text,
  } as React.CSSProperties;

  return (
    <Modal closeLabel={strings.close} onClose={onClose} open title={strings.modalTitle} variant="auto">
      <Stack gap="md">
        <Text tone="inherit" variant="body" style={{ color: tokens.textMuted, fontWeight: 800 }}>
          {strings.categoryTitle}
        </Text>
        <Stack className={styles.categoryList} role="listbox" style={categoryListStyle}>
          {[{ id: "all", name: strings.allCategories }, ...categories].map((category) => {
            const active = selectedCategoryId === category.id;

            return (
              <Button
                appearance="soft"
                tone="neutral"
                className={styles.categoryOption}
                key={category.id}
                role="option"
                aria-selected={active}
                type="button"
                onClick={() => onSelectCategory(category.id)}
              >
                {category.name}
              </Button>
            );
          })}
        </Stack>
      </Stack>
      <Inline className={styles.actions} justify="end">
        <Button appearance="outline" onClick={onClose}>
          {strings.close}
        </Button>
        <Button appearance="solid" tone="neutral" style={primaryActionStyle} onClick={onApply}>
          {strings.apply}
        </Button>
      </Inline>
    </Modal>
  );
};
