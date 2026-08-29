import type { TenantContext } from "../../../shared-core";
import type {
  AdminAuthSession,
  AdminLoginResponseDto,
  AdminMeResponseDto,
} from "../contracts/auth.contract";

function mapMemberships(
  dto: AdminLoginResponseDto | AdminMeResponseDto,
  tenant: TenantContext,
){
  return (dto.memberships || []).map((membership) => ({
    organizationId: membership.organization?.id || "",
    organizationSlug: membership.organization_slug || membership.organization?.slug || "",
    roleKeys: membership.role_key ? [membership.role_key] : [],
    permissionKeys:
      dto.permissions?.[
        membership.organization_slug || membership.organization?.slug || tenant.organizationSlug
      ] || [],
  }));
}

export function mapAdminLoginResponse(
  dto: AdminLoginResponseDto,
  tenant: TenantContext,
): AdminAuthSession {
  const memberships = mapMemberships(dto, tenant);

  const activeMembership =
    memberships.find((membership) => membership.organizationSlug === tenant.organizationSlug) ||
    memberships[0] ||
    null;

  return {
    user: {
      id: dto.user.id,
      email: dto.user.email,
      name: dto.user.name ?? null,
      memberships,
      activeMembership,
    },
    token: {
      accessToken: dto.access,
      refreshToken: dto.refresh ?? null,
    },
    tenant,
    source: "api",
  };
}

export function mapAdminMeResponse(
  dto: AdminMeResponseDto,
  tenant: TenantContext,
  accessToken: string,
): AdminAuthSession {
  return mapAdminLoginResponse(
    {
      ...dto,
      access: accessToken,
      refresh: null,
    },
    tenant,
  );
}
