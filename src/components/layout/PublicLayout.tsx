"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { SkipLink } from "./SkipLink";
import { Logo } from "./Logo";
import {
  BellIcon,
  MenuIcon,
  CloseIcon,
  SearchIcon,
  UserIcon,
  LogOutIcon,
} from "../icons";
import { IconButton } from "../ui/IconButton";
import { Button } from "../ui/Button";
import { getStoredUser, clearAuthSession } from "@/lib/api/auth-storage";

export interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/auctions?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/auctions");
    }
    setMobileDrawerOpen(false);
  };

  // Lấy thông tin user hiện tại
  const currentUser = typeof window !== "undefined" ? getStoredUser() : null;
  const isAuthenticated = Boolean(currentUser);

  const guestNav = [
    { label: "Trang chủ", href: "/" },
    { label: "Phiên đấu giá", href: "/auctions" },
  ];

  const userNav = [
    { label: "Trang chủ", href: "/" },
    { label: "Phiên đấu giá", href: "/auctions" },
    { label: "Theo dõi", href: "/watchlist" },
    { label: "Lượt đặt giá", href: "/me/bids" },
    { label: "Đơn hàng", href: "/orders" },
  ];

  const navItems = isAuthenticated ? userNav : guestNav;

  const handleLogout = () => {
    clearAuthSession();
    router.push("/login");
  };

  return (
    <div className="min-h-full flex flex-col bg-bg text-text">
      <SkipLink />

      {/* Top Header */}
      <header className="sticky top-0 z-40 h-16 w-full bg-surface/95 backdrop-blur-md border-b border-border-brand shadow-xs">
        <div className="h-full mx-auto w-full max-w-(--container-page) px-4 md:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Logo />
            <nav
              aria-label="Điều hướng chính"
              className="hidden lg:flex items-center gap-6 text-small font-medium"
            >
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "transition-colors py-1 relative",
                      isActive
                        ? "text-primary-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600"
                        : "text-text-secondary hover:text-text"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Ô tìm kiếm desktop */}
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className="hidden md:flex items-center flex-1 max-w-[380px] mx-4"
          >
            <div className="relative w-full">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Tìm kiếm phiên đấu giá"
                placeholder="Tìm kiếm phiên đấu giá, sản phẩm…"
                className="w-full h-10 pl-9 pr-4 text-small text-text placeholder:text-text-placeholder bg-surface-subtle border border-border-brand rounded-md outline-none focus-visible:border-primary-600 focus-visible:ring-2 focus-visible:ring-focus/20"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary pointer-events-none" />
            </div>
          </form>

          {/* Khối bên phải (Đăng nhập / User menu) */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/notifications"
                  className="relative p-2 rounded-full text-text-tertiary hover:text-text hover:bg-surface-subtle transition-colors focus-visible:outline-2 focus-visible:outline-focus"
                  aria-label="Thông báo"
                >
                  <BellIcon className="size-5" />
                  <span className="absolute top-1.5 right-1.5 size-2 bg-danger rounded-full" />
                </Link>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2.5 p-1 rounded-full hover:bg-surface-subtle transition-colors focus-visible:outline-2 focus-visible:outline-focus"
                    aria-expanded={userDropdownOpen}
                  >
                    <div className="size-8 rounded-full bg-primary-50 text-primary-700 font-bold text-caption flex items-center justify-center border border-primary-200">
                      {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="text-small font-semibold text-text max-w-[120px] truncate">
                      {currentUser.fullName || currentUser.email}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-surface border border-border-brand shadow-md py-1.5 z-50 text-small">
                      <div className="px-4 py-2 border-b border-border-subtle">
                        <p className="font-semibold text-text truncate">
                          {currentUser.fullName}
                        </p>
                        <p className="text-caption text-text-tertiary truncate">
                          {currentUser.email}
                        </p>
                      </div>
                      <Link
                        href="/me/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-text hover:bg-surface-subtle transition-colors"
                      >
                        <UserIcon className="size-4 text-text-tertiary" />
                        <span>Cài đặt tài khoản</span>
                      </Link>
                      <Link
                        href="/seller"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-text hover:bg-surface-subtle transition-colors"
                      >
                        <span>Kênh Người Bán</span>
                      </Link>
                      {currentUser.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
                        >
                          <span>Quản trị hệ thống</span>
                        </Link>
                      )}
                      <div className="border-t border-border-subtle my-1" />
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-danger hover:bg-danger-bg transition-colors"
                      >
                        <LogOutIcon className="size-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link href="/register">
                  <Button variant="outline" size="md">
                    Đăng ký
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="primary" size="md">
                    Đăng nhập
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Nút Hamburger Mobile */}
          <div className="flex lg:hidden items-center gap-1">
            <Link
              href="/auctions"
              className="md:hidden size-11 inline-flex items-center justify-center rounded-md text-text-tertiary hover:bg-surface-subtle"
              aria-label="Tìm kiếm phiên đấu giá"
            >
              <SearchIcon className="size-5" />
            </Link>
            {isAuthenticated && (
              <Link
                href="/notifications"
                className="size-11 inline-flex items-center justify-center rounded-md text-text-tertiary hover:bg-surface-subtle"
                aria-label="Thông báo"
              >
                <BellIcon className="size-5" />
              </Link>
            )}
            <IconButton
              label="Mở menu"
              icon={<MenuIcon />}
              size="lg"
              onClick={() => setMobileDrawerOpen(true)}
            />
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-overlay backdrop-blur-xs lg:hidden">
          <div className="w-full max-w-xs h-full bg-surface shadow-lg flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
              <Logo />
              <IconButton
                label="Đóng menu"
                icon={<CloseIcon />}
                size="sm"
                onClick={() => setMobileDrawerOpen(false)}
              />
            </div>

            <form onSubmit={handleSearchSubmit} role="search" className="mt-4">
              <div className="relative w-full">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Tìm kiếm phiên đấu giá"
                  placeholder="Tìm kiếm phiên đấu giá…"
                  className="w-full h-11 pl-9 pr-4 text-body-lg md:text-small text-text placeholder:text-text-placeholder bg-surface-subtle border border-border-brand rounded-md outline-none focus-visible:border-primary-600"
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary pointer-events-none" />
              </div>
            </form>

            <nav className="flex flex-col gap-2 mt-4 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileDrawerOpen(false)}
                  className="py-2.5 px-3 rounded-lg text-body font-medium text-text hover:bg-surface-subtle"
                >
                  {item.label}
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <div className="border-t border-border-subtle my-2" />
                  <Link
                    href="/seller"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="py-2.5 px-3 rounded-lg text-body font-medium text-primary-700"
                  >
                    Kênh Người Bán
                  </Link>
                  {currentUser?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="py-2.5 px-3 rounded-lg text-body font-medium text-primary-700"
                    >
                      Quản trị hệ thống
                    </Link>
                  )}
                </>
              )}
            </nav>

            <div className="pt-4 border-t border-border-subtle">
              {isAuthenticated ? (
                <Button
                  variant="danger-soft"
                  size="lg"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Button>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/login"
                    onClick={() => setMobileDrawerOpen(false)}
                  >
                    <Button variant="primary" size="lg" className="w-full">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileDrawerOpen(false)}
                  >
                    <Button variant="outline" size="lg" className="w-full">
                      Đăng ký
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        id="main-content"
        className="flex-1 w-full mx-auto max-w-(--container-page) px-4 md:px-6 lg:px-8 py-6 md:py-8"
      >
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface border-t border-border-brand py-6 px-4 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-(--container-page) flex flex-col md:flex-row items-center justify-between gap-4 text-small text-text-tertiary">
          <p>© 2026 OmniBid. Sàn đấu giá trực tuyến minh bạch & chuẩn xác.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-text transition-colors">
              Điều khoản
            </Link>
            <Link href="/rules" className="hover:text-text transition-colors">
              Quy chế hoạt động
            </Link>
            <Link href="/privacy" className="hover:text-text transition-colors">
              Bảo mật
            </Link>
            <Link href="/help" className="hover:text-text transition-colors">
              Trợ giúp
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
