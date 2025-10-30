"use client";

import React, { useState, ReactNode } from "react";
import Toast from "./toast";

type ToastVariant = "success" | "error" | "warning" | "info";
type ToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

interface ToastMessage {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

export const ToastContext = React.createContext<{
  addToast: (
    title: string,
    variant?: ToastVariant,
    description?: string
  ) => void;
} | null>(null);

let toastId = 0;

interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition; // NEW: Position prop
}

const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = "top-right",
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    title: string,
    variant: ToastVariant = "info",
    description?: string
  ) => {
    toastId++;
    setToasts((prev) => [
      ...prev,
      { id: toastId, title, description, variant },
    ]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Map position to Tailwind classes
  const positionClasses: Record<ToastPosition, string> = {
    "top-right": "top-5 right-5 items-end",
    "top-left": "top-5 left-5 items-start",
    "bottom-right": "bottom-5 right-5 items-end",
    "bottom-left": "bottom-5 left-5 items-start",
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container */}
      <div
        className={`fixed z-50 flex flex-col gap-3 ${positionClasses[position]}`}
      >
        {toasts.map((t) => (
          <Toast
            key={t.id}
            title={t.title}
            description={t.description}
            variant={t.variant}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
