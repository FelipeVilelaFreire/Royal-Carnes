const cachePrefix = "royalprime.admin.cache.";

function canUseSessionStorage() {
  return typeof window !== "undefined" && Boolean(window.sessionStorage);
}

export function readAdminSessionCache<T>(key: string): T | null {
  if (!canUseSessionStorage()) return null;

  try {
    const storedValue = window.sessionStorage.getItem(`${cachePrefix}${key}`);
    return storedValue ? (JSON.parse(storedValue) as T) : null;
  } catch {
    return null;
  }
}

export function writeAdminSessionCache<T>(key: string, value: T) {
  if (!canUseSessionStorage()) return;

  try {
    window.sessionStorage.setItem(`${cachePrefix}${key}`, JSON.stringify(value));
  } catch {
    // Session cache is optional and must never block the API flow.
  }
}
