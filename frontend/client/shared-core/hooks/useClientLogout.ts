import { useMemo } from "react";
import {
  useClientAuthSession,
  type UseClientAuthSessionOptions,
} from "./useClientAuthSession";

export function useClientLogout(options: UseClientAuthSessionOptions = {}) {
  const auth = useClientAuthSession(options);

  return useMemo(
    () => ({
      isLoading: auth.isLoading,
      error: auth.error,
      logout: auth.logout,
    }),
    [auth.error, auth.isLoading, auth.logout],
  );
}
