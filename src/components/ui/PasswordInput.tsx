import { forwardRef, useState } from "react";
import { Input, type InputProps } from "./Input";
import { EyeIcon, EyeOffIcon } from "../icons";

export type PasswordInputProps = Omit<
  InputProps,
  "type" | "rightIcon"
>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Input
        ref={ref}
        type={showPassword ? "text" : "password"}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            className="p-1 rounded text-text-tertiary hover:text-text transition-colors focus-visible:outline-2 focus-visible:outline-focus"
          >
            {showPassword ? (
              <EyeOffIcon className="size-4.5" />
            ) : (
              <EyeIcon className="size-4.5" />
            )}
          </button>
        }
        {...props}
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";

