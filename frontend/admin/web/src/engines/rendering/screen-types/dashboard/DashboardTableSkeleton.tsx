import React from "react";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import { Surface, type UiSurfaceAppearance } from "@foundation/ui/web/Surface";
import styles from "./DashboardTableSkeleton.module.css";

export interface DashboardTableSkeletonProps {
  appearance: UiSurfaceAppearance;
  columnCount: number;
  tone: string;
}

const loadingRows = Array.from({ length: 4 });

export const DashboardTableSkeleton: React.FC<DashboardTableSkeletonProps> = ({ appearance, columnCount, tone }) => (
  <Stack className={styles.section} gap="sm">
    <Inline className={styles.header} justify="between" wrap={false}><Skeleton shape="text" size="md" width="md" /><Skeleton shape="text" size="sm" width="sm" /></Inline>
    <Surface appearance={appearance} className={styles.card} tone={tone}>
      <div className={styles.scroller}>
        <table className={styles.table}>
          <thead><tr>{Array.from({ length: columnCount }).map((_, index) => <th key={index}><Skeleton shape="text" size="xs" width="sm" /></th>)}</tr></thead>
          <tbody>{loadingRows.map((_, rowIndex) => <tr key={rowIndex}>{Array.from({ length: columnCount }).map((__, columnIndex) => <td key={columnIndex}><Skeleton shape="text" size="sm" width={columnIndex === 0 ? "lg" : columnIndex === columnCount - 1 ? "xs" : "md"} /></td>)}</tr>)}</tbody>
        </table>
      </div>
    </Surface>
  </Stack>
);
