import React from "react";
import { AvatarCell } from "@foundation/ui/web/Avatar";
import { Inline } from "@foundation/ui/web/Layout";
import { Text } from "@foundation/ui/web/Text";
import type { AdminStandardLineItemColumnViewModel } from "@/view-models/standard.view-model";
import type { AdminTranslate } from "@/locales/i18n";
import { resolveLineItemDisplayValue } from "../line-items.utils";
import { LineItemsTable } from "../table/LineItemsTable";
import styles from "../LineItemsEditor.module.css";

interface LineItemsReadTableProps {
  columns: AdminStandardLineItemColumnViewModel[];
  items: Array<Record<string, any>>;
  onOpenRelatedRow?: (screenKey: string, row: Record<string, any>) => void;
  t: AdminTranslate;
}

export const LineItemsReadTable: React.FC<LineItemsReadTableProps> = ({ columns, items, onOpenRelatedRow, t }) => {
  const detailScreenKey = columns.find((column) => column.detailScreenKey)?.detailScreenKey;
  return (
    <LineItemsTable columns={columns} t={t}>
      {items.map((item, index) => (
        <tr
          className={detailScreenKey ? styles.detailRow : undefined}
          key={item.key || index}
          onClick={() => detailScreenKey && onOpenRelatedRow?.(detailScreenKey, item)}
          onKeyDown={(event) => {
            if (detailScreenKey && (event.key === "Enter" || event.key === " ")) {
              event.preventDefault();
              onOpenRelatedRow?.(detailScreenKey, item);
            }
          }}
          role={detailScreenKey ? "link" : undefined}
          tabIndex={detailScreenKey ? 0 : undefined}
        >
          {columns.map((column) => (
            <td colSpan={column.span} data-align={column.align || "start"} key={column.key}>
              {column.presentation === "media" ? (
                <Inline gap="sm" wrap={false}>
                  <AvatarCell image={item.image} name={String(item.name || item[column.key] || "")} showName={false} size="sm" />
                  <Text as="span" className={styles.readOnlyValue} variant="body">
                    {resolveLineItemDisplayValue(column, item, t) || t("common.emptyValue")}
                  </Text>
                </Inline>
              ) : (
                <Text as="span" className={styles.readOnlyValue} variant="body">
                  {resolveLineItemDisplayValue(column, item, t) || t("common.emptyValue")}
                </Text>
              )}
            </td>
          ))}
        </tr>
      ))}
    </LineItemsTable>
  );
};
