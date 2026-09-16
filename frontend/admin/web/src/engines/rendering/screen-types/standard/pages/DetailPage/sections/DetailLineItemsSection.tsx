import React from "react";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardDetailEntryViewModel, AdminStandardDetailLineItemsSectionViewModel } from "@/view-models/standard.view-model";
import { DetailSectionCard } from "../DetailSectionCard";

interface DetailLineItemsSectionProps {
  renderEntry: (entry: AdminStandardDetailEntryViewModel) => React.ReactNode;
  section: AdminStandardDetailLineItemsSectionViewModel;
  t: AdminTranslate;
}

export const DetailLineItemsSection: React.FC<DetailLineItemsSectionProps> = ({ renderEntry, section, t }) => (
  <DetailSectionCard section={section} t={t}>
    {renderEntry(section.entry)}
  </DetailSectionCard>
);
