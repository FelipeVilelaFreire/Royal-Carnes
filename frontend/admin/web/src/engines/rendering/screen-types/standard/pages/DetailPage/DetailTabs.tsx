import React from "react";
import { SegmentedControl } from "@foundation/ui/web/SegmentedControl";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardDetailViewModel } from "@/view-models/standard.view-model";

interface DetailTabsProps {
  onChange: (tab: string) => void;
  t: AdminTranslate;
  viewModel: AdminStandardDetailViewModel;
}

export const DetailTabs: React.FC<DetailTabsProps> = ({ onChange, t, viewModel }) => (
  <SegmentedControl
    items={viewModel.tabs.map((tab) => ({ key: tab.id, label: t(tab.labelKey) }))}
    level="md"
    onChange={onChange}
    value={viewModel.activeTab}
    variant="underline"
    width="full"
  />
);
