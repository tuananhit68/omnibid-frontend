"use client";

import {
  Suspense,
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { useSession } from "@/lib/auth/session";
import { useLogout } from "@/features/auth/hooks";
import {
  NotificationBell,
  NotificationUnreadBadge,
} from "@/features/notification/components";
import { Logo } from "./Logo";
import { SkipLink } from "./SkipLink";
import { MockModeBanner } from "./MockModeBanner";
import { Avatar } from "../ui/Avatar";
import { getButtonClassName } from "../ui/Button";
import {
  ChevronDownIcon,
  CloseIcon,
  LogOutIcon,
  MenuIcon,
  SearchIcon,
} from "../icons";

export interface PublicLayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const PUBLIC_NAV = [
  { href: "/", label: "Trang chủ" },
  { href: "/auctions", label: "Phiên đấu giá" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, ready } = useSession();
  const { logout } = useLogout();

  const [keyword, setKeyword] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setMobileNavOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    const target = trimmed
      ? `/auctions?keyword=${encodeURIComponent(trimmed)}`
      : "/auctions";
    router.push(target);
    setMobileNavOpen(false);
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    setMobileNavOpen(false);
    await logout();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border-brand bg-surface">
      <MockModeBanner />
      <div className="mx-auto flex h-14 md:h-16 max-w-page items-center justify-between gap-3 px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Logo />
          <nav aria-label="Điều hướng chính" className="hidden md:flex items-center gap-1">
            {PUBLIC_NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex h-9 items-center rounded-md px-3 text-small font-medium transition-colors",
                    active
                      ? "bg-primary-50 text-primary-600"
                      : "text-text-secondary hover:bg-surface-subtle hover:text-text"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Ô tìm kiếm */}
        <form
          onSubmit={handleSearch}
          role="search"
          className="hidden sm:flex flex-1 max-w-sm items-center"
        >
          <div className="relative w-full">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-placeholder" />
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm phiên đấu giá…"
              aria-label="Tìm phiên đấu giá"
              className="h-10 w-full rounded-md border border-border-brand bg-surface-subtle pl-9 pr-3 text-body-lg md:text-small text-text placeholder:text-text-placeholder focus-visible:bg-surface focus-visible:border-primary-600 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
            />
          </div>
        </form>

        {/* Khu vực hành động theo vai trò */}
        <div className="flex items-center gap-2">
          {!ready ? (
            <div className="h-9 w-28 rounded-md bg-surface-subtle animate-pulse" />
          ) : !isAuthenticated || !user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/register"
                className={getButtonClassName({ variant: "secondary", size: "md" })}
              >
                Đăng ký
              </Link>
              <Link
                href="/login"
                className={getButtonClassName({ variant: "primary", size: "md" })}
              >
                Đăng nhập
              </Link>
            </div>
          ) : isAdmin ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/admin"
                className={getButtonClassName({ variant: "secondary", size: "md" })}
              >
                Trang quản trị
              </Link>
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border-brand bg-surface px-2.5 text-small font-medium text-text hover:bg-surface-subtle"
                >
                  <Avatar src={user.avatarUrl} name={user.fullName} size="sm" />
                  <span className="max-w-28 truncate">{user.fullName}</span>
                  <ChevronDownIcon className="size-4 text-text-tertiary" />
                </button>
                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-border-brand bg-surface p-1.5 shadow-md"
                  >
                    <Link
                      href="/admin/profile"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center rounded-md px-3 py-2 text-small text-text hover:bg-surface-subtle"
                    >
                      Hồ sơ cá nhân
                    </Link>
                    <div className="my-1 border-t border-border-subtle" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full flex-col items-start rounded-md px-3 py-2 text-left text-small text-danger hover:bg-danger-bg"
                    >
                      <span className="inline-flex items-center gap-2 font-medium">
                        <LogOutIcon className="size-4" />
                        Đăng xuất
                      </span>
                      <span className="text-caption text-text-tertiary">
                        Đăng xuất khỏi mọi thiết bị
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <NotificationBell />
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border-brand bg-surface px-2.5 text-small font-medium text-text hover:bg-surface-subtle"
                >
                  <Avatar src={user.avatarUrl} name={user.fullName} size="sm" />
                  <span className="max-w-28 truncate">{user.fullName}</span>
                  <ChevronDownIcon className="size-4 text-text-tertiary" />
                </button>
                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-60 rounded-xl border border-border-brand bg-surface p-1.5 shadow-md"
                  >
                    <div className="px-3 py-2 border-b border-border-subtle mb-1">
                      <p className="text-small font-semibold text-text truncate">
                        {user.fullName}
                      </p>
                      <p className="text-caption text-text-tertiary truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/me/profile"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center rounded-md px-3 py-2 text-small text-text hover:bg-surface-subtle"
                    >
                      Hồ sơ cá nhân
                    </Link>
                    <Link
                      href="/me/products"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center rounded-md px-3 py-2 text-small text-text hover:bg-surface-subtle"
                    >
                      Sản phẩm của tôi
                    </Link>
                    <Link
                      href="/me/auctions"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center rounded-md px-3 py-2 text-small text-text hover:bg-surface-subtle"
                    >
                      Phiên của tôi
                    </Link>
                    <Link
                      href="/me/bids"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center rounded-md px-3 py-2 text-small text-text hover:bg-surface-subtle"
                    >
                      Lượt đặt giá
                    </Link>
                    <Link
                      href="/me/orders"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center rounded-md px-3 py-2 text-small text-text hover:bg-surface-subtle"
                    >
                      Đơn hàng
                    </Link>
                    <div className="my-1 border-t border-border-subtle" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full flex-col items-start rounded-md px-3 py-2 text-left text-small text-danger hover:bg-danger-bg"
                    >
                      <span className="inline-flex items-center gap-2 font-medium">
                        <LogOutIcon className="size-4" />
                        Đăng xuất
                      </span>
                      <span className="text-caption text-text-tertiary">
                        Đăng xuất khỏi mọi thiết bị
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chuông thông báo di động (chỉ USER) */}
          {ready && isAuthenticated && !isAdmin && (
            <NotificationBell className="sm:hidden" />
          )}

          {/* Nút menu di động */}
          <button
            type="button"
            aria-label={mobileNavOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((o) => !o)}
            className="inline-flex size-11 items-center justify-center rounded-md text-text md:hidden hover:bg-surface-subtle"
          >
            {mobileNavOpen ? (
              <CloseIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Menu di động */}
      {mobileNavOpen && (
        <div className="border-t border-border-brand bg-surface px-4 py-4 md:hidden space-y-4">
          <form onSubmit={handleSearch} role="search" className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-placeholder" />
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm phiên đấu giá…"
              aria-label="Tìm phiên đấu giá"
              className="h-11 w-full rounded-md border border-border-brand bg-surface-subtle pl-9 pr-3 text-body-lg md:text-body text-text placeholder:text-text-placeholder"
            />
          </form>

          <nav aria-label="Điều hướng di động" className="flex flex-col gap-1">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className="flex min-h-11 items-center rounded-md px-3 py-2 text-body font-medium text-text hover:bg-surface-subtle"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-border-subtle pt-3">
            {!isAuthenticated || !user ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/register"
                  onClick={() => setMobileNavOpen(false)}
                  className={getButtonClassName({ variant: "secondary", size: "lg" })}
                >
                  Đăng ký
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileNavOpen(false)}
                  className={getButtonClassName({ variant: "primary", size: "lg" })}
                >
                  Đăng nhập
                </Link>
              </div>
            ) : isAdmin ? (
              <div className="flex flex-col gap-1">
                <Link
                  href="/admin"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex min-h-11 items-center rounded-md px-3 py-2 text-body font-medium text-primary-600 hover:bg-primary-50"
                >
                  Trang quản trị
                </Link>
                <Link
                  href="/admin/profile"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex min-h-11 items-center rounded-md px-3 py-2 text-body text-text hover:bg-surface-subtle"
                >
                  Hồ sơ cá nhân
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex min-h-11 items-center rounded-md px-3 py-2 text-left text-body font-medium text-danger hover:bg-danger-bg"
                >
                  Đăng xuất (mọi thiết bị)
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <Link
                  href="/me/profile"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex min-h-11 items-center rounded-md px-3 py-2 text-body text-text hover:bg-surface-subtle"
                >
                  Tài khoản ({user.fullName})
                </Link>
                <Link
                  href="/me/products"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex min-h-11 items-center rounded-md px-3 py-2 text-body text-text hover:bg-surface-subtle"
                >
                  Sản phẩm của tôi
                </Link>
                <Link
                  href="/me/auctions"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex min-h-11 items-center rounded-md px-3 py-2 text-body text-text hover:bg-surface-subtle"
                >
                  Phiên của tôi
                </Link>
                <Link
                  href="/me/bids"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex min-h-11 items-center rounded-md px-3 py-2 text-body text-text hover:bg-surface-subtle"
                >
                  Lượt đặt giá
                </Link>
                <Link
                  href="/me/orders"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex min-h-11 items-center rounded-md px-3 py-2 text-body text-text hover:bg-surface-subtle"
                >
                  Đơn hàng
                </Link>
                <Link
                  href="/me/notifications"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex min-h-11 items-center justify-between rounded-md px-3 py-2 text-body text-text hover:bg-surface-subtle"
                >
                  <span>Thông báo</span>
                  <NotificationUnreadBadge />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex min-h-11 items-center rounded-md px-3 py-2 text-left text-body font-medium text-danger hover:bg-danger-bg"
                >
                  Đăng xuất (mọi thiết bị)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-border-brand bg-surface">
      <div className="mx-auto flex max-w-page flex-col items-start justify-between gap-4 px-4 py-6 sm:flex-row sm:items-center md:px-6 lg:px-8">
        <span className="text-caption text-text-tertiary">
          © 2026 OmniBid
        </span>
        <span className="text-caption text-text-tertiary">
          Sàn đấu giá trực tuyến minh bạch
        </span>
      </div>
    </footer>
  );
}

export function PublicLayout({ children, hideFooter = false }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SkipLink />
      <Suspense
        fallback={
          <header className="sticky top-0 z-30 h-14 md:h-16 border-b border-border-brand bg-surface" />
        }
      >
        <PublicHeader />
      </Suspense>
      <main
        id="main-content"
        className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:px-6 lg:px-8"
      >
        {children}
      </main>
      {!hideFooter && <PublicFooter />}
    </div>
  );
}
