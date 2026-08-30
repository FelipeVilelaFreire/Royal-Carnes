import {
  buildApiHeaders,
  throwIfApiError,
  type ApiClientConfig,
} from "../../../shared-core";
import type {
  AdminPlanDto,
  AdminPlanFormInput,
  AdminPlanView,
  AdminSubscriptionCycleDto,
  AdminSubscriptionCycleView,
  AdminSubscriptionDto,
  AdminSubscriptionFormInput,
  AdminSubscriptionView,
} from "../contracts/subscriptions.contract";
import {
  mapAdminPlanDto,
  mapAdminPlanFormInput,
  mapAdminSubscriptionCycleDto,
  mapAdminSubscriptionDto,
  mapAdminSubscriptionFormInput,
} from "../mappers/subscriptions.mapper";

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

export function createAdminSubscriptionsApi(config: ApiClientConfig = {}) {
  const fetcher = config.fetcher || fetch;

  return {
    async listPlans(): Promise<AdminPlanView[]> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, "/api/v1/subscriptions/admin/plans/"),
        {
          headers: buildApiHeaders({
            token: config.getAccessToken?.(),
            organizationSlug: config.organizationSlug,
          }),
        },
      );

      await throwIfApiError(response);
      return ((await response.json()) as AdminPlanDto[]).map(mapAdminPlanDto);
    },
    async createPlan(input: AdminPlanFormInput): Promise<AdminPlanView> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, "/api/v1/subscriptions/admin/plans/"),
        {
          method: "POST",
          headers: buildApiHeaders({
            token: config.getAccessToken?.(),
            organizationSlug: config.organizationSlug,
          }),
          body: JSON.stringify(mapAdminPlanFormInput(input)),
        },
      );

      await throwIfApiError(response);
      return mapAdminPlanDto((await response.json()) as AdminPlanDto);
    },
    async listSubscriptions(): Promise<AdminSubscriptionView[]> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, "/api/v1/subscriptions/admin/subscriptions/"),
        {
          headers: buildApiHeaders({
            token: config.getAccessToken?.(),
            organizationSlug: config.organizationSlug,
          }),
        },
      );

      await throwIfApiError(response);
      return ((await response.json()) as AdminSubscriptionDto[]).map(mapAdminSubscriptionDto);
    },
    async createSubscription(
      input: AdminSubscriptionFormInput,
    ): Promise<AdminSubscriptionView> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, "/api/v1/subscriptions/admin/subscriptions/"),
        {
          method: "POST",
          headers: buildApiHeaders({
            token: config.getAccessToken?.(),
            organizationSlug: config.organizationSlug,
          }),
          body: JSON.stringify(mapAdminSubscriptionFormInput(input)),
        },
      );

      await throwIfApiError(response);
      return mapAdminSubscriptionDto((await response.json()) as AdminSubscriptionDto);
    },
    async listCycles(): Promise<AdminSubscriptionCycleView[]> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, "/api/v1/subscriptions/admin/cycles/"),
        {
          headers: buildApiHeaders({
            token: config.getAccessToken?.(),
            organizationSlug: config.organizationSlug,
          }),
        },
      );

      await throwIfApiError(response);
      return ((await response.json()) as AdminSubscriptionCycleDto[]).map(
        mapAdminSubscriptionCycleDto,
      );
    },
  };
}

export const adminSubscriptionsApi = createAdminSubscriptionsApi();
