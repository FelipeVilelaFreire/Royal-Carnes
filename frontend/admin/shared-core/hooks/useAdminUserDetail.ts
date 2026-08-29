import { useMemo } from "react";
import type { AdminUserDetailView } from "../contracts/user.contract";

export function useAdminUserDetail(user: AdminUserDetailView | null) {
  return useMemo(
    () => ({
      user,
      isActive: user?.status === "active",
      roleKeys: user?.roleKeys || [],
      permissionKeys: user?.permissionKeys || [],
    }),
    [user],
  );
}

