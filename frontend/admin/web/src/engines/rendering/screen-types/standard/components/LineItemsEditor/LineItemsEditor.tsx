import React from "react";
import { Button } from "@foundation/ui/Button";
import { Input } from "@foundation/ui/Input";
import { Select } from "@foundation/ui/Select";
import { Text } from "@foundation/ui/Text";
import { CloseIcon } from "@foundation/ui/Icon/AppIcons";
import type {
  AdminStandardFieldOption,
  AdminStandardLineItemColumnViewModel,
} from "@/view-models/standard.view-model";
import type { AdminTranslate } from "@/locales/i18n";
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

function createEmptyItem(columns: AdminStandardLineItemColumnViewModel[]): Record<string, any> {
  return Object.fromEntries(columns.map((column) => [column.key, ""]));
}

function resolveColumnOptions(
  column: AdminStandardLineItemColumnViewModel,
  item: Record<string, any>,
): AdminStandardFieldOption[] {
  if (column.sourceBy && column.sources) {
    return column.sourceOptions?.[String(item[column.sourceBy])] || [];
  }
  return column.options || [];
}

function resolveNextItem(
  item: Record<string, any>,
  column: AdminStandardLineItemColumnViewModel,
  nextValue: string,
): Record<string, any> {
  const options = resolveColumnOptions(column, item);
  const selectedOption = options.find((candidate) => candidate.value === nextValue);
  const nextItem = {
    ...item,
    ...column.writeValues,
    [column.key]: nextValue,
  };

  Object.entries(column.writeOptionMeta || {}).forEach(([metaKey, itemKey]) => {
    const metaValue = selectedOption?.meta?.[metaKey];
    if (metaValue !== undefined && metaValue !== null) {
      nextItem[itemKey] = metaValue;
    }
  });

  return nextItem;
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
      itemIndex === index ? resolveNextItem(item, column, nextValue) : item
    )));
  };

  const addItem = () => {
    onChange([...items, createEmptyItem(columns)]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  const resolveDisplayValue = (
    column: AdminStandardLineItemColumnViewModel,
    item: Record<string, any>,
  ) => {
    const rawValue = String(item[column.key] || "");
    const option = resolveColumnOptions(column, item).find((candidate) => candidate.value === rawValue);
    const value = option?.label || t(option?.labelKey || "", rawValue) || rawValue;
    const suffix = column.suffixKey ? String(item[column.suffixKey] || "") : "";
    return suffix && value ? `${value} ${suffix}` : value;
  };

  const resolveSuffix = (
    column: AdminStandardLineItemColumnViewModel,
    item: Record<string, any>,
  ) => column.suffixKey ? String(item[column.suffixKey] || "") : "";

  return (
    <div className={styles.editor}>
      <div className={styles.rows}>
        {items.length ? items.map((item, index) => (
          <div className={styles.row} key={item.key || index}>
            <div className={styles.rowFields}>
              {columns.map((column) => {
                const options = resolveColumnOptions(column, item);
                return (
                  <label className={styles.field} key={column.key}>
                    <Text as="span" tone="muted" variant="caption" weight="bold">
                      {t(column.labelKey)}
                    </Text>
                    {readOnly ? (
                      <Text as="strong" className={styles.value} variant="body">
                        {resolveDisplayValue(column, item)}
                      </Text>
                    ) : column.type === "select" ? (
                      <Select
                        onChange={(event) => updateColumnItem(index, column, event.target.value)}
                        options={[
                          { label: t("forms.selectOption"), value: "" },
                          ...options.map((option) => ({
                            label: option.label || t(option.labelKey || "", option.value),
                            value: option.value,
                          })),
                        ]}
                        value={String(item[column.key] || "")}
                      />
                    ) : (
                      <span className={styles.inputWithSuffix}>
                        <Input
                          onChange={(event) => updateItem(index, column.key, event.target.value)}
                          type={column.type === "number" ? "number" : "text"}
                          value={String(item[column.key] || "")}
                        />
                        {resolveSuffix(column, item) ? (
                          <Text as="span" className={styles.suffix} tone="muted" variant="caption" weight="bold">
                            {resolveSuffix(column, item)}
                          </Text>
                        ) : null}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
            {readOnly ? null : (
              <Button
                appearance="outline"
                aria-label={removeLabel}
                className={styles.removeButton}
                icon={<CloseIcon aria-hidden="true" />}
                iconPosition="only"
                onClick={() => removeItem(index)}
                size="sm"
                tone="neutral"
                type="button"
              />
            )}
          </div>
        )) : (
          <div className={styles.empty}>
            <Text tone="muted" variant="body">
              {emptyLabel}
            </Text>
          </div>
        )}
      </div>
      {readOnly ? null : (
        <Button appearance="outline" onClick={addItem} size="sm" tone="neutral" type="button">
          {addLabel}
        </Button>
      )}
    </div>
  );
};
