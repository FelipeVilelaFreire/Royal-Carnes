import { useMemo } from "react";
import type { AdminOrderCreateInput } from "../contracts/orders.contract";
import { createAdminOrderFormViewModel } from "../view-models/orders.view-model";

export function useAdminOrderForm(input: AdminOrderCreateInput) {
  return useMemo(() => createAdminOrderFormViewModel(input), [input]);
}
