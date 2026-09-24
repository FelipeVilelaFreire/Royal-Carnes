import React from "react";
import { Stack } from "@foundation/ui/web/Layout";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import styles from "./ListPageSkeleton.module.css";
import { ListFilterCardSkeleton } from "./ListFilterCardSkeleton";
import { ListPageHeaderSkeleton } from "./ListPageHeaderSkeleton";
import { ListTableSkeleton } from "./ListTableSkeleton";

export interface ListPageSkeletonProps {
  columnCount: number;
  filterCount: number;
}

export const ListPageSkeleton: React.FC<ListPageSkeletonProps> = ({ columnCount, filterCount }) => (
  <div aria-busy className={styles.page}>
    <SectionContainer atmosphere="transparent" usefulColumns={20} heightRecipe="auto">
      <Stack className={styles.content} gap="lg">
        <ListPageHeaderSkeleton />

        <ListFilterCardSkeleton filterCount={filterCount} />
        <ListTableSkeleton columnCount={columnCount} />
      </Stack>
    </SectionContainer>
  </div>
);
