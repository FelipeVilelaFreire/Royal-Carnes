import React from "react";
import { Card } from "@foundation/ui/web/Card";
import { DropdownPickerSkeleton } from "@foundation/ui/web/DropdownPicker";
import { InputSkeleton } from "@foundation/ui/web/Input";
import styles from "./ListFilterCardSkeleton.module.css";

export const ListFilterCardSkeleton: React.FC<{ filterCount: number }> = ({ filterCount }) => (
  <Card className={styles.card} size="sm">
    <div className={styles.toolbar}>
      <InputSkeleton className={styles.search} />
      {Array.from({ length: filterCount }).map((_, index) => (
        <DropdownPickerSkeleton className={styles.filter} key={index} size="lg" width="lg" />
      ))}
    </div>
  </Card>
);
