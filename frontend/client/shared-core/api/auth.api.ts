import {
  buildApiHeaders,
  throwIfApiError,
  type ApiClientConfig,
  type TenantContext,
} from "../../../shared-core";
import type {
  ClientAuthSession,
  ClientLoginInput,
  ClientLoginResponseDto,
  ClientMeResponseDto,
  ClientRefreshInput,
  ClientRefreshResponseDto,
  ClientRefreshResult,
  ClientRegisterInput,
  ClientRegisterResponseDto,
  ClientRegisterResult,
} from "../contracts/auth.contract";
import {
  mapClientLoginResponse,
  mapClientMeResponse,
  mapClientRefreshResponse,
  mapClientRegisterResponse,
} from "../mappers/auth.mapper";

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

function resolveTenant(config: ApiClientConfig): TenantContext {
  return {
    organizationSlug: config.organizationSlug || "royalprime",
  };
}

export function createClientAuthApi(config: ApiClientConfig = {}) {
  const fetcher = config.fetcher || fetch;

  async function requestSession(path: string, input: ClientLoginInput): Promise<ClientAuthSession> {
    const tenant = resolveTenant(config);
    const response = await fetcher(resolveUrl(config.baseUrl, path), {
      method: "POST",
      headers: buildApiHeaders({
        organizationSlug: tenant.organizationSlug,
      }),
      body: JSON.stringify(input),
    });

    await throwIfApiError(response);
    return mapClientLoginResponse((await response.json()) as ClientLoginResponseDto, tenant);
  }

  return {
    login(input: ClientLoginInput) {
      return requestSession("/api/v1/auth/login/", input);
    },
    async me(accessToken = config.getAccessToken?.() || ""): Promise<ClientAuthSession> {
      const tenant = resolveTenant(config);
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/accounts/me/"), {
        headers: buildApiHeaders({
          token: accessToken,
          organizationSlug: tenant.organizationSlug,
        }),
      });

      await throwIfApiError(response);
      return mapClientMeResponse((await response.json()) as ClientMeResponseDto, tenant, accessToken);
    },
    async refresh(input: ClientRefreshInput): Promise<ClientRefreshResult> {
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
      return mapClientRefreshResponse((await response.json()) as ClientRefreshResponseDto, input);
    },
    async register(input: ClientRegisterInput): Promise<ClientRegisterResult> {
      const tenant = resolveTenant(config);
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/auth/register/"), {
        method: "POST",
        headers: buildApiHeaders({
          organizationSlug: tenant.organizationSlug,
        }),
        body: JSON.stringify(input),
      });

      await throwIfApiError(response);
      return mapClientRegisterResponse((await response.json()) as ClientRegisterResponseDto);
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
  };
}

export const clientAuthApi = createClientAuthApi();
