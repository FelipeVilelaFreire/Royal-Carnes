import React, { type ReactNode } from "react";
import type { AdminStandardLineItemColumnViewModel } from "@/view-models/standard.view-model";
import type { AdminTranslate } from "@/locales/i18n";
import styles from "./LineItemsEditor.module.css";

interface LineItemsTableProps {
  actionLabel?: string;
  children: ReactNode;
  columns: AdminStandardLineItemColumnViewModel[];
  t: AdminTranslate;
}

export const LineItemsTable: React.FC<LineItemsTableProps> = ({ actionLabel, children, columns, t }) => (
  <div className={styles.tableViewport}>
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column) => <th key={column.key} scope="col">{t(column.labelKey)}</th>)}
          {actionLabel ? <th className={styles.actionHeader} scope="col"><span className={styles.visuallyHidden}>{actionLabel}</span></th> : null}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);
