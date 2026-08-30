import { useCallback, useMemo, useState } from "react";
import { normalizeApiError, type ApiErrorEnvelope } from "../../../shared-core";
import type {
  ClientAuthSession,
  ClientLoginInput,
  ClientRegisterInput,
} from "../contracts/auth.contract";
import type { ClientAuthStorage } from "../types/auth.types";
import { clientAuthApi, type createClientAuthApi } from "../api/auth.api";

type ClientAuthApi = ReturnType<typeof createClientAuthApi>;

export interface UseClientAuthSessionOptions {
  api?: ClientAuthApi;
  storage?: ClientAuthStorage;
  initialSession?: ClientAuthSession | null;
}

export function useClientAuthSession(options: UseClientAuthSessionOptions = {}) {
  const api = options.api || clientAuthApi;
  const [session, setSession] = useState<ClientAuthSession | null>(
    options.initialSession || null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiErrorEnvelope | null>(null);

  const persist = useCallback(
    (nextSession: ClientAuthSession | null) => {
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
    async (input: ClientLoginInput) => {
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

  const loadCurrentSession = useCallback(
    async (accessToken = session?.token.accessToken || "") => {
      setIsLoading(true);
      setError(null);
      try {
        const nextSession = await api.me(accessToken);
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
    [api, persist, session],
  );

  const refresh = useCallback(
    async (refreshToken = session?.token.refreshToken || "") => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await api.refresh({ refreshToken });
        const nextSession = session
          ? {
              ...session,
              token: result.token,
            }
          : null;
        persist(nextSession);
        return result;
      } catch (err) {
        const normalized = normalizeApiError(err);
        setError(normalized);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [api, persist, session],
  );

  const register = useCallback(
    async (input: ClientRegisterInput) => {
      setIsLoading(true);
      setError(null);
      try {
        return await api.register(input);
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
      loadCurrentSession,
      refresh,
      register,
      logout,
    }),
    [error, isLoading, loadCurrentSession, login, logout, refresh, register, session],
  );
}
