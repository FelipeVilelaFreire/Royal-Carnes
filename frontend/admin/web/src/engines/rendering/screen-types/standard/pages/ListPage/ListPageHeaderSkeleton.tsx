import React from "react";
import { ButtonSkeleton } from "@foundation/ui/web/Button";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import styles from "./ListPageSkeleton.module.css";

export const ListPageHeaderSkeleton: React.FC = () => (
  <Inline className={styles.header} justify="between" wrap>
    <Stack className={styles.heading} gap="sm">
      <Skeleton shape="text" size="sm" width="sm" />
      <Skeleton shape="text" size="lg" width="md" />
    </Stack>
    <ButtonSkeleton size="lg" width="md" />
  </Inline>
);
