import { useMemo } from "react";
import {
  useAdminSubscriptions,
  type UseAdminSubscriptionsOptions,
} from "./useAdminSubscriptions";

export function useAdminSubscriptionCycles(options: UseAdminSubscriptionsOptions = {}) {
  const subscriptions = useAdminSubscriptions(options);

  return useMemo(
    () => ({
      cycles: subscriptions.cycles,
      rows: subscriptions.viewModel.cycles,
      isLoading: subscriptions.isLoading,
      error: subscriptions.error,
      load: subscriptions.load,
    }),
    [
      subscriptions.cycles,
      subscriptions.error,
      subscriptions.isLoading,
      subscriptions.load,
      subscriptions.viewModel.cycles,
    ],
  );
}
