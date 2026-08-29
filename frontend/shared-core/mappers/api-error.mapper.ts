import type { AuthErrorCode } from "../contracts/auth.contract";
import type { ApiErrorEnvelope } from "../types/api.types";
import { RoyalPrimeApiError } from "../api/errors.api";

export function normalizeApiError(error: unknown): ApiErrorEnvelope {
  if (error instanceof RoyalPrimeApiError) {
    return error.envelope;
  }

  if (error instanceof Error) {
    return {
      code: "network_error",
      message: error.message,
    };
  }

  return {
    code: "unknown_error",
    detail: error,
  };
}

export function mapAuthErrorCode(error: unknown): AuthErrorCode {
  const envelope = normalizeApiError(error);

  if (envelope.code === "invalid_credentials") return "invalid_credentials";
  if (envelope.code === "inactive_user") return "inactive_user";
  if (envelope.code === "organization_required") return "organization_required";
  if (envelope.code === "permission_denied") return "permission_denied";
  if (envelope.code === "network_error") return "network_error";

  return "unknown_error";
}

