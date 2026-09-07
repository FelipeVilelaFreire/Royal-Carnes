import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import {
  clientSubscriptionsApi,
  type createClientSubscriptionsApi,
} from "../api/subscriptions.api";
import type { ClientSubscriptionView } from "../contracts/subscriptions.contract";
import { subscriptionsFallbackDataSource } from "../data-sources/subscriptions.fallback";
import { createClientSubscriptionViewModel } from "../view-models/subscriptions.view-model";

type ClientSubscriptionsApi = ReturnType<typeof createClientSubscriptionsApi>;

export interface UseClientSubscriptionOptions {
  api?: ClientSubscriptionsApi;
  fallbackOnError?: boolean;
  initialSubscription?: ClientSubscriptionView | null;
}

export function useClientSubscription(options: UseClientSubscriptionOptions = {}) {
  const api = options.api || clientSubscriptionsApi;
  const [subscription, setSubscription] = useState<ClientSubscriptionView | null>(
    options.initialSubscription || subscriptionsFallbackDataSource.subscription,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);
  const [source, setSource] = useState<"api" | "fallback">("fallback");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const nextSubscription = await api.me();
      setSubscription(nextSubscription);
      setSource("api");
      return nextSubscription;
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized);
      if (options.fallbackOnError !== false) {
        setSubscription(subscriptionsFallbackDataSource.subscription);
        setSource("fallback");
        return subscriptionsFallbackDataSource.subscription;
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api, options.fallbackOnError]);

  return useMemo(
    () => ({
      subscription,
      viewModel: createClientSubscriptionViewModel(subscription),
      isLoading,
      error,
      source,
      load,
    }),
    [error, isLoading, load, source, subscription],
  );
}
