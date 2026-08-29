import type { AdminUserListItemView } from "../contracts/user.contract";

export interface AdminUsersViewModel {
  users: AdminUserListItemView[];
  total: number;
  activeCount: number;
  inactiveCount: number;
}

export function createAdminUsersViewModel(
  users: AdminUserListItemView[],
): AdminUsersViewModel {
  return {
    users,
    total: users.length,
    activeCount: users.filter((user) => user.status === "active").length,
    inactiveCount: users.filter((user) => user.status === "inactive").length,
  };
}

