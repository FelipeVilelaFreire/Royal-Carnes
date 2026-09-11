export type ClientAuthSource = "api" | "anonymous";

export interface ClientAuthStorage {
  save(value: string): void;
  read(): string | null;
  clear(): void;
}
