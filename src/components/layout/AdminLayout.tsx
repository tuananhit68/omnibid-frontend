"use client";

import { Suspense, useState, useRef, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useSession } from "@/lib/auth/session";
import { useLogout } from "@/features/auth/hooks";
import { Logo } from "./Logo";
import { SkipLink } from "./SkipLink";
import { MockModeBanner } from "./MockModeBanner";
import { Avatar } from "../ui/Avatar";
import {
  BoxIcon,
  ChevronDownIcon,
  CloseIcon,
  FlagIcon,
  GavelIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  ShoppingBagIcon,
  TagIcon,
  UsersIcon,
} from "../icons";

export interface AdminLayoutProps {
  children: ReactNode;
  pendingReports?: number;
}

const ADMIN_NAV = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboardIcon, exact: true },
  { href: "/admin/users", label: "Người dùng", icon: UsersIcon },
  { href: "/admin/products", label: "Sản phẩm", icon: BoxIcon },
  { href: "/admin/auctions", label: "Phiên đấu giá", icon: GavelIcon },
  { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingBagIcon },
  { href: "/admin/categories", label: "Danh mục", icon: TagIcon },
  { href: "/admin/reports", label: "Báo cáo vi phạm", icon: FlagIcon },
] as const;

function AdminLayoutInner({ children, pendingReports = 0 }: AdminLayoutProps) {
  const pathname = usePathname();
  const { user } = useSession();
  const { logout } = useLogout();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
  };

  const renderNavLinks = (onNavigate?: () => void) => (
    <nav aria-label="Điều hướng quản trị" className="space-y-1">
      {ADMIN_NAV.map((item) => {
        const Icon = item.icon;
        const active =
          "exact" in item && item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
        const showBadge = item.href === "/admin/reports" && pendingReports > 0;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex h-11 items-center justify-between rounded-md px-3 text-small font-medium transition-colors",
              active
                ? "bg-primary-50 text-primary-600"
                : "text-text-secondary hover:bg-surface-subtle hover:text-text"
            )}
          >
            <span className="inline-flex items-center gap-2.5">
              <Icon className="size-4.5 shrink-0" />
              <span>{item.label}</span>
            </span>
            {showBadge && (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-warning-bg px-1.5 py-0.5 text-caption font-semibold text-warning-strong tabular">
                {pendingReports > 99 ? "99+" : pendingReports}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SkipLink />
      <header className="sticky top-0 z-30 border-b border-border-brand bg-surface">
        <MockModeBanner />
        <div className="flex h-14 md:h-16 items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Mở menu quản trị"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex size-10 items-center justify-center rounded-md text-text lg:hidden hover:bg-surface-subtle"
            >
              <MenuIcon className="size-5" />
            </button>
            <Logo href="/admin" />
            <span className="hidden sm:inline-flex items-center rounded-sm bg-primary-50 px-2 py-0.5 text-caption font-semibold text-primary-700">
              Quản trị viên
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="hidden sm:inline-flex whitespace-nowrap text-small font-medium text-text-link hover:underline"
            >
              Xem sàn đấu giá
            </Link>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-border-brand bg-surface px-2.5 text-small font-medium text-text hover:bg-surface-subtle"
              >
                <Avatar src={user?.avatarUrl} name={user?.fullName ?? "Admin"} size="sm" />
                <span className="hidden sm:inline max-w-32 truncate">
                  {user?.fullName ?? "Quản trị viên"}
                </span>
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
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar 256px trên desktop */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-border-brand bg-surface p-4">
          {renderNavLinks()}
        </aside>

        {/* Drawer mobile */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-40 flex lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu quản trị"
          >
            <div
              className="fixed inset-0 bg-overlay"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="relative z-10 flex w-72 max-w-full flex-col bg-surface p-4 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <Logo href="/admin" />
                <button
                  type="button"
                  aria-label="Đóng menu quản trị"
                  onClick={() => setDrawerOpen(false)}
                  className="inline-flex size-10 items-center justify-center rounded-md text-text-secondary hover:bg-surface-subtle"
                >
                  <CloseIcon className="size-5" />
                </button>
              </div>
              {renderNavLinks(() => setDrawerOpen(false))}
              <div className="mt-auto border-t border-border-subtle pt-4">
                <Link
                  href="/"
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-10 items-center rounded-md px-3 text-small font-medium text-text-link hover:bg-surface-subtle"
                >
                  Xem sàn đấu giá
                </Link>
              </div>
            </div>
          </div>
        )}

        <main id="main-content" className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminLayout(props: AdminLayoutProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg">
          <div className="h-16 border-b border-border-brand bg-surface" />
        </div>
      }
    >
      <AdminLayoutInner {...props} />
    </Suspense>
  );
}
