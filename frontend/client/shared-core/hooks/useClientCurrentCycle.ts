import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import {
  clientSubscriptionsApi,
  type createClientSubscriptionsApi,
} from "../api/subscriptions.api";
import type {
  ClientCycleItemSelectionInput,
  ClientSubscriptionCycleView,
} from "../contracts/subscriptions.contract";
import { subscriptionsFallbackDataSource } from "../data-sources/subscriptions.fallback";
import { createClientCycleViewModel } from "../view-models/subscriptions.view-model";

type ClientSubscriptionsApi = ReturnType<typeof createClientSubscriptionsApi>;

export interface UseClientCurrentCycleOptions {
  api?: ClientSubscriptionsApi;
  fallbackOnError?: boolean;
  initialCycle?: ClientSubscriptionCycleView | null;
}

export function useClientCurrentCycle(options: UseClientCurrentCycleOptions = {}) {
  const api = options.api || clientSubscriptionsApi;
  const [cycle, setCycle] = useState<ClientSubscriptionCycleView | null>(
    options.initialCycle || subscriptionsFallbackDataSource.cycle,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);
  const [source, setSource] = useState<"api" | "fallback">("fallback");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const nextCycle = await api.currentCycle();
      setCycle(nextCycle);
      setSource("api");
      return nextCycle;
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized);
      if (options.fallbackOnError !== false) {
        setCycle(subscriptionsFallbackDataSource.cycle);
        setSource("fallback");
        return subscriptionsFallbackDataSource.cycle;
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api, options.fallbackOnError]);

  const selectItem = useCallback(
    async (input: ClientCycleItemSelectionInput) => {
      setIsLoading(true);
      setError(null);
      try {
        const item = await api.selectCurrentCycleItem(input);
        setCycle((current) =>
          current
            ? {
                ...current,
                items: [item, ...current.items.filter((existing) => existing.id !== item.id)],
              }
            : current,
        );
        setSource("api");
        return item;
      } catch (err) {
        const normalized = normalizeApiError(err);
        setError(normalized);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [api],
  );

  return useMemo(
    () => ({
      cycle,
      viewModel: createClientCycleViewModel(cycle),
      isLoading,
      error,
      source,
      load,
      selectItem,
    }),
    [cycle, error, isLoading, load, selectItem, source],
  );
}
