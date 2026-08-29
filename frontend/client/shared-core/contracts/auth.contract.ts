import type {
  AuthCredentialsBase,
  AuthSessionBase,
  CurrentUserBase,
} from "../../../shared-core";
import type { ClientAuthSource } from "../types/auth.types";
import type { ClientCustomerProfile } from "../types/customer.types";

export interface ClientLoginInput extends AuthCredentialsBase {}

export interface ClientRegisterInput extends AuthCredentialsBase {
  name: string;
  phone?: string;
}

export interface ClientCurrentUser extends CurrentUserBase {
  customer?: ClientCustomerProfile | null;
}

export interface ClientAuthSession extends AuthSessionBase {
  user: ClientCurrentUser;
  source: ClientAuthSource;
}

export interface ClientLoginResponseDto {
  access: string;
  refresh?: string | null;
  user: {
    id: string | number;
    email: string;
    name?: string | null;
  };
  memberships?: Array<{
    organization?: {
      id: string | number;
      slug: string;
    };
    organization_slug?: string;
    role_key?: string;
    status?: string;
  }>;
  permissions?: Record<string, string[]>;
}

export interface ClientRegisterResponseDto {
  id: string | number;
  email: string;
  name?: string | null;
  phone?: string | null;
  is_active?: boolean | null;
}

export interface ClientRegisterResult {
  user: ClientCurrentUser;
  source: "api";
}
