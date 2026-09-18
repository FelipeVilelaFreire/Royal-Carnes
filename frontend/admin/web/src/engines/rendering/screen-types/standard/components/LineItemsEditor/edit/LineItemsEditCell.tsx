import React from "react";
import { CurrencyInput } from "@foundation/ui/web/CurrencyInput";
import { DropdownPicker } from "@foundation/ui/web/DropdownPicker";
import { FormattedInput } from "@foundation/ui/web/FormattedInput";
import { Select } from "@foundation/ui/web/Select";
import { Text } from "@foundation/ui/web/Text";
import type { AdminStandardLineItemColumnViewModel } from "@/view-models/standard.view-model";
import type { AdminTranslate } from "@/locales/i18n";
import { resolveLineItemDisplayValue, resolveLineItemMaximum, resolveLineItemOptions, resolveLineItemSuffix } from "../line-items.utils";
import styles from "../LineItemsEditor.module.css";

interface LineItemsEditCellProps {
  column: AdminStandardLineItemColumnViewModel;
  item: Record<string, any>;
  onChangeColumn: (column: AdminStandardLineItemColumnViewModel, value: string) => void;
  onChangeValue: (key: string, value: string) => void;
  t: AdminTranslate;
}

export const LineItemsEditCell: React.FC<LineItemsEditCellProps> = ({ column, item, onChangeColumn, onChangeValue, t }) => {
  const options = resolveLineItemOptions(column, item);
  const selectedValue = String(item[column.key] || "");
  const selectOptions = [
    { label: t("forms.selectOption"), value: "" },
    ...options.map((option) => ({ label: option.label || t(option.labelKey || "", option.value), value: option.value })),
  ];

  if (column.readOnly) {
    return <Text as="span" className={styles.readOnlyValue} variant="body">{resolveLineItemDisplayValue(column, item, t) || t("common.emptyValue")}</Text>;
  }

  if (column.type === "select" && column.presentation === "media") {
    return <DropdownPicker ariaLabel={t(column.labelKey)} onChange={(value) => onChangeColumn(column, value)} options={selectOptions.map((option) => {
      const source = options.find((candidate) => candidate.value === option.value);
      return {
        description: typeof source?.meta?.description === "string" ? source.meta.description : undefined,
        ...option,
      };
    })} placeholder={t("forms.selectOption")} value={selectedValue} />;
  }

  if (column.type === "select") return <Select onChange={(event) => onChangeColumn(column, event.target.value)} options={selectOptions} value={selectedValue} />;
  if (column.type === "currency") return <CurrencyInput currency={column.currency} locale={column.locale} onChange={(value) => onChangeValue(column.key, value === null ? "" : String(value))} value={selectedValue === "" ? null : Number(selectedValue)} />;

  const suffix = resolveLineItemSuffix(column, item);
  const maximum = resolveLineItemMaximum(column, item);
  return <FormattedInput className={column.format === "decimalBR" ? styles.quantityControl : undefined} format={column.format} max={maximum} min={column.type === "number" ? 0 : undefined} onValueChange={(value) => onChangeValue(column.key, value)} suffix={suffix} type={column.type === "number" ? "number" : "text"} value={selectedValue} />;
};
