import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("omnibid_token")?.value;
  const role = request.cookies.get("omnibid_role")?.value;

  // 1. Tuyến (auth): /login, /register
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  if (isAuthRoute) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 2. Tuyến admin: /admin/*
  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== "ADMIN") {
      return NextResponse.rewrite(new URL("/403", request.url));
    }
    return NextResponse.next();
  }

  // 3. Tuyến cần đăng nhập: /me/*, /orders/*, /watchlist/*, /notifications/*, /seller/*
  const isUserProtected =
    pathname.startsWith("/me") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/watchlist") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/seller");

  if (isUserProtected) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
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
    "/watchlist/:path*",
    "/notifications/:path*",
    "/seller/:path*",
  ],
};
