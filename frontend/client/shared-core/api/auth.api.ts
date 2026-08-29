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
  ClientRegisterInput,
  ClientRegisterResponseDto,
  ClientRegisterResult,
} from "../contracts/auth.contract";
import { mapClientLoginResponse, mapClientRegisterResponse } from "../mappers/auth.mapper";

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
