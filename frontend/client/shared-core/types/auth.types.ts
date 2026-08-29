export type ClientAuthSource = "api" | "fallback" | "anonymous";

export interface ClientAuthStorage {
  save(value: string): void;
  read(): string | null;
  clear(): void;
}

