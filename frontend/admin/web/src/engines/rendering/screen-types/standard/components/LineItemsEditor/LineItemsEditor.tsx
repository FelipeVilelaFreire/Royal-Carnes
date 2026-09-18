import React from "react";
import { Button } from "@foundation/ui/web/Button";
import { PlusIcon } from "@foundation/ui/web/Icon/AppIcons";
import { Text } from "@foundation/ui/web/Text";
import type { AdminStandardLineItemColumnViewModel, AdminStandardLineItemsHierarchyViewModel } from "@/view-models/standard.view-model";
import type { AdminTranslate } from "@/locales/i18n";
import { LineItemsEditorRow } from "./edit/LineItemsEditorRow";
import { LineItemsReadTable } from "./read/LineItemsReadTable";
import { LineItemsHierarchy } from "./read/LineItemsHierarchy";
import { LineItemsTable } from "./table/LineItemsTable";
import { createEmptyLineItem, resolveNextLineItem } from "./line-items.utils";
import styles from "./LineItemsEditor.module.css";

export interface LineItemsEditorProps {
  addLabel: string;
  columns: AdminStandardLineItemColumnViewModel[];
  emptyLabel: string;
  hierarchy?: AdminStandardLineItemsHierarchyViewModel;
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
  hierarchy,
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
        {items.length ? hierarchy ? <LineItemsHierarchy columns={columns} hierarchy={hierarchy} items={items} t={t} /> : <LineItemsReadTable columns={columns} items={items} t={t} /> : (
          <div className={styles.empty}>
            <Text tone="muted" variant="body">{emptyLabel}</Text>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.editor}>
      <div className={styles.actions}>
        <Button
          appearance="solid"
          icon={<PlusIcon aria-hidden="true" />}
          onClick={() => onChange([...items, createEmptyLineItem(columns)])}
          size="sm"
          tone="primary"
          type="button"
        >
          {addLabel}
        </Button>
      </div>
      <LineItemsTable columns={columns} t={t}>
        {items.length ? items.map((item, index) => (
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
          )) : (
          <tr>
            <td className={styles.emptyCell} colSpan={columns.length + 1}>
              <Text tone="muted" variant="body">{emptyLabel}</Text>
            </td>
          </tr>
        )}
      </LineItemsTable>
    </div>
  );
};
