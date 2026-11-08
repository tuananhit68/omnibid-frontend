import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SkipLink } from "./SkipLink";
import { Logo } from "./Logo";

export interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  maxWidth?: "sm" | "md" | "lg";
}

const maxWidthStyles = {
  sm: "max-w-[440px]",
  md: "max-w-[520px]", // Chuẩn S04 Đăng nhập
  lg: "max-w-[620px]", // Chuẩn S03 Đăng ký
};

export function AuthLayout({
  children,
  title,
  subtitle,
  maxWidth = "md",
}: AuthLayoutProps) {
  return (
    <div className="min-h-full flex flex-col justify-center items-center bg-bg text-text p-4 py-8 md:py-16">
      <SkipLink />

      {/* Logo quay về trang chủ */}
      <div className="mb-6 flex justify-center">
        <Logo />
      </div>

      {/* Auth Card */}
      <div
        id="main-content"
        className={cn(
          "w-full bg-surface border border-border-brand rounded-xl shadow-xs p-6 sm:p-8 md:p-10",
          maxWidthStyles[maxWidth]
        )}
      >
        {(title || subtitle) && (
          <div className="text-center mb-6">
            {title && (
              <h1 className="text-h1 font-semibold text-text">{title}</h1>
            )}
            {subtitle && (
              <p className="mt-2 text-small text-text-secondary">{subtitle}</p>
            )}
          </div>
        )}

        {children}
      </div>

      <footer className="mt-8 text-center text-caption text-text-tertiary">
        © 2026 OmniBid. Nền tảng đấu giá trực tuyến.
      </footer>
    </div>
  );
}

