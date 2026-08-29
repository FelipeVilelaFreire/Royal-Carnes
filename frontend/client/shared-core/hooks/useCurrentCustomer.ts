import { useMemo } from "react";
import type { ClientAuthSession } from "../contracts/auth.contract";
import { createClientCustomerViewModel } from "../view-models/customer.view-model";

export function useCurrentCustomer(session: ClientAuthSession | null) {
  return useMemo(() => {
    const customer = session?.user.customer || null;
    return {
      customer,
      viewModel: createClientCustomerViewModel(customer),
    };
  }, [session]);
}

