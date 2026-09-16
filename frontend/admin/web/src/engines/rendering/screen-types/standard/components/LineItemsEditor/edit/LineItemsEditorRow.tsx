import React from "react";
import { Button } from "@foundation/ui/web/Button";
import { CloseIcon } from "@foundation/ui/web/Icon/AppIcons";
import type { AdminStandardLineItemColumnViewModel } from "@/view-models/standard.view-model";
import type { AdminTranslate } from "@/locales/i18n";
import { LineItemsEditCell } from "./LineItemsEditCell";
import styles from "../LineItemsEditor.module.css";

interface LineItemsEditorRowProps {
  columns: AdminStandardLineItemColumnViewModel[];
  item: Record<string, any>;
  onChangeColumn: (column: AdminStandardLineItemColumnViewModel, value: string) => void;
  onChangeValue: (key: string, value: string) => void;
  onRemove: () => void;
  removeLabel: string;
  t: AdminTranslate;
}

export const LineItemsEditorRow: React.FC<LineItemsEditorRowProps> = ({
  columns,
  item,
  onChangeColumn,
  onChangeValue,
  onRemove,
  removeLabel,
  t,
}) => (
  <tr>
    {columns.map((column) => {
        return (
          <td key={column.key}>
            <LineItemsEditCell column={column} item={item} onChangeColumn={onChangeColumn} onChangeValue={onChangeValue} t={t} />
          </td>
        );
      })}
    <td className={styles.actionCell}>
      <Button
        appearance="transparent"
        aria-label={removeLabel}
        className={styles.removeButton}
        icon={<CloseIcon aria-hidden="true" />}
        iconPosition="only"
        onClick={onRemove}
        size="sm"
        tone="danger"
        type="button"
      />
    </td>
  </tr>
);
