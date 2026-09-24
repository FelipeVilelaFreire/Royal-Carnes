import React from "react";
import { Stack } from "@foundation/ui/web/Layout";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import { Surface } from "@foundation/ui/web/Surface";
import styles from "./DetailPageSkeleton.module.css";

export const DetailQuickInfoCardSkeleton: React.FC = () => (
  <Surface appearance="glass" className={styles.quickInfoCard} tone="neutral">
    <Stack gap="2xs">
      <Skeleton shape="text" size="xs" width="sm" />
      <Skeleton shape="text" size="sm" width="md" />
    </Stack>
  </Surface>
);
