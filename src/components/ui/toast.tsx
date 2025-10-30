"use client";
import React, { JSX, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, MessageCircleWarning } from "lucide-react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // auto hide in ms
  onClose: () => void;
}

const variantStyles: Record<
  ToastVariant,
  { bg: string; border: string; text: string; icon: JSX.Element }
> = {
  success: {
    bg: "bg-green-50",
    border: "border-green-300",
    text: "text-green-700",
    icon: <CheckCircle className="w-6 h-6 text-green-500" />,
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-300",
    text: "text-red-700",
    icon: <XCircle className="w-6 h-6 text-red-500" />,
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    text: "text-yellow-700",
    icon: <MessageCircleWarning className="w-6 h-6 text-yellow-500" />,
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-700",
    icon: <Info className="w-6 h-6 text-blue-500" />,
  },
};

const Toast: React.FC<ToastProps> = ({
  title,
  description,
  variant = "info",
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`w-full max-w-sm ${styles.bg} ${styles.border} border-l-4 rounded-lg shadow-lg flex items-start gap-3 p-4`}
      >
        {/* Icon */}
        <div className="flex-shrink-0">{styles.icon}</div>

        {/* Text content */}
        <div className="flex-1 flex flex-col">
          <span className={`font-semibold ${styles.text}`}>{title}</span>
          {description && (
            <span className="text-sm text-gray-600 mt-1">{description}</span>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors rounded focus:outline-none focus:ring-1 focus:ring-gray-300"
          aria-label="Close"
        >
          ✖
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
