import { API_BASE_URL } from "../../../shared-core/config";
import type {
  AddCurrentCycleItemInput,
  CurrentCycleResponse,
  MySubscriptionResponse,
  SubscriptionCycleItem,
  SubscriptionPlan
} from "../contracts/subscription.contract";

const DEFAULT_ORGANIZATION_SLUG = "royalprime";

interface RequestOptions {
  accessToken?: string;
  organizationSlug?: string;
}

function headers(options: RequestOptions = {}) {
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Organization-Slug": options.organizationSlug || DEFAULT_ORGANIZATION_SLUG
  };
  if (options.accessToken) {
    requestHeaders.Authorization = `Bearer ${options.accessToken}`;
  }
  return requestHeaders;
}

async function requestJson<T>(path: string, init: RequestInit = {}, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...headers(options),
      ...(init.headers || {})
    }
  });
  if (!response.ok) {
    throw new Error(`subscriptions_api_${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function getSubscriptionPlans(options: RequestOptions = {}) {
  return requestJson<SubscriptionPlan[]>("/subscriptions/plans/", {}, options);
}

export async function getMySubscription(options: RequestOptions = {}) {
  return requestJson<MySubscriptionResponse>("/subscriptions/me/", {}, options);
}

export async function getMyCurrentCycle(options: RequestOptions = {}) {
  return requestJson<CurrentCycleResponse>("/subscriptions/me/cycles/current/", {}, options);
}

export async function addCurrentCycleItem(input: AddCurrentCycleItemInput, options: RequestOptions = {}) {
  return requestJson<SubscriptionCycleItem>(
    "/subscriptions/me/cycles/current/items/",
    {
      method: "POST",
      body: JSON.stringify(input)
    },
    options
  );
}
