import Link from "next/link";
import { cn } from "@/lib/cn";

export interface LogoProps {
  href?: string;
  className?: string;
}

export function Logo({ href = "/", className }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 font-bold text-h2 tracking-tight text-primary-700 select-none focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 rounded-md",
        className
      )}
      aria-label="OmniBid Trang chủ"
    >
      <span className="size-8 rounded-lg bg-primary-700 text-text-inverse flex items-center justify-center font-bold text-h3">
        O
      </span>
      <span>OmniBid</span>
    </Link>
  );
}

