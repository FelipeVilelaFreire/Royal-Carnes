import React from "react";
import type { AdminStandardDetailLineItemsSectionViewModel } from "@/view-models/standard.view-model";
import { DetailSectionCardSkeleton } from "../DetailSectionCardSkeleton";
import { DetailLineItemsTableSkeleton } from "./DetailLineItemsTableSkeleton";

export const DetailLineItemsSectionSkeleton: React.FC<{ section: AdminStandardDetailLineItemsSectionViewModel }> = ({ section }) => {
  return (
    <DetailSectionCardSkeleton hasTitle={Boolean(section.titleKey)}>
      <DetailLineItemsTableSkeleton section={section} />
    </DetailSectionCardSkeleton>
  );
};
