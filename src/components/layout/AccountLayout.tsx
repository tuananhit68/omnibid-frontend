"use client";

import { Suspense, useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useUnreadNotificationCount } from "@/features/notification/hooks";
import { SkipLink } from "./SkipLink";
import { PublicFooter, PublicHeader } from "./PublicLayout";
import { Breadcrumb } from "../ui/Breadcrumb";
import {
  BellIcon,
  BoxIcon,
  CloseIcon,
  GavelIcon,
  HistoryIcon,
  MenuIcon,
  ShoppingBagIcon,
  UserIcon,
} from "../icons";

export interface AccountLayoutProps {
  children: ReactNode;
  unreadNotifications?: number;
}

const ACCOUNT_NAV = [
  { href: "/me/profile", label: "Hồ sơ", icon: UserIcon },
  { href: "/me/products", label: "Sản phẩm của tôi", icon: BoxIcon },
  { href: "/me/auctions", label: "Phiên của tôi", icon: GavelIcon },
  { href: "/me/bids", label: "Lượt đặt giá", icon: HistoryIcon },
  { href: "/me/orders", label: "Đơn hàng", icon: ShoppingBagIcon },
  { href: "/me/notifications", label: "Thông báo", icon: BellIcon },
] as const;

function resolveCurrentSectionLabel(pathname: string): string {
  if (pathname.startsWith("/orders/")) return "Chi tiết đơn hàng";
  const found = ACCOUNT_NAV.find((item) => pathname.startsWith(item.href));
  return found?.label ?? "Tài khoản";
}

function AccountLayoutInner({
  children,
  unreadNotifications,
}: AccountLayoutProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { unreadCount: fetchedUnread } = useUnreadNotificationCount();
  const unreadCount = unreadNotifications ?? fetchedUnread;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const currentLabel = resolveCurrentSectionLabel(pathname);

  const renderNavLinks = (onNavigate?: () => void) => (
    <nav aria-label="Menu tài khoản" className="space-y-1">
      {ACCOUNT_NAV.map((item) => {
        const Icon = item.icon;
        const active =
          pathname.startsWith(item.href) ||
          (item.href === "/me/orders" && pathname.startsWith("/orders/"));
        const showBadge =
          item.href === "/me/notifications" && unreadCount > 0;

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
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-danger px-1.5 py-0.5 text-caption font-semibold text-text-inverse tabular">
                {unreadCount > 9 ? "9+" : unreadCount}
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
      <PublicHeader />

      <div className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Tài khoản", href: "/me/profile" },
              { label: currentLabel },
            ]}
          />
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Mở danh mục tài khoản"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border-brand bg-surface px-3 text-small font-medium text-text lg:hidden hover:bg-surface-subtle"
          >
            <MenuIcon className="size-4" />
            <span>Tài khoản</span>
          </button>
        </div>

        <div className="flex items-start gap-6">
          {/* Sidebar 256px trên desktop */}
          <aside className="hidden lg:block w-64 shrink-0 rounded-xl border border-border-brand bg-surface p-4">
            <p className="mb-3 px-3 text-h4 text-text">Tài khoản</p>
            {renderNavLinks()}
          </aside>

          {/* Drawer mobile */}
          {drawerOpen && (
            <div
              className="fixed inset-0 z-40 flex lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Danh mục tài khoản"
            >
              <div
                className="fixed inset-0 bg-overlay"
                onClick={() => setDrawerOpen(false)}
              />
              <div className="relative z-10 flex w-72 max-w-full flex-col bg-surface p-4 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-h3 text-text">Tài khoản</span>
                  <button
                    type="button"
                    aria-label="Đóng danh mục tài khoản"
                    onClick={() => setDrawerOpen(false)}
                    className="inline-flex size-10 items-center justify-center rounded-md text-text-secondary hover:bg-surface-subtle"
                  >
                    <CloseIcon className="size-5" />
                  </button>
                </div>
                {renderNavLinks(() => setDrawerOpen(false))}
              </div>
            </div>
          )}

          {/* Nội dung chính tối đa 960px */}
          <main id="main-content" className="min-w-0 flex-1 max-w-240">
            {children}
          </main>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}

export function AccountLayout(props: AccountLayoutProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg">
          <div className="h-16 border-b border-border-brand bg-surface" />
        </div>
      }
    >
      <AccountLayoutInner {...props} />
    </Suspense>
  );
}
