import React from "react";
import { HTMLMotionProps, motion } from "framer-motion";
type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "success"
  | "warning"
  | "info";
type ButtonSize = "sm" | "md" | "lg";
type ButtonShape = "rounded" | "pill" | "square";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  shape = "rounded",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none";

  // Variants
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-900 hover:bg-purple-400",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-blue-500 hover:text-white",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    info: "bg-sky-500 text-white hover:bg-sky-600",
  };

  // Sizes
  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Shapes
  const shapes: Record<ButtonShape, string> = {
    rounded: "rounded-lg",
    pill: "rounded-full",
    square: "rounded-none",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${shapes[shape]} ${className}`}
      {...(props as HTMLMotionProps<"button">)}
    >
      {children}
    </motion.button>
  );
};

export default Button;
