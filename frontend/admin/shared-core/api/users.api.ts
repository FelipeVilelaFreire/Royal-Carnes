import {
  buildApiHeaders,
  throwIfApiError,
  type ApiClientConfig,
} from "../../../shared-core";
import type {
  AdminUserDto,
  AdminUserFormInput,
  AdminUserListItemView,
  AdminUserListParams,
} from "../contracts/user.contract";
import { mapAdminUserDto } from "../mappers/users.mapper";

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

function buildQuery(params: AdminUserListParams = {}): string {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.roleKey) query.set("role", params.roleKey);
  if (params.status) query.set("status", params.status);
  const value = query.toString();
  return value ? `?${value}` : "";
}

export function createAdminUsersApi(config: ApiClientConfig = {}) {
  const fetcher = config.fetcher || fetch;

  return {
    async list(params: AdminUserListParams = {}): Promise<AdminUserListItemView[]> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, `/api/v1/accounts/users/${buildQuery(params)}`),
        {
          headers: buildApiHeaders({
            token: config.getAccessToken?.(),
            organizationSlug: config.organizationSlug,
          }),
        },
      );

      await throwIfApiError(response);
      const body = (await response.json()) as AdminUserDto[] | { results?: AdminUserDto[] };
      const users = Array.isArray(body) ? body : body.results || [];
      return users.map(mapAdminUserDto);
    },
    async create(input: AdminUserFormInput): Promise<AdminUserListItemView> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/accounts/users/"), {
        method: "POST",
        headers: buildApiHeaders({
          token: config.getAccessToken?.(),
          organizationSlug: config.organizationSlug,
        }),
        body: JSON.stringify({
          email: input.email,
          name: input.name,
          password: input.password,
          roles: input.roleKeys,
          is_active: input.isActive ?? true,
        }),
      });

      await throwIfApiError(response);
      return mapAdminUserDto((await response.json()) as AdminUserDto);
    },
  };
}

export const adminUsersApi = createAdminUsersApi();

