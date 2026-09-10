import type { ClientAuthStorage } from "@royalprime/client/types/auth.types";
import type { ClientAuthSession } from "@royalprime/client/contracts/auth.contract";

const clientSessionStorageKey = "royal_prime_client_session";

export const clientAuthStorage: ClientAuthStorage = {
  clear() {
    if (typeof window !== "undefined") localStorage.removeItem(clientSessionStorageKey);
  },
  read() {
    return typeof window === "undefined" ? null : localStorage.getItem(clientSessionStorageKey);
  },
  save(value) {
    if (typeof window !== "undefined") localStorage.setItem(clientSessionStorageKey, value);
  },
};

export const readStoredClientSession = (): ClientAuthSession | null => {
  const raw = clientAuthStorage.read();
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ClientAuthSession;
  } catch {
    clientAuthStorage.clear();
    return null;
  }
};
