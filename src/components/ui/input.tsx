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
  startIcon?: React.ReactNode;
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
    startIcon,
    endIcon,
    className,
    name,
    onChange,
    ...rest
  } = props;

  const baseStyles =
    "w-full rounded-md border px-3 py-2 text-sm outline-none transition-all placeholder-gray-400";

  const variantStyles = {
    default:
      "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
    success:
      "border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-200",
    error:
      "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200",
    warning:
      "border-yellow-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200",
  };

  const Element = as === "textarea" ? "textarea" : "input";

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
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative w-full">
        {startIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {startIcon}
          </span>
        )}

        <Element
          id={name}
          name={name}
          ref={ref}
          className={`
            ${baseStyles}
            ${variantStyles[variant]}
            ${startIcon ? "pl-10" : ""}
            ${endIcon ? "pr-10" : ""}
            ${className ?? ""}
          `}
          {...rest}
          onChange={handleChange}
        />

        {endIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
            {endIcon}
          </span>
        )}
      </div>

      {!errorMessage && helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
