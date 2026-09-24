import React from "react";
import { Button, Inline, Modal, Stack } from "@foundation/ui";
import type { ClientCheckoutProductCategory } from "@/view-models/checkout.view-model";
import styles from "./ProductFilterModal.module.css";

export interface ProductFilterModalProps {
  categories: ClientCheckoutProductCategory[];
  onApply: (categoryId: string) => void;
  onClose: () => void;
  selectedCategoryId: string;
  strings: {
    allCategories: string;
    apply: string;
    close: string;
    modalTitle: string;
  };
}

export const ProductFilterModal: React.FC<ProductFilterModalProps> = ({
  categories,
  onApply,
  onClose,
  selectedCategoryId,
  strings,
}) => {
  const [draftCategoryId, setDraftCategoryId] = React.useState(selectedCategoryId);
  const parentCategories = categories.filter((category) => !category.parentId);

  return (
    <Modal closeLabel={strings.close} onClose={onClose} open title={strings.modalTitle} variant="auto">
      <Stack gap="md">
        <Stack className={styles.categoryList} role="listbox">
          {[{ id: "all", name: strings.allCategories }, ...parentCategories].map((category) => {
            const active = draftCategoryId === category.id;

            return (
              <Button
                appearance="soft"
                tone="neutral"
                className={styles.categoryOption}
                key={category.id}
                role="option"
                aria-selected={active}
                type="button"
                onClick={() => setDraftCategoryId(category.id)}
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
        <Button appearance="solid" className={styles.primaryAction} tone="neutral" onClick={() => onApply(draftCategoryId)}>
          {strings.apply}
        </Button>
      </Inline>
    </Modal>
  );
};
