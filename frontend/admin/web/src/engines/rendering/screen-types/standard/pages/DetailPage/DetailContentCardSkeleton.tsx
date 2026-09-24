import React from "react";
import { FieldGrid, FieldGridItem } from "@foundation/ui/web/FieldGrid";
import { Stack } from "@foundation/ui/web/Layout";
import type { AdminStandardDetailViewModel } from "@/view-models/standard.view-model";
import { DetailDataFieldSkeleton } from "./DetailDataFieldSkeleton";
import { DetailSectionCardSkeleton } from "./DetailSectionCardSkeleton";
import { DetailFieldsSectionSkeleton } from "./sections/DetailFieldsSectionSkeleton";
import { DetailLineItemsSectionSkeleton } from "./sections/DetailLineItemsSectionSkeleton";

export const DetailContentCardSkeleton: React.FC<{ viewModel: AdminStandardDetailViewModel }> = ({ viewModel }) => (
  <Stack gap="xl">
    {viewModel.sections.length ? viewModel.sections.map((section) => (
      section.type === "lineItems"
        ? <DetailLineItemsSectionSkeleton key={section.key} section={section} />
        : <DetailFieldsSectionSkeleton key={section.key} section={section} />
    )) : (
      <DetailSectionCardSkeleton hasTitle>
        <FieldGrid columns={4} density="regular" gap="lg">
          {Array.from({ length: 8 }).map((_, index) => (
            <FieldGridItem key={index}>
              <DetailDataFieldSkeleton />
            </FieldGridItem>
          ))}
        </FieldGrid>
      </DetailSectionCardSkeleton>
    )}
  </Stack>
);
