import React from "react";
import { Stack } from "@foundation/ui/web/Layout";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import styles from "./DashboardPageSkeleton.module.css";

export const DashboardHeaderSkeleton: React.FC = () => (
  <Stack className={styles.heading} gap="sm">
    <Skeleton shape="text" size="xs" width="sm" />
    <Skeleton shape="text" size="lg" width="md" />
    <Skeleton shape="text" size="sm" width="lg" />
  </Stack>
);
