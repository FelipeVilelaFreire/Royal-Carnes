import { useMemo, useState } from "react";
import type { AdminPlanFormInput } from "../contracts/subscriptions.contract";
import { createAdminPlanFormViewModel } from "../view-models/subscriptions.view-model";

export function useAdminPlanForm(initialInput?: Partial<AdminPlanFormInput>) {
  const [input, setInput] = useState<AdminPlanFormInput>({
    key: initialInput?.key || "",
    name: initialInput?.name || "",
    description: initialInput?.description || "",
    billingInterval: initialInput?.billingInterval || "month",
    priceCents: initialInput?.priceCents,
    entitlements: initialInput?.entitlements || [],
  });

  return useMemo(
    () => ({
      input,
      setInput,
      viewModel: createAdminPlanFormViewModel(input),
    }),
    [input],
  );
}
