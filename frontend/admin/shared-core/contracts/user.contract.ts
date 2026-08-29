import type { AdminUserDetail, AdminUserListItem } from "../types/user.types";

export interface AdminUserDto {
  id: string;
  email: string;
  name?: string | null;
  is_active?: boolean | null;
  organization_id?: string | null;
  roles?: string[];
  permissions?: string[];
  created_at?: string | null;
  updated_at?: string | null;
  last_login_at?: string | null;
}

export interface AdminUserListParams {
  search?: string;
  roleKey?: string;
  status?: "active" | "inactive";
}

export interface AdminUserFormInput {
  email: string;
  name: string;
  password?: string;
  roleKeys: string[];
  isActive?: boolean;
}

export type AdminUserListItemView = AdminUserListItem;
export type AdminUserDetailView = AdminUserDetail;

