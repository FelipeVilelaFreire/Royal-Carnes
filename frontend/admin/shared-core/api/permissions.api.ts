import type { ApiClientConfig } from "../../../shared-core";
import type { AdminPermissionView, AdminRoleView } from "../contracts/permission.contract";
import { createAdminAuthApi } from "./auth.api";

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

export function createAdminPermissionsApi(config: ApiClientConfig = {}) {
  const authApi = createAdminAuthApi(config);

  return {
    async listRoles(): Promise<AdminRoleView[]> {
      const session = await authApi.me();
      const membership = session.user.activeMembership;
      if (!membership) return [];
      return membership.roleKeys.map((roleKey) => ({
        key: roleKey,
        name: roleKey,
        permissionKeys: membership.permissionKeys,
      }));
    },
    async listPermissions(): Promise<AdminPermissionView[]> {
      const session = await authApi.me();
      const permissionKeys = session.user.activeMembership?.permissionKeys || [];
      return permissionKeys.map((permissionKey) => ({
        key: permissionKey,
        name: permissionKey,
        description: null,
      }));
    },
  };
}

export const adminPermissionsApi = createAdminPermissionsApi();
