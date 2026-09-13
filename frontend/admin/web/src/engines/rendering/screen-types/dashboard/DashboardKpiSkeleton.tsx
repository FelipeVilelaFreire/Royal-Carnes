import React from "react";
import { Grid, Inline, Stack } from "@foundation/ui/web/Layout";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import { Surface } from "@foundation/ui/web/Surface";
import styles from "./DashboardKpiSkeleton.module.css";

export interface DashboardKpiSkeletonProps {
  columns: number;
  count: number;
  gap: "sm" | "md" | "lg" | "xl";
}

export const DashboardKpiSkeleton: React.FC<DashboardKpiSkeletonProps> = ({ columns, count, gap }) => (
  <Grid className={styles.grid} columns={columns} gap={gap}>
    {Array.from({ length: count }).map((_, index) => (
      <Surface appearance="glass" className={styles.card} key={index} tone="neutral">
        <Inline justify="between" wrap={false}><Skeleton shape="text" size="xs" width="sm" /><Skeleton shape="circle" size="lg" width="lg" /></Inline>
        <Stack gap="sm"><Skeleton shape="text" size="lg" width="md" /><Skeleton shape="text" size="xs" width="lg" /></Stack>
      </Surface>
    ))}
  </Grid>
);
