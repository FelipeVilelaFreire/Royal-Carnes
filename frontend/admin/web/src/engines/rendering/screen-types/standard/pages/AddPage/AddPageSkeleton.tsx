import React from "react";
import { Stack } from "@foundation/ui/web/Layout";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import type { AdminStandardFormViewModel } from "@/view-models/standard.view-model";
import { AddPageFormSkeleton } from "./AddPageFormSkeleton";
import { AddPageHeaderSkeleton } from "./AddPageHeaderSkeleton";
import styles from "./AddPageSkeleton.module.css";

export const AddPageSkeleton: React.FC<{ viewModel: AdminStandardFormViewModel }> = ({ viewModel }) => (
  <div aria-busy className={styles.page}>
    <SectionContainer atmosphere="transparent" usefulColumns={20} heightRecipe="auto">
      <Stack className={styles.content} gap="lg">
        <AddPageHeaderSkeleton />
        <AddPageFormSkeleton viewModel={viewModel} />
      </Stack>
    </SectionContainer>
  </div>
);
