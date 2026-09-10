import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import { createClientOrdersApi } from "../api/orders.api";
import type {
  ClientOrderConfigView,
  ClientOrderCreateInput,
  ClientOrderView,
} from "../contracts/orders.contract";
import { createClientOrdersViewModel } from "../view-models/orders.view-model";
import { useClientApiConfig } from "../runtime/ClientApiProvider";

type ClientOrdersApi = ReturnType<typeof createClientOrdersApi>;

export interface UseClientOrdersOptions {
  api?: ClientOrdersApi;
  initialConfig?: ClientOrderConfigView | null;
  initialOrders?: ClientOrderView[];
}

export function useClientOrders(options: UseClientOrdersOptions = {}) {
  const apiConfig = useClientApiConfig();
  const api = useMemo(() => options.api || createClientOrdersApi(apiConfig), [apiConfig, options.api]);
  const [config, setConfig] = useState<ClientOrderConfigView | null>(
    options.initialConfig || null,
  );
  const [orders, setOrders] = useState<ClientOrderView[]>(options.initialOrders || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);
  const [source, setSource] = useState<"api">("api");

  const loadConfig = useCallback(async () => {
    const nextConfig = await api.config();
    setConfig(nextConfig);
    return nextConfig;
  }, [api]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [nextConfig, nextOrders] = await Promise.all([api.config(), api.listMine()]);
      setConfig(nextConfig);
      setOrders(nextOrders);
      setSource("api");
      return { config: nextConfig, orders: nextOrders };
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const create = useCallback(
    async (input: ClientOrderCreateInput) => {
      setIsLoading(true);
      setError(null);
      try {
        const order = await api.create(input);
        setOrders((current) => [order, ...current]);
        setSource("api");
        return order;
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
      config,
      orders,
      viewModel: createClientOrdersViewModel(orders, config),
      isLoading,
      error,
      source,
      loadConfig,
      load,
      create,
    }),
    [config, create, error, isLoading, load, loadConfig, orders, source],
  );
}
