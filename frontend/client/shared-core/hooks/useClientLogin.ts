import { useMemo } from "react";
import {
  useClientAuthSession,
  type UseClientAuthSessionOptions,
} from "./useClientAuthSession";

export function useClientLogin(options: UseClientAuthSessionOptions = {}) {
  const auth = useClientAuthSession(options);

  return useMemo(
    () => ({
      session: auth.session,
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      error: auth.error,
      login: auth.login,
    }),
    [auth.error, auth.isAuthenticated, auth.isLoading, auth.login, auth.session],
  );
}
