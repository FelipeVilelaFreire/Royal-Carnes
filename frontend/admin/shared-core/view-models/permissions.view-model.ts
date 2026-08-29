import type { AdminPermissionView, AdminRoleView } from "../contracts/permission.contract";

export interface AdminPermissionsViewModel {
  roles: AdminRoleView[];
  permissions: AdminPermissionView[];
}

export function createAdminPermissionsViewModel(
  roles: AdminRoleView[],
  permissions: AdminPermissionView[],
): AdminPermissionsViewModel {
  return {
    roles,
    permissions,
  };
}

