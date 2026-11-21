import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16 proxy (thay thế middleware.ts) — điều hướng sớm theo cờ cookie.
 * Cookie chỉ chứa cờ omnibid_auth=1 và omnibid_role (không chứa JWT).
 * Backend vẫn là chốt chặn phân quyền thực tế.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isAuth = request.cookies.get("omnibid_auth")?.value === "1";
  const role = request.cookies.get("omnibid_role")?.value;

  // 1. Tuyến auth: /login, /register
  if (pathname === "/login" || pathname === "/register") {
    if (isAuth) {
      const target = role === "ADMIN" ? "/admin" : "/";
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  // 2. Tuyến admin: /admin/** (chỉ ADMIN)
  if (pathname.startsWith("/admin")) {
    if (!isAuth) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== "ADMIN") {
      return NextResponse.rewrite(new URL("/403", request.url));
    }
    return NextResponse.next();
  }

  // 3. Tuyến tài khoản USER: /me/**, /orders/** (chỉ USER; ADMIN chuyển về /admin)
  if (pathname.startsWith("/me") || pathname.startsWith("/orders")) {
    if (!isAuth) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/admin/:path*",
    "/me/:path*",
    "/orders/:path*",
  ],
};
