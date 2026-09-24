import React from "react";
import { DropdownPickerSkeleton } from "@foundation/ui/web/DropdownPicker";
import { InputSkeleton } from "@foundation/ui/web/Input";
import { Inline } from "@foundation/ui/web/Layout";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import styles from "./CatalogoToolbar.module.css";

export const CatalogoToolbarSkeleton: React.FC = () => (
  <section aria-busy="true" className={styles.toolbar}>
    <div className={styles.searchField}>
      <InputSkeleton className={styles.searchSkeleton} />
    </div>
    <Inline className={styles.metaControls} justify="between">
      <Skeleton className={styles.resultCount} shape="text" size="sm" width="md" />
      <div className={styles.sortGroup}>
        <DropdownPickerSkeleton className={styles.sortSkeleton} size="sm" width="md" />
      </div>
    </Inline>
  </section>
);
