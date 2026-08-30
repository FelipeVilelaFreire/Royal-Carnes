import type {
  CustomerId,
  PermissionKey,
  RoleKey,
  UserId,
  UserStatus,
} from "../types/identity.types";
import type {
  OrganizationId,
  OrganizationSlug,
} from "../types/organization.types";

export interface CurrentUserBase {
  id: UserId;
  email: string;
  name?: string | null;
  phone?: string | null;
  status?: UserStatus;
}

export interface OrganizationMembershipBase {
  organizationId: OrganizationId;
  organizationSlug: OrganizationSlug;
  roleKeys: RoleKey[];
  permissionKeys: PermissionKey[];
}

export interface CustomerIdentityBase {
  id: CustomerId;
  userId: UserId;
  organizationId: OrganizationId;
}
