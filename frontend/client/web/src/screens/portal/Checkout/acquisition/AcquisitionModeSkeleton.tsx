import React from "react";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import styles from "./AcquisitionModeSkeleton.module.css";

export const AcquisitionModeSkeleton: React.FC = () => (
  <section aria-busy="true" className={styles.grid}>
    {[0, 1, 2].map((index) => (
      <div className={styles.card} key={index}>
        <div className={styles.cardContent}>
          <Skeleton className={styles.icon} shape="block" size="xl" width="xs" />
          <div className={styles.copy}>
            <Skeleton shape="text" size="sm" width="sm" />
            <Skeleton className={styles.title} shape="text" size="lg" width="md" />
            <div className={styles.description}>
              <Skeleton shape="text" size="sm" width="full" />
              <Skeleton shape="text" size="sm" width="lg" />
            </div>
          </div>
        </div>
        <div className={styles.action}><Skeleton shape="text" size="sm" width="md" /></div>
      </div>
    ))}
  </section>
);
