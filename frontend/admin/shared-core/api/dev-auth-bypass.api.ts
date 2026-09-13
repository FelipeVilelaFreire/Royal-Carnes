import type { AdminLoginInput } from "../contracts/auth.contract";

export interface AdminDevAuthBypassOptions {
  baseUrl?: string;
  credentials: AdminLoginInput;
  organizationSlug: string;
}

let devAccessToken: string | null = null;
let devLoginPromise: Promise<string | null> | null = null;
const devAccessTokenStorageKey = "royalprime.admin.dev-access-token";

function canUseSessionStorage() {
  return typeof window !== "undefined" && Boolean(window.sessionStorage);
}

function readStoredDevAccessToken() {
  if (!canUseSessionStorage()) return null;
  return window.sessionStorage.getItem(devAccessTokenStorageKey);
}

function storeDevAccessToken(token: string | null) {
  if (!canUseSessionStorage()) return;
  if (token) window.sessionStorage.setItem(devAccessTokenStorageKey, token);
  else window.sessionStorage.removeItem(devAccessTokenStorageKey);
}

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

function isAuthRequest(input: RequestInfo | URL): boolean {
  return String(input).includes("/api/v1/auth/");
}

export function readAdminDevAuthBypassAccessToken(): string | null {
  if (!devAccessToken) devAccessToken = readStoredDevAccessToken();
  return devAccessToken;
}

export function clearAdminDevAuthBypassAccessToken() {
  devAccessToken = null;
  storeDevAccessToken(null);
}

export async function ensureAdminDevAuthBypassAccessToken(
  options: AdminDevAuthBypassOptions,
): Promise<string | null> {
  const existingToken = readAdminDevAuthBypassAccessToken();
  if (existingToken) return existingToken;

  if (!devLoginPromise) {
    devLoginPromise = fetch(resolveUrl(options.baseUrl, "/api/v1/auth/login/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Organization-Slug": options.organizationSlug,
      },
      body: JSON.stringify(options.credentials),
    })
      .then(async (response) => {
        if (!response.ok) return null;
        const payload = await response.json();
        devAccessToken = payload.access || null;
        storeDevAccessToken(devAccessToken);
        return devAccessToken;
      })
      .finally(() => {
        devLoginPromise = null;
      });
  }

  return devLoginPromise;
}

export function createAdminDevAuthBypassFetcher(options: AdminDevAuthBypassOptions): typeof fetch {
  return async (input, init = {}) => {
    if (isAuthRequest(input)) return fetch(input, init);

    const requestWithToken = async (token: string | null) => {
      const headers = new Headers(init.headers);
      if (token) headers.set("Authorization", `Bearer ${token}`);
      if (!headers.has("X-Organization-Slug")) headers.set("X-Organization-Slug", options.organizationSlug);

      return fetch(input, {
        ...init,
        headers,
      });
    };

    const token = await ensureAdminDevAuthBypassAccessToken(options);
    const response = await requestWithToken(token);
    if (response.status !== 401 || !token) return response;

    clearAdminDevAuthBypassAccessToken();
    const refreshedToken = await ensureAdminDevAuthBypassAccessToken(options);
    if (!refreshedToken) return response;

    return requestWithToken(refreshedToken);
  };
}
