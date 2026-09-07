import type { ClientOrderRowViewModel } from "@royalprime/client/view-models/orders.view-model";

export type PreparedTimelineStep = ClientOrderRowViewModel["timelineSteps"][number];
export type PreparedOrderViewModel = ClientOrderRowViewModel;

export function prepareMockOrderViewModel(order: ClientOrderRowViewModel): PreparedOrderViewModel {
  return order;
}
