import type { ApiErrorEnvelope } from "../../../shared-core";
import type { ClientAuthSession } from "./auth.contract";

export interface ClientSessionState {
  session: ClientAuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApiErrorEnvelope | null;
}

