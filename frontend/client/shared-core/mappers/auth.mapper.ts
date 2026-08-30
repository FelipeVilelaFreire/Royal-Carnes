import type {
  ClientAuthSession,
  ClientCurrentUser,
  ClientLoginResponseDto,
  ClientMeResponseDto,
  ClientRefreshInput,
  ClientRefreshResponseDto,
  ClientRefreshResult,
  ClientRegisterResponseDto,
  ClientRegisterResult,
} from "../contracts/auth.contract";
import type { TenantContext } from "../../../shared-core";

function mapClientCurrentUser(dto: ClientLoginResponseDto["user"]): ClientCurrentUser {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name ?? null,
    phone: dto.phone ?? null,
    status: dto.is_active === false ? "inactive" : "active",
    customer: null,
  };
}

export function mapClientLoginResponse(
  dto: ClientLoginResponseDto,
  tenant: TenantContext,
): ClientAuthSession {
  return {
    user: mapClientCurrentUser(dto.user),
    token: {
      accessToken: dto.access,
      refreshToken: dto.refresh ?? null,
    },
    tenant,
    source: "api",
  };
}

export function mapClientMeResponse(
  dto: ClientMeResponseDto,
  tenant: TenantContext,
  accessToken: string,
): ClientAuthSession {
  return mapClientLoginResponse(
    {
      ...dto,
      access: accessToken,
      refresh: null,
    },
    tenant,
  );
}

export function mapClientRefreshResponse(
  dto: ClientRefreshResponseDto,
  input: ClientRefreshInput,
): ClientRefreshResult {
  return {
    token: {
      accessToken: dto.access,
      refreshToken: dto.refresh ?? input.refreshToken,
    },
    source: "api",
  };
}

export function mapClientRegisterResponse(
  dto: ClientRegisterResponseDto,
): ClientRegisterResult {
  const user: ClientCurrentUser = {
    id: dto.id,
    email: dto.email,
    name: dto.name ?? null,
    status: dto.is_active === false ? "inactive" : "active",
    customer: null,
  };

  return {
    user,
    source: "api",
  };
}
