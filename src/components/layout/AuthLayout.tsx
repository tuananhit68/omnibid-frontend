import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { SkipLink } from "./SkipLink";
import { MockModeBanner } from "./MockModeBanner";
import { ChevronLeftIcon } from "../icons";

export interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  maxWidth?: "sm" | "md" | "lg";
}

export function AuthLayout({
  children,
  title,
  subtitle,
  maxWidth = "md",
}: AuthLayoutProps) {
  const widthClass =
    maxWidth === "sm"
      ? "max-w-md"
      : maxWidth === "lg"
        ? "max-w-xl"
        : "max-w-lg";
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SkipLink />
      <MockModeBanner />
      <header className="mx-auto flex h-16 w-full max-w-page items-center justify-between px-4 md:px-6 lg:px-8">
        <Logo />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-small font-medium text-text-secondary hover:text-primary-600"
        >
          <ChevronLeftIcon className="size-4" />
          <span>Về trang chủ</span>
        </Link>
      </header>

      <main
        id="main-content"
        className="flex flex-1 items-center justify-center px-4 py-8"
      >
        <div
          className={`w-full ${widthClass} rounded-xl border border-border-brand bg-surface p-6 md:p-8`}
        >
          {(title || subtitle) && (
            <div className="mb-6 space-y-1">
              {title && <h1 className="text-h1 text-text">{title}</h1>}
              {subtitle && (
                <p className="text-small text-text-secondary">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
