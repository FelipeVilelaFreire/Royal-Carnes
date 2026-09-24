import React from "react";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import type { AdminStandardDetailLineItemsSectionViewModel } from "@/view-models/standard.view-model";
import styles from "../DetailPageSkeleton.module.css";

const loadingRows = Array.from({ length: 3 });

export const DetailLineItemsTableSkeleton: React.FC<{ section: AdminStandardDetailLineItemsSectionViewModel }> = ({ section }) => {
  const columnCount = Math.max(1, section.entry.columns?.length || 3);
  return (
    <div className={styles.tableScroller}>
      <table className={styles.table}>
        <thead><tr>{Array.from({ length: columnCount }).map((_, index) => <th key={index}><Skeleton shape="text" size="xs" width="sm" /></th>)}</tr></thead>
        <tbody>{loadingRows.map((_, rowIndex) => <tr key={rowIndex}>{Array.from({ length: columnCount }).map((__, columnIndex) => <td key={columnIndex}><Skeleton shape="text" size="sm" width={columnIndex === 0 ? "lg" : "md"} /></td>)}</tr>)}</tbody>
      </table>
    </div>
  );
};
