import React from "react";
import { ButtonSkeleton } from "@foundation/ui/web/Button";
import { Inline } from "@foundation/ui/web/Layout";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import styles from "./AddPageSkeleton.module.css";

export const AddPageHeaderSkeleton: React.FC = () => (
  <Inline align="center" className={styles.pageHeader} justify="between" wrap>
    <Inline align="center" gap="md" wrap>
      <ButtonSkeleton size="sm" width="sm" />
      <Skeleton shape="text" size="lg" width="md" />
    </Inline>
  </Inline>
);
