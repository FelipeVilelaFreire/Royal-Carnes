"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addCurrentCycleItem,
  getMyCurrentCycle,
  getMySubscription,
  getSubscriptionPlans
} from "../api/subscriptions.api";
import type {
  AddCurrentCycleItemInput,
  CustomerSubscription,
  SubscriptionCycle,
  SubscriptionCycleItem,
  SubscriptionPlan
} from "../contracts/subscription.contract";

interface UseSubscriptionOptions {
  organizationSlug?: string;
  accessToken?: string | null;
}

export function useSubscription(options: UseSubscriptionOptions = {}) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscription, setSubscription] = useState<CustomerSubscription | null>(null);
  const [currentCycle, setCurrentCycle] = useState<SubscriptionCycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"api" | "fallback">("fallback");

  const accessToken = useMemo(() => {
    if (options.accessToken !== undefined) return options.accessToken || "";
    if (typeof window === "undefined") return "";
    return localStorage.getItem("royal_prime_access_token") || "";
  }, [options.accessToken]);

  const requestOptions = useMemo(
    () => ({
      accessToken,
      organizationSlug: options.organizationSlug || "royalprime"
    }),
    [accessToken, options.organizationSlug]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const nextPlans = await getSubscriptionPlans(requestOptions);
      setPlans(nextPlans);
      if (accessToken) {
        const [subscriptionResponse, cycleResponse] = await Promise.all([
          getMySubscription(requestOptions),
          getMyCurrentCycle(requestOptions)
        ]);
        setSubscription(subscriptionResponse.subscription);
        setCurrentCycle(cycleResponse.cycle);
      }
      setSource("api");
    } catch (err) {
      setError(err instanceof Error ? err.message : "subscriptions_api_error");
      setSource("fallback");
    } finally {
      setLoading(false);
    }
  }, [accessToken, requestOptions]);

  const addItem = useCallback(
    async (input: AddCurrentCycleItemInput): Promise<SubscriptionCycleItem> => {
      const item = await addCurrentCycleItem(input, requestOptions);
      await refresh();
      return item;
    },
    [refresh, requestOptions]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    plans,
    subscription,
    currentCycle,
    loading,
    error,
    source,
    refresh,
    addItem
  };
}
