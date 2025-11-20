"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./button";
import {
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  AlertTriangle,
} from "lucide-react";

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
  danger: {
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    btnVariant: "danger" as const, // Cast to literal type
    Icon: XCircle,
  },
  warning: {
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    btnVariant: "warning" as const, // Use 'warning' for button if available, or 'danger'
    Icon: AlertTriangle,
  },
  info: {
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    btnVariant: "primary" as const,
    Icon: Info,
  },
  success: {
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    btnVariant: "success" as const,
    Icon: CheckCircle,
  },
  primary: {
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    btnVariant: "primary" as const,
    Icon: AlertCircle, // Reusing Info/AlertCircle for a generic primary
  },
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
  // const styles = variantStyles[variant];
  const { iconBg, iconColor, btnVariant, Icon } = variantStyles[variant];

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
            <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-200 ">
              <motion.div
                className={`${iconBg} p-2 rounded-full flex items-center justify-center`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                <motion.div
                  initial={{ rotate: 360 }}
                  animate={{ rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <Icon className={`${iconColor}`} size={28} />{" "}
                  {/* Larger, modern icon */}{" "}
                </motion.div>
              </motion.div>

              {/* Title */}
              {title && (
                <h3
                  id="alert-dialog-title"
                  className={`text-xl font-bold text-gray-900 px-4 text-center`}
                >
                  {title}
                </h3>
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
              className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-200 "
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
