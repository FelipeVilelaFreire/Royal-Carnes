import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import {
  clientSubscriptionsApi,
  type createClientSubscriptionsApi,
} from "../api/subscriptions.api";
import type { ClientPlanView } from "../contracts/subscriptions.contract";
import { createClientPlansViewModel } from "../view-models/subscriptions.view-model";

type ClientSubscriptionsApi = ReturnType<typeof createClientSubscriptionsApi>;

export interface UseClientPlansOptions {
  api?: ClientSubscriptionsApi;
  initialPlans?: ClientPlanView[];
}

export function useClientPlans(options: UseClientPlansOptions = {}) {
  const api = options.api || clientSubscriptionsApi;
  const [plans, setPlans] = useState<ClientPlanView[]>(options.initialPlans || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const nextPlans = await api.listPlans();
      setPlans(nextPlans);
      return nextPlans;
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  return useMemo(
    () => ({
      plans,
      viewModel: createClientPlansViewModel(plans),
      isLoading,
      error,
      load,
    }),
    [error, isLoading, load, plans],
  );
}
