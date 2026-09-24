import React from "react";
import { Grid } from "@foundation/ui/web/Layout";
import styles from "./DashboardKpiSkeleton.module.css";
import { DashboardKpiCardSkeleton } from "./DashboardKpiCardSkeleton";

export interface DashboardKpiSkeletonProps {
  columns: number;
  count: number;
  gap: "sm" | "md" | "lg" | "xl";
}

export const DashboardKpiSkeleton: React.FC<DashboardKpiSkeletonProps> = ({ columns, count, gap }) => (
  <Grid className={styles.grid} columns={columns} gap={gap}>
    {Array.from({ length: count }).map((_, index) => <DashboardKpiCardSkeleton key={index} />)}
  </Grid>
);
