import React from "react";
import { Stack } from "@foundation/ui/web/Layout";
import type { ClientCustomerAccountViewModel } from "@royalprime/client/view-models/customer.view-model";
import type { ClientCustomerRecentOrder } from "@royalprime/client/contracts/customer.contract";
import type { MinhaContaStrings } from "../../types";
import { CycleUsageGrid, RecentOrdersPanel } from "../../components";

export function OverviewModule({
  onNavigate,
  orders,
  strings,
  viewModel,
}: {
  onNavigate?: (path: string) => void;
  orders: ClientCustomerRecentOrder[];
  strings: MinhaContaStrings;
  viewModel: ClientCustomerAccountViewModel;
}) {
  return (
    <Stack gap="lg">
      <CycleUsageGrid metrics={viewModel.usageMetrics} strings={strings} />
      <RecentOrdersPanel onNavigate={onNavigate} orders={orders.slice(0, 2)} strings={strings} />
    </Stack>
  );
}
