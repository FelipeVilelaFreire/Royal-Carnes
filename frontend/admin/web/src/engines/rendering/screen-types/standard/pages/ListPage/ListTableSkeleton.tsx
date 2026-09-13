import React from "react";
import { Card } from "@foundation/ui/web/Card";
import { Inline } from "@foundation/ui/web/Layout";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import styles from "./ListTableSkeleton.module.css";

export interface ListTableSkeletonProps { columnCount: number; }

const loadingRows = Array.from({ length: 5 });

export const ListTableSkeleton: React.FC<ListTableSkeletonProps> = ({ columnCount }) => (
  <Card className={styles.card} size="sm">
    <div className={styles.scroller}>
      <table className={styles.table}>
        <thead><tr>{Array.from({ length: columnCount }).map((_, index) => <th key={index}><Skeleton shape="text" size="xs" width="sm" /></th>)}</tr></thead>
        <tbody>{loadingRows.map((_, rowIndex) => <tr key={rowIndex}>{Array.from({ length: columnCount }).map((__, columnIndex) => <td key={columnIndex}><Skeleton shape="text" size="sm" width={columnIndex === 0 ? "lg" : columnIndex === columnCount - 1 ? "xs" : "md"} /></td>)}</tr>)}</tbody>
      </table>
    </div>
    <div className={styles.footer}><Skeleton shape="text" size="xs" width="sm" /><Inline gap="sm" wrap={false}><Skeleton shape="circle" size="lg" width="lg" /><Skeleton shape="circle" size="lg" width="lg" /></Inline></div>
  </Card>
);
