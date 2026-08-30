import { useMemo } from "react";
import {
  useAdminSubscriptions,
  type UseAdminSubscriptionsOptions,
} from "./useAdminSubscriptions";

export function useAdminPlans(options: UseAdminSubscriptionsOptions = {}) {
  const subscriptions = useAdminSubscriptions(options);

  return useMemo(
    () => ({
      plans: subscriptions.plans,
      rows: subscriptions.viewModel.plans,
      isLoading: subscriptions.isLoading,
      error: subscriptions.error,
      load: subscriptions.load,
      createPlan: subscriptions.createPlan,
    }),
    [
      subscriptions.createPlan,
      subscriptions.error,
      subscriptions.isLoading,
      subscriptions.load,
      subscriptions.plans,
      subscriptions.viewModel.plans,
    ],
  );
}
