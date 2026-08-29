"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getMyDeliveries } from "../api/deliveries.api";
import { prepareDeliveryViewModel, type PreparedDeliveryViewModel } from "../view-models/deliveries.view-model";

interface UseMyDeliveriesOptions {
  accessToken?: string | null;
}

export function useMyDeliveries(options: UseMyDeliveriesOptions = {}) {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"api" | "fallback">("fallback");

  const accessToken = useMemo(() => {
    if (options.accessToken !== undefined) return options.accessToken || "";
    if (typeof window === "undefined") return "";
    return localStorage.getItem("royal_prime_access_token") || "";
  }, [options.accessToken]);

  const requestOptions = useMemo(
    () => ({ accessToken, organizationSlug: "royalprime" }),
    [accessToken]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyDeliveries(requestOptions);
      setDeliveries(data);
      setSource("api");
    } catch (err) {
      setError(err instanceof Error ? err.message : "my_deliveries_error");
      setDeliveries([]);
      setSource("fallback");
    } finally {
      setLoading(false);
    }
  }, [requestOptions]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const viewModels: PreparedDeliveryViewModel[] = useMemo(
    () => deliveries.map((d) => prepareDeliveryViewModel(d)),
    [deliveries]
  );

  return {
    deliveries,
    viewModels,
    loading,
    error,
    source,
    refresh
  };
}
