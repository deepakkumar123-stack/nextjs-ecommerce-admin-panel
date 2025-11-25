"use client";

import React, {
  forwardRef,
  ChangeEvent,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type InputVariant = "default" | "success" | "error" | "warning";

interface BaseProps {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  variant?: InputVariant;

  /**
   * Generic start icon (alternative to startIcon)
   * Usage: <Input icon={<Search />} />
   */
  icon?: React.ReactNode;

  /** Explicit start icon (overrides icon) */
  startIcon?: React.ReactNode;

  /** Ending icon (e.g., eye icon for password) */
  endIcon?: React.ReactNode;

  className?: string;
  name?: string;
}

interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
  as?: "input";
}

interface TextareaProps
  extends BaseProps,
    TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: "textarea";
}

type AdvancedInputProps = InputProps | TextareaProps;

/** Tailwind Variants */
const variantStyles: Record<InputVariant, string> = {
  default:
    "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
  success:
    "border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-200",
  error: "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200",
  warning:
    "border-yellow-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200",
};

const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  AdvancedInputProps
>((props, ref) => {
  const {
    as = "input",
    label,
    helperText,
    errorMessage,
    variant = "default",

    icon,
    startIcon,
    endIcon,

    className,
    name,
    onChange,
    ...rest
  } = props;

  const hasError = !!errorMessage;

  const Element = as === "textarea" ? "textarea" : "input";

  /** final start icon = explicit startIcon > generic icon */
  const leftIcon = startIcon || icon;

  /** handle onChange correctly based on element type */
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!onChange) return;

    if (as === "textarea") {
      (onChange as (e: ChangeEvent<HTMLTextAreaElement>) => void)(
        event as ChangeEvent<HTMLTextAreaElement>
      );
    } else {
      (onChange as (e: ChangeEvent<HTMLInputElement>) => void)(
        event as ChangeEvent<HTMLInputElement>
      );
    }
  };

  return (
    <div className="flex flex-col space-y-1 w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-gray-700"
        >
          {label}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative w-full">
        {/* Start Icon */}
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </span>
        )}

        {/* Input / Textarea */}
        <Element
          id={name}
          name={name}
          ref={ref}
          onChange={handleChange}
          className={`
            w-full rounded-md border bg-white 
            px-3 py-2 text-sm outline-none transition-all
            placeholder-gray-400
            ${variantStyles[hasError ? "error" : variant]}
            ${leftIcon ? "pl-10" : ""}
            ${endIcon ? "pr-10" : ""}
            ${className ?? ""}
          `}
          {...rest}
        />

        {/* End Icon */}
        {endIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
            {endIcon}
          </span>
        )}
      </div>

      {/* Helper/Error Text */}
      {!hasError && helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}

      {hasError && (
        <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
