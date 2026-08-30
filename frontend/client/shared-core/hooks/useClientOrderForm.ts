import { useMemo } from "react";
import type { ClientOrderCreateInput } from "../contracts/orders.contract";
import { createClientOrderFormViewModel } from "../view-models/orders.view-model";

export function useClientOrderForm(input: ClientOrderCreateInput) {
  return useMemo(() => createClientOrderFormViewModel(input), [input]);
}
