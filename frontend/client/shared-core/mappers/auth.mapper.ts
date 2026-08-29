import type {
  ClientAuthSession,
  ClientCurrentUser,
  ClientLoginResponseDto,
  ClientRegisterResponseDto,
  ClientRegisterResult,
} from "../contracts/auth.contract";
import type { TenantContext } from "../../../shared-core";

export function mapClientLoginResponse(
  dto: ClientLoginResponseDto,
  tenant: TenantContext,
): ClientAuthSession {
  return {
    user: {
      id: dto.user.id,
      email: dto.user.email,
      name: dto.user.name ?? null,
      customer: null,
    },
    token: {
      accessToken: dto.access,
      refreshToken: dto.refresh ?? null,
    },
    tenant,
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
