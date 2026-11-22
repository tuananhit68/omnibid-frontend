"use client";

import { cn } from "@/lib/cn";
import { evaluatePasswordStrength } from "../schemas";

interface PasswordStrengthMeterProps {
  password: string;
}

const BAR_ACTIVE_CLASS = {
  danger: "bg-danger",
  warning: "bg-warning",
  info: "bg-info",
  success: "bg-success",
} as const;

const TEXT_TONE_CLASS = {
  danger: "text-danger",
  warning: "text-warning-strong",
  info: "text-info",
  success: "text-success-strong",
} as const;

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const { score, label, tone } = evaluatePasswordStrength(password);

  return (
    <div className="mt-2 space-y-1.5" aria-live="polite">
      <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={cn(
              "h-1.5 rounded-full transition-colors",
              step <= score ? BAR_ACTIVE_CLASS[tone] : "bg-surface-muted"
            )}
          />
        ))}
      </div>
      <p className="text-caption text-text-tertiary">
        Độ mạnh mật khẩu:{" "}
        <span className={cn("font-medium", TEXT_TONE_CLASS[tone])}>{label}</span>
      </p>
    </div>
  );
}
