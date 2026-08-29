import type { ApiErrorEnvelope } from "../../../shared-core";
import type { AdminAuthSession } from "./auth.contract";

export interface AdminSessionState {
  session: AdminAuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApiErrorEnvelope | null;
}

