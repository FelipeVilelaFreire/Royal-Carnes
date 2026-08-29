export type AdminAuthSource = "api" | "fallback" | "anonymous";

export interface AdminAuthStorage {
  save(value: string): void;
  read(): string | null;
  clear(): void;
}

