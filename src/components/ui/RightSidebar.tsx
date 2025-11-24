"use client";

import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { CiFilter } from "react-icons/ci";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Button from "./button";

// ScrollArea Component
function ScrollArea({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`overflow-y-auto hide-scrollbar ${className}`}>
      {children}
    </div>
  );
}

// --- Types for RightSidebar ---
interface RightSidebarProps {
  trigger?: ReactNode; // optional trigger element
  children: (close: () => void) => ReactNode; // children is a function that receives close()
  title?: string;
}

// ---- Right Sidebar Wrapper ----
export default function RightSidebar({
  trigger,
  children,
  title = "Filter",
}: RightSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <>
      {trigger ? (
        <div onClick={open}>{trigger}</div>
      ) : (
        <Button
          variant="outline"
          onClick={open}
          className="flex items-center gap-2 px-3"
        >
          <CiFilter className="h-5 w-5" /> Filter
        </Button>
      )}

      <Transition show={isOpen}>
        <Dialog open={true} onClose={close} className="relative z-50" static>
          {/* Overlay */}
          <TransitionChild
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Sidebar Panel */}
          <TransitionChild
            as={DialogPanel}
            enter="ease-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
            className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-slate-900 shadow-xl flex flex-col rounded-l-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4 dark:border-slate-700">
              <h2 className="text-lg font-semibold">{title}</h2>
              <Button
                variant="outline"
                onClick={close}
                className="rounded-full p-1"
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 p-4">{children(close)}</ScrollArea>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
}
