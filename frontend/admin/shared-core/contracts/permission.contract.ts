import type { AdminPermission, AdminRole } from "../types/permission.types";

export interface AdminPermissionDto {
  key: string;
  name: string;
  description?: string | null;
}

export interface AdminRoleDto {
  key: string;
  name: string;
  permissions?: string[];
}

export type AdminPermissionView = AdminPermission;
export type AdminRoleView = AdminRole;

