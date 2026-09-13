import React from "react";
import { Card } from "@foundation/ui/web/Card";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import styles from "./ListFilterCardSkeleton.module.css";

export const ListFilterCardSkeleton: React.FC = () => (
  <Card className={styles.card} size="sm">
    <div className={styles.toolbar}>
      <Skeleton size="lg" width="full" />
      <Skeleton size="lg" width="lg" />
    </div>
  </Card>
);
