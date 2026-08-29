import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import type { AdminAuthSession, AdminLoginInput } from "../contracts/auth.contract";
import type { AdminAuthStorage } from "../types/auth.types";
import { adminAuthApi, type createAdminAuthApi } from "../api/auth.api";

type AdminAuthApi = ReturnType<typeof createAdminAuthApi>;

export interface UseAdminAuthSessionOptions {
  api?: AdminAuthApi;
  storage?: AdminAuthStorage;
  initialSession?: AdminAuthSession | null;
}

export function useAdminAuthSession(options: UseAdminAuthSessionOptions = {}) {
  const api = options.api || adminAuthApi;
  const [session, setSession] = useState<AdminAuthSession | null>(
    options.initialSession || null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const persist = useCallback(
    (nextSession: AdminAuthSession | null) => {
      setSession(nextSession);
      if (!options.storage) return;
      if (nextSession) {
        options.storage.save(JSON.stringify(nextSession));
      } else {
        options.storage.clear();
      }
    },
    [options.storage],
  );

  const login = useCallback(
    async (input: AdminLoginInput) => {
      setIsLoading(true);
      setError(null);
      try {
        const nextSession = await api.login(input);
        persist(nextSession);
        return nextSession;
      } catch (err) {
        const normalized = normalizeApiError(err);
        setError(normalized);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [api, persist],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await api.logout();
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      persist(null);
      setIsLoading(false);
    }
  }, [api, persist]);

  return useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      isLoading,
      error,
      login,
      logout,
    }),
    [error, isLoading, login, logout, session],
  );
}

