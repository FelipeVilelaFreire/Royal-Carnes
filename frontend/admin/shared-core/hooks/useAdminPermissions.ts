import { useMemo } from "react";
import type { AdminAuthSession } from "../contracts/auth.contract";
import { hasAdminPermission } from "../mappers/permissions.mapper";

export function useAdminPermissions(session: AdminAuthSession | null) {
  return useMemo(() => {
    const permissionKeys = session?.user.activeMembership?.permissionKeys || [];
    const roleKeys = session?.user.activeMembership?.roleKeys || [];

    return {
      permissionKeys,
      roleKeys,
      hasPermission: (permissionKey: string) =>
        hasAdminPermission(permissionKeys, permissionKey),
    };
  }, [session]);
}

