import type {
  AdminUserDetailView,
  AdminUserDto,
  AdminUserListItemView,
} from "../contracts/user.contract";

export function mapAdminUserDto(dto: AdminUserDto): AdminUserListItemView {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name || dto.email,
    status: dto.is_active === false ? "inactive" : "active",
    organizationId: dto.organization_id || "",
    roleKeys: dto.roles || [],
    permissionKeys: dto.permissions || [],
  };
}

export function mapAdminUserDetailDto(dto: AdminUserDto): AdminUserDetailView {
  return {
    ...mapAdminUserDto(dto),
    createdAt: dto.created_at ?? null,
    updatedAt: dto.updated_at ?? null,
    lastLoginAt: dto.last_login_at ?? null,
  };
}

