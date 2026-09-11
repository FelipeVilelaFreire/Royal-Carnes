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
}

export const ProductFilterModal: React.FC<ProductFilterModalProps> = ({
  categories,
  onApply,
  onClose,
  onSelectCategory,
  selectedCategoryId,
  strings,
}) => {
  return (
    <Modal closeLabel={strings.close} onClose={onClose} open title={strings.modalTitle} variant="auto">
      <Stack gap="md">
        <Text className={styles.categoryTitle} tone="inherit" variant="body">
          {strings.categoryTitle}
        </Text>
        <Stack className={styles.categoryList} role="listbox">
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
        <Button appearance="solid" className={styles.primaryAction} tone="neutral" onClick={onApply}>
          {strings.apply}
        </Button>
      </Inline>
    </Modal>
  );
};
