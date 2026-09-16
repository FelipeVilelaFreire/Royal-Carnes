import React from "react";
import { Button } from "@foundation/ui/web/Button";
import { Text } from "@foundation/ui/web/Text";
import type { AdminStandardLineItemColumnViewModel } from "@/view-models/standard.view-model";
import type { AdminTranslate } from "@/locales/i18n";
import { LineItemsEditorRow } from "./LineItemsEditorRow";
import { LineItemsReadTable } from "./LineItemsReadTable";
import { LineItemsTable } from "./LineItemsTable";
import { createEmptyLineItem, resolveNextLineItem } from "./line-items.utils";
import styles from "./LineItemsEditor.module.css";

export interface LineItemsEditorProps {
  addLabel: string;
  columns: AdminStandardLineItemColumnViewModel[];
  emptyLabel: string;
  onChange: (value: Array<Record<string, any>>) => void;
  readOnly?: boolean;
  removeLabel: string;
  t: AdminTranslate;
  value: Array<Record<string, any>>;
}

export const LineItemsEditor: React.FC<LineItemsEditorProps> = ({
  addLabel,
  columns,
  emptyLabel,
  onChange,
  readOnly = false,
  removeLabel,
  t,
  value,
}) => {
  const items = Array.isArray(value) ? value : [];

  const updateItem = (index: number, key: string, nextValue: string) => {
    onChange(items.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [key]: nextValue } : item
    )));
  };

  const updateColumnItem = (
    index: number,
    column: AdminStandardLineItemColumnViewModel,
    nextValue: string,
  ) => {
    onChange(items.map((item, itemIndex) => (
      itemIndex === index ? resolveNextLineItem(item, column, nextValue) : item
    )));
  };

  if (readOnly) {
    return (
      <div className={styles.editor}>
        {items.length ? <LineItemsReadTable columns={columns} items={items} t={t} /> : (
          <div className={styles.empty}>
            <Text tone="muted" variant="body">{emptyLabel}</Text>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.editor}>
      {items.length ? (
        <LineItemsTable actionLabel={removeLabel} columns={columns} t={t}>
          {items.map((item, index) => (
            <LineItemsEditorRow
              columns={columns}
              item={item}
              key={item.key || index}
              onChangeColumn={(column, nextValue) => updateColumnItem(index, column, nextValue)}
              onChangeValue={(key, nextValue) => updateItem(index, key, nextValue)}
              onRemove={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
              removeLabel={removeLabel}
              t={t}
            />
          ))}
        </LineItemsTable>
      ) : (
        <div className={styles.empty}>
          <Text tone="muted" variant="body">{emptyLabel}</Text>
        </div>
      )}
      <Button
        appearance="outline"
        onClick={() => onChange([...items, createEmptyLineItem(columns)])}
        size="sm"
        tone="neutral"
        type="button"
      >
        {addLabel}
      </Button>
    </div>
  );
};
