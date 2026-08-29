import type { PermissionKey, RoleKey } from "../../../shared-core";

export interface AdminPermission {
  key: PermissionKey;
  name: string;
  description?: string | null;
}

export interface AdminRole {
  key: RoleKey;
  name: string;
  permissionKeys: PermissionKey[];
}

