import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import {
  clientSubscriptionsApi,
  type createClientSubscriptionsApi,
} from "../api/subscriptions.api";
import type { ClientSubscriptionView } from "../contracts/subscriptions.contract";
import { createClientSubscriptionViewModel } from "../view-models/subscriptions.view-model";

type ClientSubscriptionsApi = ReturnType<typeof createClientSubscriptionsApi>;

export interface UseClientSubscriptionOptions {
  api?: ClientSubscriptionsApi;
  initialSubscription?: ClientSubscriptionView | null;
}

export function useClientSubscription(options: UseClientSubscriptionOptions = {}) {
  const api = options.api || clientSubscriptionsApi;
  const [subscription, setSubscription] = useState<ClientSubscriptionView | null>(
    options.initialSubscription || null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const nextSubscription = await api.me();
      setSubscription(nextSubscription);
      return nextSubscription;
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
      subscription,
      viewModel: createClientSubscriptionViewModel(subscription),
      isLoading,
      error,
      load,
    }),
    [error, isLoading, load, subscription],
  );
}
