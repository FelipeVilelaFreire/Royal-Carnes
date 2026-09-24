import React from "react";
import { ButtonSkeleton } from "@foundation/ui/web/Button";
import { Inline } from "@foundation/ui/web/Layout";
import { Surface } from "@foundation/ui/web/Surface";
import styles from "./DetailPageSkeleton.module.css";

export const DetailTabsSkeleton: React.FC<{ count: number }> = ({ count }) => (
  <Surface appearance="soft" className={styles.tabs} tone="neutral">
    <Inline gap="sm" wrap>
      {Array.from({ length: Math.max(1, count) }).map((_, index) => <ButtonSkeleton key={index} size="sm" width="md" />)}
    </Inline>
  </Surface>
);
