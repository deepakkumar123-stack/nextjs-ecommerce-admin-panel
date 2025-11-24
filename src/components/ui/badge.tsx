"use client";

import React from "react";

type BadgeVariant =
  | "default"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "primary";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const Badge = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) => {
  const baseStyles =
    "inline-flex items-center rounded-full font-medium whitespace-nowrap";

  const sizeStyles =
    size === "sm"
      ? "text-xs px-2 py-[2px]"
      : size === "lg"
      ? "text-base px-4 py-1"
      : "text-sm px-3 py-[3px]";

  const variantStyles =
    variant === "success"
      ? "bg-green-500/15 text-green-600"
      : variant === "danger"
      ? "bg-red-500/15 text-red-600"
      : variant === "warning"
      ? "bg-yellow-500/15 text-yellow-600"
      : variant === "info"
      ? "bg-blue-500/15 text-blue-600"
      : variant === "primary"
      ? "bg-purple-500/15 text-purple-600"
      : "bg-gray-200 text-gray-700";

  return (
    <span
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
