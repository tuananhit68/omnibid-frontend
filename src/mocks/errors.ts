import { ERROR_MESSAGES, type ErrorCode } from "@/lib/errors";

export const ERROR_HTTP_STATUS: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  INVALID_IMAGE: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  ACCOUNT_BANNED: 403,
  NOT_FOUND: 404,
  AUCTION_NOT_ACTIVE: 409,
  BID_TOO_LOW: 409,
  ALREADY_LEADING: 409,
  SELF_BID_NOT_ALLOWED: 409,
  AUCTION_NOT_EDITABLE: 409,
  CANNOT_CANCEL: 409,
  PRODUCT_NOT_AVAILABLE: 409,
  PRODUCT_NOT_EDITABLE: 409,
  INVALID_STATUS_TRANSITION: 409,
  CANNOT_BAN_ADMIN: 409,
  CATEGORY_IN_USE: 409,
  ORDER_EXPIRED: 409,
  ORDER_CANCELLED: 409,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  IMAGE_UPLOAD_FAILED: 502,
  NETWORK_ERROR: 0,
};

export class MockHttpError extends Error {
  readonly status: number;
  readonly code: ErrorCode;
  readonly details?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    message?: string,
    details?: Record<string, unknown>,
    statusOverride?: number
  ) {
    super(message || ERROR_MESSAGES[code]);
    this.name = "MockHttpError";
    this.status = statusOverride ?? ERROR_HTTP_STATUS[code] ?? 500;
    this.code = code;
    this.details = details;
  }
}

export function mockError(
  code: ErrorCode,
  message?: string,
  details?: Record<string, unknown>,
  statusOverride?: number
): MockHttpError {
  return new MockHttpError(code, message, details, statusOverride);
}
