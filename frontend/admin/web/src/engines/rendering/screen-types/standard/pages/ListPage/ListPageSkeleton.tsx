import React from "react";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import { Inline, Stack } from "@foundation/ui/web/Layout";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import styles from "./ListPageSkeleton.module.css";
import { ListFilterCardSkeleton } from "./ListFilterCardSkeleton";
import { ListTableSkeleton } from "./ListTableSkeleton";

export interface ListPageSkeletonProps {
  columnCount: number;
}

export const ListPageSkeleton: React.FC<ListPageSkeletonProps> = ({ columnCount }) => (
  <div aria-busy className={styles.page}>
    <SectionContainer atmosphere="transparent" usefulColumns={20} heightRecipe="auto">
      <Stack className={styles.content} gap="lg">
        <Inline className={styles.header} justify="between" wrap>
          <Stack className={styles.heading} gap="sm">
            <Skeleton shape="text" size="sm" width="sm" />
            <Skeleton shape="text" size="lg" width="md" />
          </Stack>
          <Skeleton size="lg" width="md" />
        </Inline>

        <ListFilterCardSkeleton />
        <ListTableSkeleton columnCount={columnCount} />
      </Stack>
    </SectionContainer>
  </div>
);
