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
        "inline-flex items-center gap-2 font-bold text-[22px] tracking-tight text-primary-700 select-none focus-visible:outline-2 focus-visible:outline-focus",
        className
      )}
      aria-label="OmniBid Trang chủ"
    >
      <span className="size-8 rounded-lg bg-primary-700 text-text-inverse flex items-center justify-center font-bold text-[18px]">
        O
      </span>
      <span>OmniBid</span>
    </Link>
  );
}
