"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./button";

type AlertVariant = "danger" | "warning" | "info" | "success" | "primary";

type AlertDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string | ReactNode;
  variant?: AlertVariant;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
};

const variantStyles = {
  danger: { iconBg: "bg-red-100", iconColor: "text-red-600", btn: "danger" },
  warning: {
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    btn: "danger",
  },
  info: { iconBg: "bg-blue-100", iconColor: "text-blue-600", btn: "primary" },
  success: {
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    btn: "success",
  },
  primary: {
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    btn: "primary",
  },
};

const defaultIcons = {
  danger: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  info: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
  success: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  primary: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

export const MotionAlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  variant = "warning",
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
}) => {
  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b">
              <motion.div
                className={`${styles.iconBg} p-2 rounded-full flex items-center justify-center`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                <motion.div
                  initial={{ rotate: 270 }}
                  animate={{ rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  {defaultIcons[variant]}
                </motion.div>
              </motion.div>

              {title && (
                <h3 className={`font-semibold ${styles.iconColor}`}>{title}</h3>
              )}

              <button
                onClick={onClose}
                className="ml-auto text-gray-500 hover:text-gray-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <motion.div
              className="px-6 py-5 text-gray-700 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {description}
            </motion.div>

            {/* Footer */}
            <motion.div
              className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Button variant="secondary" shape="rounded" onClick={onClose}>
                {cancelText}
              </Button>
              <Button
                variant={variant}
                onClick={() => {
                  onConfirm?.();
                  onClose();
                }}
              >
                {confirmText}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
