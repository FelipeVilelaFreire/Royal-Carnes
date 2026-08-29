import type {
  AdminPermissionDto,
  AdminPermissionView,
  AdminRoleDto,
  AdminRoleView,
} from "../contracts/permission.contract";

export function mapAdminPermissionDto(dto: AdminPermissionDto): AdminPermissionView {
  return {
    key: dto.key,
    name: dto.name,
    description: dto.description ?? null,
  };
}

export function mapAdminRoleDto(dto: AdminRoleDto): AdminRoleView {
  return {
    key: dto.key,
    name: dto.name,
    permissionKeys: dto.permissions || [],
  };
}

export function hasAdminPermission(
  permissionKeys: string[],
  permissionKey: string,
): boolean {
  return permissionKeys.includes(permissionKey);
}

