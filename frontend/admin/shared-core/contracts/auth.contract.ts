import type {
  AuthCredentialsBase,
  AuthSessionBase,
  CurrentUserBase,
  OrganizationMembershipBase,
} from "../../../shared-core";
import type { AdminAuthSource } from "../types/auth.types";

export interface AdminLoginInput extends AuthCredentialsBase {}

export interface AdminCurrentUser extends CurrentUserBase {
  memberships: OrganizationMembershipBase[];
  activeMembership?: OrganizationMembershipBase | null;
}

export interface AdminAuthSession extends AuthSessionBase {
  user: AdminCurrentUser;
  source: AdminAuthSource;
}

export interface AdminLoginResponseDto {
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

export type AdminMeResponseDto = Omit<AdminLoginResponseDto, "access" | "refresh">;
