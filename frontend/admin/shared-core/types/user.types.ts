import type { OrganizationId, PermissionKey, RoleKey, UserId, UserStatus } from "../../../shared-core";

export interface AdminUserListItem {
  id: UserId;
  email: string;
  name: string;
  status: UserStatus;
  organizationId: OrganizationId;
  roleKeys: RoleKey[];
  permissionKeys: PermissionKey[];
}

export interface AdminUserDetail extends AdminUserListItem {
  createdAt?: string | null;
  updatedAt?: string | null;
  lastLoginAt?: string | null;
}

