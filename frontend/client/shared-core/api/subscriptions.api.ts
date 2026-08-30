import {
  buildApiHeaders,
  throwIfApiError,
  type ApiClientConfig,
} from "../../../shared-core";
import type {
  ClientCurrentCycleResponseDto,
  ClientCycleItemSelectionInput,
  ClientPlanDto,
  ClientPlanView,
  ClientSubscriptionCycleItemDto,
  ClientSubscriptionCycleItemView,
  ClientSubscriptionCycleView,
  ClientSubscriptionResponseDto,
  ClientSubscriptionView,
} from "../contracts/subscriptions.contract";
import {
  mapClientPlanDto,
  mapClientSubscriptionCycleDto,
  mapClientSubscriptionCycleItemDto,
  mapClientSubscriptionDto,
} from "../mappers/subscriptions.mapper";

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

export function createClientSubscriptionsApi(config: ApiClientConfig = {}) {
  const fetcher = config.fetcher || fetch;

  return {
    async listPlans(): Promise<ClientPlanView[]> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/subscriptions/plans/"), {
        headers: buildApiHeaders({ organizationSlug: config.organizationSlug }),
      });

      await throwIfApiError(response);
      return ((await response.json()) as ClientPlanDto[]).map(mapClientPlanDto);
    },
    async me(): Promise<ClientSubscriptionView | null> {
      const response = await fetcher(resolveUrl(config.baseUrl, "/api/v1/subscriptions/me/"), {
        headers: buildApiHeaders({
          token: config.getAccessToken?.(),
          organizationSlug: config.organizationSlug,
        }),
      });

      await throwIfApiError(response);
      const body = (await response.json()) as ClientSubscriptionResponseDto;
      return body.subscription ? mapClientSubscriptionDto(body.subscription) : null;
    },
    async currentCycle(): Promise<ClientSubscriptionCycleView | null> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, "/api/v1/subscriptions/me/cycles/current/"),
        {
          headers: buildApiHeaders({
            token: config.getAccessToken?.(),
            organizationSlug: config.organizationSlug,
          }),
        },
      );

      await throwIfApiError(response);
      const body = (await response.json()) as ClientCurrentCycleResponseDto;
      return body.cycle ? mapClientSubscriptionCycleDto(body.cycle) : null;
    },
    async selectCurrentCycleItem(
      input: ClientCycleItemSelectionInput,
    ): Promise<ClientSubscriptionCycleItemView> {
      const response = await fetcher(
        resolveUrl(config.baseUrl, "/api/v1/subscriptions/me/cycles/current/items/"),
        {
          method: "POST",
          headers: buildApiHeaders({
            token: config.getAccessToken?.(),
            organizationSlug: config.organizationSlug,
          }),
          body: JSON.stringify({
            entitlement_key: input.entitlementKey,
            product_key: input.productKey,
            variant_sku: input.variantSku,
            quantity: input.quantity,
            measurement_unit_key: input.measurementUnitKey,
          }),
        },
      );

      await throwIfApiError(response);
      return mapClientSubscriptionCycleItemDto(
        (await response.json()) as ClientSubscriptionCycleItemDto,
      );
    },
  };
}

export const clientSubscriptionsApi = createClientSubscriptionsApi();
