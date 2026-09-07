import type { AdminAuthSession, AdminAuthStorage } from "@royalprime/admin";

const ADMIN_AUTH_STORAGE_KEY = "royalprime.admin.session";

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export const adminAuthStorage: AdminAuthStorage = {
  save(value: string) {
    if (!canUseLocalStorage()) return;
    window.localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, value);
  },
  read() {
    if (!canUseLocalStorage()) return null;
    return window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
  },
  clear() {
    if (!canUseLocalStorage()) return;
    window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
  },
};

export function readStoredAdminSession(): AdminAuthSession | null {
  const value = adminAuthStorage.read();
  if (!value) return null;

  try {
    return JSON.parse(value) as AdminAuthSession;
  } catch {
    adminAuthStorage.clear();
    return null;
  }
}

export function readStoredAdminAccessToken(): string | null {
  return readStoredAdminSession()?.token.accessToken || null;
}
