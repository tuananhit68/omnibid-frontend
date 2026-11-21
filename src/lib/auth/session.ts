"use client";

import { useEffect, useState, useCallback } from "react";
import type { LoginResponse, UserSummary } from "@/lib/api/contract";
import { UserRole } from "@/types/enums";

const SESSION_KEY = "omnibid_session_v4";
const COOKIE_AUTH = "omnibid_auth";
const COOKIE_ROLE = "omnibid_role";
const SESSION_EVENT = "omnibid:session-change";

export interface StoredSession {
  accessToken: string;
  expiresAt: string;
  user: UserSummary;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function setFlagCookie(name: string, value: string, expiresAtIso: string) {
  if (!isBrowser()) return;
  const expiresDate = new Date(expiresAtIso);
  const expiresPart = Number.isNaN(expiresDate.getTime())
    ? ""
    : `; expires=${expiresDate.toUTCString()}`;
  document.cookie = `${name}=${encodeURIComponent(value)}${expiresPart}; path=/; SameSite=Lax`;
}

function clearCookie(name: string) {
  if (!isBrowser()) return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

function notifySessionChange() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function isSessionExpired(expiresAt: string): boolean {
  const ms = Date.parse(expiresAt);
  if (Number.isNaN(ms)) return false;
  return Date.now() >= ms;
}

export function getStoredSession(): StoredSession | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed?.accessToken || !parsed?.user) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  const session = getStoredSession();
  if (!session) return null;
  if (isSessionExpired(session.expiresAt)) {
    clearSession();
    return null;
  }
  return session.accessToken;
}

export function saveSession(login: LoginResponse): void {
  if (!isBrowser()) return;
  const session: StoredSession = {
    accessToken: login.accessToken,
    expiresAt: login.expiresAt,
    user: login.user,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  // Cookie chỉ chứa cờ phân quyền cho proxy.ts, tuyệt đối không lưu JWT
  setFlagCookie(COOKIE_AUTH, "1", login.expiresAt);
  setFlagCookie(COOKIE_ROLE, login.user.role, login.expiresAt);
  notifySessionChange();
}

export function updateSessionUser(patch: Partial<UserSummary>): void {
  if (!isBrowser()) return;
  const current = getStoredSession();
  if (!current) return;
  const updated: StoredSession = {
    ...current,
    user: { ...current.user, ...patch },
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  setFlagCookie(COOKIE_ROLE, updated.user.role, updated.expiresAt);
  notifySessionChange();
}

export function clearSession(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(SESSION_KEY);
  // Dọn khóa cũ nếu còn tồn tại từ phiên bản trước
  localStorage.removeItem("omnibid_token");
  localStorage.removeItem("omnibid_user");
  sessionStorage.removeItem("omnibid_token");
  sessionStorage.removeItem("omnibid_user");
  clearCookie("omnibid_token");
  clearCookie(COOKIE_AUTH);
  clearCookie(COOKIE_ROLE);
  notifySessionChange();
}

export interface SessionState {
  user: UserSummary | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  ready: boolean;
}

export function useSession(): SessionState {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [ready, setReady] = useState(false);

  const syncFromStorage = useCallback(() => {
    const current = getStoredSession();
    if (current && isSessionExpired(current.expiresAt)) {
      clearSession();
      setSession(null);
      setReady(true);
      if (isBrowser() && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?reason=expired";
      }
      return;
    }
    setSession(current);
    setReady(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    syncFromStorage();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === SESSION_KEY) {
        syncFromStorage();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(SESSION_EVENT, syncFromStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(SESSION_EVENT, syncFromStorage);
    };
  }, [syncFromStorage]);

  // Kiểm tra tự đăng xuất khi hết expiresAt
  useEffect(() => {
    if (!session) return;
    const msLeft = Date.parse(session.expiresAt) - Date.now();
    if (Number.isNaN(msLeft)) return;
    if (msLeft <= 0) {
      clearSession();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSession(null);
      if (isBrowser() && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?reason=expired";
      }
      return;
    }
    const timer = window.setTimeout(() => {
      clearSession();
      setSession(null);
      if (isBrowser() && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?reason=expired";
      }
    }, Math.min(msLeft, 2_147_483_647));
    return () => window.clearTimeout(timer);
  }, [session]);

  const user = session?.user ?? null;
  const token = session?.accessToken ?? null;

  return {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isAdmin: user?.role === UserRole.ADMIN,
    ready,
  };
}
