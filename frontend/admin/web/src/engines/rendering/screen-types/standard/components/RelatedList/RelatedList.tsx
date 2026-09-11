import React from "react";
import { AvatarCell } from "@foundation/ui/web/Avatar";
import { Text } from "@foundation/ui/web/Text";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardRelatedListColumnViewModel } from "@/view-models/standard.view-model";
import styles from "./RelatedList.module.css";

export interface RelatedListProps {
  columns: AdminStandardRelatedListColumnViewModel[];
  emptyLabel: string;
  rows: Array<Record<string, any>>;
  t: AdminTranslate;
}

function resolveCellValue(
  column: AdminStandardRelatedListColumnViewModel,
  row: Record<string, any>,
  t: AdminTranslate,
): string {
  const rawValue = row[column.displayKey || column.key];
  if (rawValue === undefined || rawValue === null || rawValue === "") return "";
  const value = String(rawValue);
  return column.valueType === "translationKey" ? t(value, value) : value;
}

export const RelatedList: React.FC<RelatedListProps> = ({
  columns,
  emptyLabel,
  rows,
  t,
}) => {
  if (!rows.length) {
    return (
      <div className={styles.empty}>
        <Text tone="muted" variant="body">
          {emptyLabel}
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      <div className={styles.header}>
        {columns.map((column) => (
          <Text as="span" className={styles.heading} key={column.key} tone="muted" variant="caption" weight="bold">
            {t(column.labelKey, column.key)}
          </Text>
        ))}
      </div>
      <div className={styles.rows}>
        {rows.map((row, index) => (
          <div className={styles.row} key={row.id || index}>
            {columns.map((column) => {
              const value = resolveCellValue(column, row, t);
              return (
                <div className={styles.cell} key={column.key}>
                  {column.showAvatar ? (
                    <AvatarCell name={value} showName size="md" />
                  ) : (
                    <Text as="span" tone={value ? "default" : "muted"} variant="body">
                      {value || t("common.emptyValue")}
                    </Text>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
