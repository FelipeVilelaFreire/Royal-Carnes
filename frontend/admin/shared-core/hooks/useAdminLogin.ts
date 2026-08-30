import { useMemo } from "react";
import {
  useAdminAuthSession,
  type UseAdminAuthSessionOptions,
} from "./useAdminAuthSession";

export function useAdminLogin(options: UseAdminAuthSessionOptions = {}) {
  const auth = useAdminAuthSession(options);

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
