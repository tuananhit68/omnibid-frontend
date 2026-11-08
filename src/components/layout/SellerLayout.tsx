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
  LogOutIcon,
} from "../icons";
import { IconButton } from "../ui/IconButton";
import { getStoredUser, clearAuthSession } from "@/lib/api/auth-storage";

export interface SellerLayoutProps {
  children: ReactNode;
}

export function SellerLayout({ children }: SellerLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const currentUser = typeof window !== "undefined" ? getStoredUser() : null;

  const sidebarItems = [
    { label: "Sản phẩm của tôi", href: "/seller/products" },
    { label: "Phiên đấu giá", href: "/seller/auctions" },
    { label: "Đơn hàng", href: "/seller/orders" },
  ];

  const handleLogout = () => {
    clearAuthSession();
    router.push("/login");
  };

  return (
    <div className="min-h-full flex flex-col bg-bg text-text">
      <SkipLink />

      {/* Top Header */}
      <header className="sticky top-0 z-40 h-16 w-full bg-surface border-b border-border-brand shadow-xs">
        <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <IconButton
              label="Mở menu quản lý"
              icon={<MenuIcon />}
              size="md"
              className="lg:hidden"
              onClick={() => setMobileSidebarOpen(true)}
            />
            <Logo href="/seller" />
            <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 text-caption font-semibold">
              Kênh Người Bán
            </span>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Tìm sản phẩm, đơn hàng của bạn…"
                className="w-full h-10 pl-9 pr-4 text-small text-text bg-surface-subtle border border-border-brand rounded-md outline-none focus-visible:border-primary-600 focus-visible:ring-2 focus-visible:ring-focus/20"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hidden sm:inline-flex text-small font-medium text-text-link hover:underline"
            >
              Chuyển sang Mua hàng
            </Link>

            <Link
              href="/notifications"
              className="p-2 rounded-full text-text-tertiary hover:text-text hover:bg-surface-subtle transition-colors focus-visible:outline-2 focus-visible:outline-focus"
              aria-label="Thông báo"
            >
              <BellIcon className="size-5" />
            </Link>

            {currentUser && (
              <div className="flex items-center gap-2.5 pl-2 border-l border-border-subtle">
                <div className="size-8 rounded-full bg-primary-50 text-primary-700 font-bold text-caption flex items-center justify-center border border-primary-200">
                  {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : "S"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-small font-semibold text-text leading-tight truncate max-w-[120px]">
                    {currentUser.fullName || "Người bán"}
                  </p>
                  <p className="text-caption text-text-tertiary truncate max-w-[120px]">
                    {currentUser.email}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-border-brand p-4 shrink-0 min-h-[calc(100vh-64px)]">
          <div className="mb-2 px-3">
            <span className="label font-medium text-text-tertiary">
              Quản lý cửa hàng
            </span>
          </div>

          <nav className="flex flex-col gap-1 flex-1">
            {sidebarItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center h-10 px-3.5 rounded-lg text-small font-medium transition-colors",
                    isActive
                      ? "bg-primary-600 text-text-inverse font-semibold"
                      : "text-text-secondary hover:bg-surface-subtle hover:text-text"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-border-subtle">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 h-10 px-3.5 rounded-lg text-small font-medium text-danger hover:bg-danger-bg transition-colors"
            >
              <LogOutIcon className="size-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex justify-start bg-overlay backdrop-blur-xs lg:hidden">
            <div className="w-64 h-full bg-surface shadow-lg flex flex-col p-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <span className="font-semibold text-text">Kênh Người Bán</span>
                <IconButton
                  label="Đóng menu"
                  icon={<CloseIcon />}
                  size="sm"
                  onClick={() => setMobileSidebarOpen(false)}
                />
              </div>

              <nav className="flex flex-col gap-1 mt-4 flex-1">
                {sidebarItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={cn(
                        "flex items-center h-10 px-3 rounded-lg text-small font-medium transition-colors",
                        isActive
                          ? "bg-primary-600 text-text-inverse font-semibold"
                          : "text-text-secondary hover:bg-surface-subtle"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="border-t border-border-subtle my-2" />
                <Link
                  href="/"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="px-3 py-2 text-small text-text-link hover:underline"
                >
                  Chuyển sang Mua hàng
                </Link>
              </nav>

              <div className="pt-4 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 h-10 px-3 rounded-lg text-small font-medium text-danger hover:bg-danger-bg"
                >
                  <LogOutIcon className="size-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main
          id="main-content"
          className="flex-1 w-full max-w-[1216px] p-4 md:p-6 lg:p-8 overflow-y-auto"
        >
          {children}
        </main>
      </div>

      <footer className="w-full bg-surface border-t border-border-brand py-3 px-6 text-caption text-text-tertiary text-center">
        © 2026 OmniBid Kênh Người Bán.
      </footer>
    </div>
  );
}
