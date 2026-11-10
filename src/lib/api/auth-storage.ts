import type { AuthResponse } from "./types";

const TOKEN_KEY = "omnibid_token";
const USER_KEY = "omnibid_user";
const COOKIE_TOKEN = "omnibid_token";
const COOKIE_ROLE = "omnibid_role";

function isClient(): boolean {
  return typeof window !== "undefined";
}

function setCookie(name: string, value: string, persistent: boolean, days = 1) {
  if (!isClient()) return;
  const expiresPart = persistent
    ? `; expires=${new Date(Date.now() + days * 864e5).toUTCString()}`
    : "";
  document.cookie = `${name}=${encodeURIComponent(value)}${expiresPart}; path=/; SameSite=Lax`;
}

function removeCookie(name: string) {
  if (!isClient()) return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export function getStoredToken(): string | null {
  if (!isClient()) return null;
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthResponse | null {
  if (!isClient()) return null;
  const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    return null;
  }
}

export function saveAuthSession(auth: AuthResponse, rememberMe = true): void {
  if (!isClient()) return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);

  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, auth.accessToken);
  storage.setItem(USER_KEY, JSON.stringify(auth));

  setCookie(COOKIE_TOKEN, auth.accessToken, rememberMe, 1);
  setCookie(COOKIE_ROLE, auth.role, rememberMe, 1);
}

export function clearAuthSession(): void {
  if (!isClient()) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  removeCookie(COOKIE_TOKEN);
  removeCookie(COOKIE_ROLE);
}
