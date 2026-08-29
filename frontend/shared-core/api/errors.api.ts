import type { ApiErrorEnvelope } from "../types/api.types";

export class RoyalPrimeApiError extends Error {
  readonly envelope: ApiErrorEnvelope;

  constructor(envelope: ApiErrorEnvelope) {
    super(envelope.message || envelope.code);
    this.name = "RoyalPrimeApiError";
    this.envelope = envelope;
  }
}

export async function readApiError(response: Response): Promise<ApiErrorEnvelope> {
  let body: unknown = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (body && typeof body === "object") {
    const maybeError = body as Partial<ApiErrorEnvelope>;
    return {
      code: String(maybeError.code || response.statusText || "api_error"),
      message: maybeError.message,
      detail: maybeError.detail ?? body,
      status: response.status,
    };
  }

  return {
    code: response.statusText || "api_error",
    status: response.status,
  };
}

export async function throwIfApiError(response: Response): Promise<void> {
  if (!response.ok) {
    throw new RoyalPrimeApiError(await readApiError(response));
  }
}

