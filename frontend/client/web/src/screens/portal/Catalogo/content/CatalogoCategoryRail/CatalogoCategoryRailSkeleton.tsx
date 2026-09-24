import React from "react";
import { ButtonSkeleton } from "@foundation/ui/web/Button";
import styles from "./CatalogoCategoryRail.module.css";

const railSkeletonItems = ["all", "first", "second", "third", "fourth", "fifth", "sixth", "seventh"];

export const CatalogoCategoryRailSkeleton: React.FC = () => (
  <nav aria-busy="true" className={styles.categoryRail}>
    <div className={styles.categoryViewport}>
      <ul className={[styles.categoryList, styles.categoryListSkeleton].join(" ")}>
        {railSkeletonItems.map((item) => <li key={item}><ButtonSkeleton size="sm" width="full" /></li>)}
      </ul>
    </div>
  </nav>
);
