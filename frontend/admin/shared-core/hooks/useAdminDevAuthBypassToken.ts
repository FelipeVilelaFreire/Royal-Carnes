import { useEffect, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import {
  ensureAdminDevAuthBypassAccessToken,
  type AdminDevAuthBypassOptions,
} from "../api/dev-auth-bypass.api";

export interface UseAdminDevAuthBypassTokenOptions {
  enabled: boolean;
  options: AdminDevAuthBypassOptions;
}

export interface UseAdminDevAuthBypassTokenResult {
  error: ApiErrorEnvelope | null;
  isLoading: boolean;
  token: string | null;
}

export function useAdminDevAuthBypassToken({
  enabled,
  options,
}: UseAdminDevAuthBypassTokenOptions): UseAdminDevAuthBypassTokenResult {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const stableOptions = useMemo(
    () => options,
    [options.baseUrl, options.credentials.email, options.credentials.password, options.organizationSlug],
  );

  useEffect(() => {
    let isActive = true;

    if (!enabled) {
      setIsLoading(false);
      setToken(null);
      setError(null);
      return () => {
        isActive = false;
      };
    }

    setIsLoading(true);
    ensureAdminDevAuthBypassAccessToken(stableOptions)
      .then((nextToken) => {
        if (!isActive) return;
        setToken(nextToken);
        setError(null);
      })
      .catch((err) => {
        if (!isActive) return;
        setToken(null);
        setError(normalizeApiError(err));
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [enabled, stableOptions]);

  return { error, isLoading, token };
}
