import { useMemo } from "react";
import {
  useClientAuthSession,
  type UseClientAuthSessionOptions,
} from "./useClientAuthSession";

export function useClientRegister(options: UseClientAuthSessionOptions = {}) {
  const auth = useClientAuthSession(options);

  return useMemo(
    () => ({
      isLoading: auth.isLoading,
      error: auth.error,
      register: auth.register,
    }),
    [auth.error, auth.isLoading, auth.register],
  );
}
