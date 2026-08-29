import type { ApiErrorEnvelope } from "../../../shared-core";
import type { AdminAuthSession } from "../contracts/auth.contract";

export interface AdminAuthViewModel {
  isAuthenticated: boolean;
  displayName: string;
  email: string | null;
  roleKeys: string[];
  permissionKeys: string[];
  errorCode: string | null;
}

export function createAdminAuthViewModel(
  session: AdminAuthSession | null,
  error?: ApiErrorEnvelope | null,
): AdminAuthViewModel {
  return {
    isAuthenticated: Boolean(session),
    displayName: session?.user.name || session?.user.email || "",
    email: session?.user.email || null,
    roleKeys: session?.user.activeMembership?.roleKeys || [],
    permissionKeys: session?.user.activeMembership?.permissionKeys || [],
    errorCode: error?.code || null,
  };
}

