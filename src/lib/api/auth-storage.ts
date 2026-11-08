import type { AuthResponse } from "./types";

const TOKEN_KEY = "omnibid_token";
const USER_KEY = "omnibid_user";
const COOKIE_TOKEN = "omnibid_token";
const COOKIE_ROLE = "omnibid_role";

function isClient(): boolean {
  return typeof window !== "undefined";
}

function setCookie(name: string, value: string, days = 1) {
  if (!isClient()) return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function removeCookie(name: string) {
  if (!isClient()) return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export function getStoredToken(): string | null {
  if (!isClient()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthResponse | null {
  if (!isClient()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    return null;
  }
}

export function saveAuthSession(auth: AuthResponse): void {
  if (!isClient()) return;
  localStorage.setItem(TOKEN_KEY, auth.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(auth));
  setCookie(COOKIE_TOKEN, auth.accessToken, 1);
  setCookie(COOKIE_ROLE, auth.role, 1);
}

export function clearAuthSession(): void {
  if (!isClient()) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  removeCookie(COOKIE_TOKEN);
  removeCookie(COOKIE_ROLE);
}

