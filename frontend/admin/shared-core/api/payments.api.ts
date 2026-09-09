import {
  buildApiHeaders,
  throwIfApiError,
  type ApiClientConfig,
} from "../../../shared-core";
import type {
  AdminPaymentDto,
  AdminPaymentFormInput,
  AdminPaymentUpdateInput,
  AdminPaymentView,
} from "../contracts/payments.contract";
import {
  mapAdminPaymentDto,
  mapAdminPaymentFormInput,
  mapAdminPaymentUpdateInput,
} from "../mappers/payments.mapper";

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

export function createAdminPaymentsApi(config: ApiClientConfig = {}) {
  const fetcher = config.fetcher || fetch;

  return {
    async list(): Promise<AdminPaymentView[]> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/payments/admin/payments/"), {
        headers: buildApiHeaders({
          token: config.getAccessToken?.(),
          organizationSlug: config.organizationSlug,
        }),
      });
      await throwIfApiError(response);
      return ((await response.json()) as AdminPaymentDto[]).map(mapAdminPaymentDto);
    },
    async create(input: AdminPaymentFormInput): Promise<AdminPaymentView> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/payments/admin/payments/"), {
        method: "POST",
        headers: buildApiHeaders({
          token: config.getAccessToken?.(),
          organizationSlug: config.organizationSlug,
        }),
        body: JSON.stringify(mapAdminPaymentFormInput(input)),
      });
      await throwIfApiError(response);
      return mapAdminPaymentDto((await response.json()) as AdminPaymentDto);
    },
    async update(id: string | number, input: AdminPaymentUpdateInput): Promise<AdminPaymentView> {
      const response = await fetcher(resolveUrl(config.baseUrl, `/api/v1/payments/admin/payments/${id}/`), {
        method: "PATCH",
        headers: buildApiHeaders({
          token: config.getAccessToken?.(),
          organizationSlug: config.organizationSlug,
        }),
        body: JSON.stringify(mapAdminPaymentUpdateInput(input)),
      });
      await throwIfApiError(response);
      return mapAdminPaymentDto((await response.json()) as AdminPaymentDto);
    },
  };
}

export const adminPaymentsApi = createAdminPaymentsApi();

