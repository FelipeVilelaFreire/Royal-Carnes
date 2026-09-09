import type { AdminLoginInput } from "../contracts/auth.contract";

export interface AdminDevAuthBypassOptions {
  baseUrl?: string;
  credentials: AdminLoginInput;
  organizationSlug: string;
}

let devAccessToken: string | null = null;
let devLoginPromise: Promise<string | null> | null = null;

function resolveUrl(baseUrl: string | undefined, path: string): string {
  return `${baseUrl || ""}${path}`;
}

function isAuthRequest(input: RequestInfo | URL): boolean {
  return String(input).includes("/api/v1/auth/");
}

export function readAdminDevAuthBypassAccessToken(): string | null {
  return devAccessToken;
}

export async function ensureAdminDevAuthBypassAccessToken(
  options: AdminDevAuthBypassOptions,
): Promise<string | null> {
  if (devAccessToken) return devAccessToken;

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

    const token = await ensureAdminDevAuthBypassAccessToken(options);
    const headers = new Headers(init.headers);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    if (!headers.has("X-Organization-Slug")) {
      headers.set("X-Organization-Slug", options.organizationSlug);
    }

    return fetch(input, {
      ...init,
      headers,
    });
  };
}
