import { useMemo } from "react";
import type { AdminInventoryItemFormInput } from "../contracts/inventory.contract";
import { createAdminInventoryItemFormViewModel } from "../view-models/inventory.view-model";

export function useAdminInventoryItemForm(input: AdminInventoryItemFormInput) {
  return useMemo(() => createAdminInventoryItemFormViewModel(input), [input]);
}
