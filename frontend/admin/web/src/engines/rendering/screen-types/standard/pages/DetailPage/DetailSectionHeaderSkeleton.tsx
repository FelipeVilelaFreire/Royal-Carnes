import React from "react";
import { Inline } from "@foundation/ui/web/Layout";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import styles from "./DetailPageSkeleton.module.css";

export const DetailSectionHeaderSkeleton: React.FC = () => (
  <Inline className={styles.sectionHeader} gap="sm">
    <Skeleton shape="circle" size="sm" width="sm" />
    <Skeleton shape="text" size="sm" width="md" />
  </Inline>
);
