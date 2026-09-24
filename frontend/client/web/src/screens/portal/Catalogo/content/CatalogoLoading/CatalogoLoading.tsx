import React from "react";
import { Stack } from "@foundation/ui/web/Layout";
import { CatalogoCategoryRailSkeleton } from "../CatalogoCategoryRail/CatalogoCategoryRailSkeleton";
import { CatalogoProductGridSkeleton } from "../CatalogoProductGrid/CatalogoProductGridSkeleton";
import { CatalogoToolbarSkeleton } from "../CatalogoToolbar/CatalogoToolbarSkeleton";
import styles from "./CatalogoLoading.module.css";

export const CatalogoLoading: React.FC = () => (
  <section aria-busy="true" className={styles.loading}>
    <Stack gap="lg">
      <CatalogoCategoryRailSkeleton />
      <CatalogoToolbarSkeleton />
      <CatalogoProductGridSkeleton />
    </Stack>
  </section>
);
