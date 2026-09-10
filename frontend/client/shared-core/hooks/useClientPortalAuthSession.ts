import { useMemo } from "react";
import type { ApiClientConfig } from "../../../shared-core";
import { createClientAuthApi } from "../api/auth.api";
import type { ClientAuthSession } from "../contracts/auth.contract";
import type { ClientAuthStorage } from "../types/auth.types";
import { useClientAuthSession } from "./useClientAuthSession";

export interface UseClientPortalAuthSessionOptions {
  apiConfig?: ApiClientConfig;
  initialSession?: ClientAuthSession | null;
  storage?: ClientAuthStorage;
}

function readStoredSession(storage?: ClientAuthStorage): ClientAuthSession | null {
  const raw = storage?.read();
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ClientAuthSession;
  } catch {
    storage?.clear();
    return null;
  }
}

export function useClientPortalAuthSession(options: UseClientPortalAuthSessionOptions = {}) {
  const api = useMemo(() => createClientAuthApi(options.apiConfig), [options.apiConfig]);
  const initialSession = useMemo(
    () => options.initialSession || readStoredSession(options.storage),
    [options.initialSession, options.storage],
  );

  return useClientAuthSession({
    api,
    initialSession,
    storage: options.storage,
  });
}
