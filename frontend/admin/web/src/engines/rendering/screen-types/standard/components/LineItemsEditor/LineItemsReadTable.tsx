import React from "react";
import { Text } from "@foundation/ui/web/Text";
import type { AdminStandardLineItemColumnViewModel } from "@/view-models/standard.view-model";
import type { AdminTranslate } from "@/locales/i18n";
import { resolveLineItemDisplayValue } from "./line-items.utils";
import { LineItemsTable } from "./LineItemsTable";
import styles from "./LineItemsEditor.module.css";

interface LineItemsReadTableProps {
  columns: AdminStandardLineItemColumnViewModel[];
  items: Array<Record<string, any>>;
  t: AdminTranslate;
}

export const LineItemsReadTable: React.FC<LineItemsReadTableProps> = ({ columns, items, t }) => {
  return (
    <LineItemsTable columns={columns} t={t}>
      {items.map((item, index) => (
        <tr key={item.key || index}>
          {columns.map((column) => (
            <td key={column.key}>
              <Text as="span" className={styles.readOnlyValue} variant="body">
                {resolveLineItemDisplayValue(column, item, t) || t("common.emptyValue")}
              </Text>
            </td>
          ))}
        </tr>
      ))}
    </LineItemsTable>
  );
};
