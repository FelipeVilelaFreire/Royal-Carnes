import type { CurrentUserBase } from "./identity.contract";
import type { TenantContext } from "../types/organization.types";

export interface AuthTokenShape {
  accessToken: string;
  refreshToken?: string | null;
}

export interface AuthSessionBase {
  user: CurrentUserBase;
  token: AuthTokenShape;
  tenant: TenantContext;
}

export interface AuthCredentialsBase {
  email: string;
  password: string;
}

export type AuthErrorCode =
  | "invalid_credentials"
  | "inactive_user"
  | "organization_required"
  | "permission_denied"
  | "network_error"
  | "unknown_error";

