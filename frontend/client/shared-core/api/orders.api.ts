import { API_BASE_URL } from "../../../shared-core/config";
import type {
  CreateOrderInput,
  CreateOrderPayload,
  OrderConfigResponse,
  OrderDto
} from "../contracts/order.contract";

const DEFAULT_ORGANIZATION_SLUG = "royalprime";

export interface RequestOptions {
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
    throw new Error(`orders_api_${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function getOrderConfig(options: RequestOptions = {}): Promise<OrderConfigResponse> {
  return await requestJson<OrderConfigResponse>("/orders/config/", {}, options);
}

export async function getMyOrders(options: RequestOptions = {}): Promise<OrderDto[]> {
  return await requestJson<OrderDto[]>("/orders/me/", {}, options);
}

export async function getMyOrderById(id: string, options: RequestOptions = {}): Promise<OrderDto | null> {
  return await requestJson<OrderDto>(`/orders/me/${id}/`, {}, options);
}

export async function createOrder(input: CreateOrderInput | CreateOrderPayload, options: RequestOptions = {}): Promise<OrderDto> {
  const payload: CreateOrderPayload = "kind_key" in input ? input : {
    kind_key: input.kind === "subscriptionCycle" ? "subscription-cycle" : "delivery",
    address_id: input.addressId,
    notes: input.notes || "",
    items: (input.items || []).map((i) => ({
      product_key: i.productId,
      quantity: i.quantity
    }))
  };

  return await requestJson<OrderDto>(
    "/orders/me/",
    {
      method: "POST",
      body: JSON.stringify(payload)
    },
    options
  );
}
