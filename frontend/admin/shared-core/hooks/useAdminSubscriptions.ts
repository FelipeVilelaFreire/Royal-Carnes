import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import {
  adminSubscriptionsApi,
  type createAdminSubscriptionsApi,
} from "../api/subscriptions.api";
import type {
  AdminPlanFormInput,
  AdminPlanView,
  AdminSubscriptionCycleView,
  AdminSubscriptionFormInput,
  AdminSubscriptionView,
} from "../contracts/subscriptions.contract";
import { createAdminSubscriptionsViewModel } from "../view-models/subscriptions.view-model";

type AdminSubscriptionsApi = ReturnType<typeof createAdminSubscriptionsApi>;

export interface UseAdminSubscriptionsOptions {
  api?: AdminSubscriptionsApi;
  initialPlans?: AdminPlanView[];
  initialSubscriptions?: AdminSubscriptionView[];
  initialCycles?: AdminSubscriptionCycleView[];
}

export function useAdminSubscriptions(options: UseAdminSubscriptionsOptions = {}) {
  const api = options.api || adminSubscriptionsApi;
  const [plans, setPlans] = useState<AdminPlanView[]>(options.initialPlans || []);
  const [subscriptions, setSubscriptions] = useState<AdminSubscriptionView[]>(
    options.initialSubscriptions || [],
  );
  const [cycles, setCycles] = useState<AdminSubscriptionCycleView[]>(
    options.initialCycles || [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [nextPlans, nextSubscriptions, nextCycles] = await Promise.all([
        api.listPlans(),
        api.listSubscriptions(),
        api.listCycles(),
      ]);
      setPlans(nextPlans);
      setSubscriptions(nextSubscriptions);
      setCycles(nextCycles);
      return {
        plans: nextPlans,
        subscriptions: nextSubscriptions,
        cycles: nextCycles,
      };
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const createPlan = useCallback(
    async (input: AdminPlanFormInput) => {
      setIsLoading(true);
      setError(null);
      try {
        const plan = await api.createPlan(input);
        setPlans((current) => [plan, ...current]);
        return plan;
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

  const createSubscription = useCallback(
    async (input: AdminSubscriptionFormInput) => {
      setIsLoading(true);
      setError(null);
      try {
        const subscription = await api.createSubscription(input);
        setSubscriptions((current) => [subscription, ...current]);
        return subscription;
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
      plans,
      subscriptions,
      cycles,
      viewModel: createAdminSubscriptionsViewModel({ plans, subscriptions, cycles }),
      isLoading,
      error,
      load,
      createPlan,
      createSubscription,
    }),
    [createPlan, createSubscription, cycles, error, isLoading, load, plans, subscriptions],
  );
}
