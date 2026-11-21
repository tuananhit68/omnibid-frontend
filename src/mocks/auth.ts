import { UserRole, UserStatus } from "@/types/enums";
import { getMockDb, mockNowMs } from "./db";
import { mockError } from "./errors";
import type { MockUser } from "./seed";

const LOGIN_WINDOW_MS = 15 * 60_000;
const MAX_LOGIN_FAILS = 5;

const failedLoginAttempts = new Map<string, number[]>();

export function createMockToken(user: MockUser): string {
  return `mock.${user.id}.${user.tokenVersion}`;
}

export function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader || typeof authHeader !== "string") return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

export function parseMockToken(
  token: string
): { userId: number; tokenVersion: number } | null {
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "mock") return null;
  const userId = Number(parts[1]);
  const tokenVersion = Number(parts[2]);
  if (!Number.isInteger(userId) || !Number.isInteger(tokenVersion)) return null;
  return { userId, tokenVersion };
}

/**
 * Dùng cho endpoint Public: JWT không hợp lệ bị bỏ qua (coi như Guest).
 */
export function resolveOptionalUser(authHeader?: string): MockUser | null {
  const token = extractBearerToken(authHeader);
  if (!token) return null;
  const parsed = parseMockToken(token);
  if (!parsed) return null;
  const db = getMockDb();
  const user = db.users.find((u) => u.id === parsed.userId);
  if (!user) return null;
  if (user.tokenVersion !== parsed.tokenVersion) return null;
  if (user.status === UserStatus.BANNED) return null;
  return user;
}

/**
 * Dùng cho endpoint yêu cầu xác thực.
 */
export function requireMockAuth(
  authHeader?: string,
  allowedRoles?: UserRole[]
): MockUser {
  const token = extractBearerToken(authHeader);
  if (!token) {
    throw mockError("UNAUTHORIZED");
  }
  const parsed = parseMockToken(token);
  if (!parsed) {
    throw mockError("UNAUTHORIZED");
  }
  const db = getMockDb();
  const user = db.users.find((u) => u.id === parsed.userId);
  if (!user || user.tokenVersion !== parsed.tokenVersion) {
    throw mockError("UNAUTHORIZED");
  }
  if (user.status === UserStatus.BANNED) {
    throw mockError("ACCOUNT_BANNED");
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw mockError("FORBIDDEN");
  }
  return user;
}

export function checkLoginRateLimit(email: string): void {
  const key = email.trim().toLowerCase();
  const now = mockNowMs();
  const timestamps = (failedLoginAttempts.get(key) ?? []).filter(
    (ts) => now - ts < LOGIN_WINDOW_MS
  );
  failedLoginAttempts.set(key, timestamps);
  if (timestamps.length >= MAX_LOGIN_FAILS) {
    throw mockError("TOO_MANY_REQUESTS");
  }
}

export function recordLoginFailure(email: string): void {
  const key = email.trim().toLowerCase();
  const now = mockNowMs();
  const timestamps = (failedLoginAttempts.get(key) ?? []).filter(
    (ts) => now - ts < LOGIN_WINDOW_MS
  );
  timestamps.push(now);
  failedLoginAttempts.set(key, timestamps);
}

export function clearLoginFailures(email: string): void {
  failedLoginAttempts.delete(email.trim().toLowerCase());
}
