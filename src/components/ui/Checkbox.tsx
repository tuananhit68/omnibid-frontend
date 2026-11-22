import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { CheckIcon } from "../icons";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
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
            "inline-flex items-center gap-3 min-h-11 cursor-pointer select-none",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <div className="relative flex items-center justify-center">
            <input
              ref={ref}
              id={id}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              className="peer sr-only"
              {...props}
            />
            <div
              className={cn(
                "size-4.5 rounded-sm border border-border-strong bg-surface transition-colors flex items-center justify-center",
                "peer-checked:bg-primary-600 peer-checked:border-primary-600 peer-checked:text-text-inverse peer-checked:[&>svg]:opacity-100",
                "peer-focus-visible:outline-2 peer-focus-visible:outline-focus peer-focus-visible:outline-offset-2",
                error && "border-danger"
              )}
            >
              <CheckIcon className="size-3.5 stroke-2 opacity-0 transition-opacity text-text-inverse" />
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

Checkbox.displayName = "Checkbox";

