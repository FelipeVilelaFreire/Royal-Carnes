import React from "react";
import { Stack } from "@foundation/ui/web/Layout";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import type { AdminStandardDetailViewModel } from "@/view-models/standard.view-model";
import { DetailContentCardSkeleton } from "./DetailContentCardSkeleton";
import { DetailHeaderSkeleton } from "./DetailHeaderSkeleton";
import { DetailQuickInfoSkeleton } from "./DetailQuickInfoSkeleton";
import { DetailTabsSkeleton } from "./DetailTabsSkeleton";
import styles from "./DetailPageSkeleton.module.css";

export interface DetailPageSkeletonProps {
  hasDeleteAction: boolean;
  hasEditAction: boolean;
  viewModel: AdminStandardDetailViewModel;
}

export const DetailPageSkeleton: React.FC<DetailPageSkeletonProps> = ({ hasDeleteAction, hasEditAction, viewModel }) => (
  <div aria-busy className={styles.page}>
    <SectionContainer atmosphere="transparent" usefulColumns={20} heightRecipe="auto">
      <Stack className={styles.content} gap="lg">
        <DetailHeaderSkeleton hasDeleteAction={hasDeleteAction} hasEditAction={hasEditAction} hasStatus={Boolean(viewModel.headerStatus)} metaCount={viewModel.headerMeta.length} />
        <Stack className={styles.tabbedContent} gap="md">
          <DetailQuickInfoSkeleton count={viewModel.quickInfo.length} />
          <DetailTabsSkeleton count={viewModel.tabs.length} />
          <DetailContentCardSkeleton viewModel={viewModel} />
        </Stack>
      </Stack>
    </SectionContainer>
  </div>
);
