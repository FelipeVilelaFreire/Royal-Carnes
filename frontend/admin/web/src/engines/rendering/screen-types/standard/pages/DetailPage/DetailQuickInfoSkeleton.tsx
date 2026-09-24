import React from "react";
import { Grid } from "@foundation/ui/web/Layout";
import styles from "./DetailPageSkeleton.module.css";
import { DetailQuickInfoCardSkeleton } from "./DetailQuickInfoCardSkeleton";

export const DetailQuickInfoSkeleton: React.FC<{ count: number }> = ({ count }) => (
  <Grid className={styles.quickInfo} columns={Math.max(1, count)} gap="sm">
    {Array.from({ length: Math.max(1, count) }).map((_, index) => <DetailQuickInfoCardSkeleton key={index} />)}
  </Grid>
);
