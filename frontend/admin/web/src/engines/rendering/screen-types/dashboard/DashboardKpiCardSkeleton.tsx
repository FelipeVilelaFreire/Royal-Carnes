import React from "react";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import { Surface } from "@foundation/ui/web/Surface";
import styles from "./DashboardKpiSkeleton.module.css";

export const DashboardKpiCardSkeleton: React.FC = () => (
  <Surface appearance="glass" className={styles.card} tone="neutral">
    <Inline justify="between" wrap={false}>
      <Skeleton shape="text" size="xs" width="sm" />
      <Skeleton shape="circle" size="lg" width="lg" />
    </Inline>
    <Stack gap="sm">
      <Skeleton shape="text" size="lg" width="md" />
      <Skeleton shape="text" size="xs" width="lg" />
    </Stack>
  </Surface>
);
