import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      id: customId,
      label,
      hint,
      error,
      checked,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;

    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <label
          htmlFor={id}
          className={cn(
            "inline-flex items-center gap-3 min-h-[44px] cursor-pointer select-none",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <div className="relative flex items-center justify-center">
            <input
              ref={ref}
              id={id}
              type="radio"
              checked={checked}
              disabled={disabled}
              className="peer sr-only"
              {...props}
            />
            <div
              className={cn(
                "size-4.5 rounded-full border border-border-strong bg-surface transition-colors flex items-center justify-center",
                "peer-checked:border-primary-600 peer-checked:bg-surface peer-checked:[&>div]:opacity-100",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-focus/30 peer-focus-visible:ring-offset-2",
                error && "border-danger"
              )}
            >
              <div className="size-2 rounded-full bg-primary-600 opacity-0 transition-opacity" />
            </div>
          </div>

          {(label || hint) && (
            <div className="text-small">
              {label && <span className="font-medium text-text">{label}</span>}
              {hint && <p className="text-caption text-text-tertiary">{hint}</p>}
            </div>
          )}
        </label>
        {error && <p className="text-caption text-danger">{error}</p>}
      </div>
    );
  }
);

Radio.displayName = "Radio";

