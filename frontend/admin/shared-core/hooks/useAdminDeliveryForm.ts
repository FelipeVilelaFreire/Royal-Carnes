import { useMemo } from "react";
import type { AdminDeliveryCreateInput } from "../contracts/deliveries.contract";
import { createAdminDeliveryCreateFormViewModel } from "../view-models/deliveries.view-model";

export function useAdminDeliveryForm(input: AdminDeliveryCreateInput) {
  return useMemo(() => createAdminDeliveryCreateFormViewModel(input), [input]);
}
