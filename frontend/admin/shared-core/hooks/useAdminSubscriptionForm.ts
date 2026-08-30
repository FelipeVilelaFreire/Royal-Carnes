import { useMemo, useState } from "react";
import type { AdminSubscriptionFormInput } from "../contracts/subscriptions.contract";
import { createAdminSubscriptionFormViewModel } from "../view-models/subscriptions.view-model";

export function useAdminSubscriptionForm(initialInput?: Partial<AdminSubscriptionFormInput>) {
  const [input, setInput] = useState<AdminSubscriptionFormInput>({
    customerId: initialInput?.customerId || "",
    planKey: initialInput?.planKey || "",
    status: initialInput?.status || "active",
    startedAt: initialInput?.startedAt ?? null,
  });

  return useMemo(
    () => ({
      input,
      setInput,
      viewModel: createAdminSubscriptionFormViewModel(input),
    }),
    [input],
  );
}
