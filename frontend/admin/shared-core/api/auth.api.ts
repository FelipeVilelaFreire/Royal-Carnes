import {
  buildApiHeaders,
  throwIfApiError,
  type ApiClientConfig,
  type TenantContext,
} from "../../../shared-core";
import type {
  AdminAuthSession,
  AdminLoginInput,
  AdminLoginResponseDto,
  AdminMeResponseDto,
  AdminRefreshInput,
  AdminRefreshResponseDto,
  AdminRefreshResult,
} from "../contracts/auth.contract";
import {
  mapAdminLoginResponse,
  mapAdminMeResponse,
  mapAdminRefreshResponse,
} from "../mappers/auth.mapper";

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

function resolveTenant(config: ApiClientConfig): TenantContext {
  return {
    organizationSlug: config.organizationSlug || "royalprime",
  };
}

export function createAdminAuthApi(config: ApiClientConfig = {}) {
  const fetcher = config.fetcher || fetch;

  return {
    async login(input: AdminLoginInput): Promise<AdminAuthSession> {
      const tenant = resolveTenant(config);
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/auth/login/"), {
        method: "POST",
        headers: buildApiHeaders({
          organizationSlug: tenant.organizationSlug,
        }),
        body: JSON.stringify(input),
      });

      await throwIfApiError(response);
      return mapAdminLoginResponse((await response.json()) as AdminLoginResponseDto, tenant);
    },
    async logout(): Promise<void> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/auth/logout/"), {
        method: "POST",
        headers: buildApiHeaders({
          token: config.getAccessToken?.(),
          organizationSlug: config.organizationSlug,
        }),
      });

      await throwIfApiError(response);
    },
    async refresh(input: AdminRefreshInput): Promise<AdminRefreshResult> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/auth/refresh/"), {
        method: "POST",
        headers: buildApiHeaders({
          organizationSlug: config.organizationSlug,
        }),
        body: JSON.stringify({
          refresh: input.refreshToken,
        }),
      });

      await throwIfApiError(response);
      return mapAdminRefreshResponse((await response.json()) as AdminRefreshResponseDto, input);
    },
    async me(): Promise<AdminAuthSession> {
      const tenant = resolveTenant(config);
      const accessToken = config.getAccessToken?.() || "";
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/accounts/me/"), {
        headers: buildApiHeaders({
          token: accessToken,
          organizationSlug: tenant.organizationSlug,
        }),
      });

      await throwIfApiError(response);
      return mapAdminMeResponse((await response.json()) as AdminMeResponseDto, tenant, accessToken);
    },
  };
}

export const adminAuthApi = createAdminAuthApi();
