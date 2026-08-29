import type { ApiErrorEnvelope } from "../../../shared-core";
import type { ClientAuthSession } from "../contracts/auth.contract";

export interface ClientAuthViewModel {
  isAuthenticated: boolean;
  displayName: string;
  email: string | null;
  customerName: string | null;
  errorCode: string | null;
}

export function createClientAuthViewModel(
  session: ClientAuthSession | null,
  error?: ApiErrorEnvelope | null,
): ClientAuthViewModel {
  return {
    isAuthenticated: Boolean(session),
    displayName: session?.user.name || session?.user.email || "",
    email: session?.user.email || null,
    customerName: session?.user.customer?.name || null,
    errorCode: error?.code || null,
  };
}

