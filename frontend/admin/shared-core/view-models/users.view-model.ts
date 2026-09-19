import type { AdminUserListItemView } from "../contracts/user.contract";

export interface AdminUsersViewModel {
  users: Array<AdminUserListItemView & { statusTone: "success" | "danger" }>;
  total: number;
  activeCount: number;
  inactiveCount: number;
}

export function createAdminUsersViewModel(
  users: AdminUserListItemView[],
): AdminUsersViewModel {
  return {
    users: users.map((user) => ({
      ...user,
      statusTone: user.status === "active" ? "success" : "danger",
    })),
    total: users.length,
    activeCount: users.filter((user) => user.status === "active").length,
    inactiveCount: users.filter((user) => user.status === "inactive").length,
  };
}
