import { useMemo } from "react";
import {
  useAdminAuthSession,
  type UseAdminAuthSessionOptions,
} from "./useAdminAuthSession";

export function useAdminLogout(options: UseAdminAuthSessionOptions = {}) {
  const auth = useAdminAuthSession(options);

  return useMemo(
    () => ({
      isLoading: auth.isLoading,
      error: auth.error,
      logout: auth.logout,
    }),
    [auth.error, auth.isLoading, auth.logout],
  );
}
