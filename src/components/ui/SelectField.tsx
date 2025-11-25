"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface SelectBoxProps<T> {
  label?: string;
  options: T[];
  value: T[];
  onChange: (val: T[]) => void;

  getLabel: (item: T) => string;
  getValue: (item: T) => string | number;

  placeholder?: string;
  required?: boolean;
  multiple?: boolean;

  onBlur?: (e: any) => void;
  errorMessage?: string;
}

export default function MultiSelectBox<T>({
  label,
  options,
  value,
  onChange,

  placeholder = "Select options",
  required,
  multiple = true,

  getLabel,
  getValue,

  onBlur,
  errorMessage,
}: SelectBoxProps<T>) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const hasValue = value.length > 0;
  const hasError = !!errorMessage;

  // Filter options if multiple
  const filteredOptions = multiple
    ? options.filter((opt) => !value.some((v) => getValue(v) === getValue(opt)))
    : options;

  const handleSelect = (item: T) => {
    if (multiple) {
      onChange([...value, item]);
    } else {
      onChange([item]);
      setOpen(false);
    }
  };

  const handleRemove = (e: React.MouseEvent, item: T) => {
    e.stopPropagation();
    onChange(value.filter((v) => getValue(v) !== getValue(item)));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
    setOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current) return;

      const clickedOutside = !wrapperRef.current.contains(e.target as Node);

      if (clickedOutside) {
        // close dropdown
        if (open) {
          setOpen(false);

          // call onBlur ONLY if user interacted
          if (onBlur) onBlur(e);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onBlur]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-semibold mb-1 text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Trigger/Input */}
      <div
        className={`w-full px-3 py-2 border rounded-lg bg-white cursor-pointer flex items-center min-h-[42px] transition
          ${
            hasError
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : open
              ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              : "border-gray-300"
          }`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {/* MULTIPLE: Selected Tags */}
        {multiple && hasValue ? (
          <div className="flex flex-wrap gap-2 pr-6">
            {value.map((item) => (
              <span
                key={getValue(item)}
                className="flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs"
              >
                {getLabel(item)}
                <X
                  className="w-3 h-3 ml-1 cursor-pointer"
                  onClick={(e) => handleRemove(e, item)}
                />
              </span>
            ))}
          </div>
        ) : (
          <span className={hasValue ? "text-gray-900" : "text-gray-400"}>
            {hasValue ? getLabel(value[0]) : placeholder}
          </span>
        )}

        {/* Icons */}
        <div className="ml-auto flex items-center gap-2">
          {hasValue && multiple && (
            <X
              className="w-4 h-4 text-gray-400 hover:text-gray-600"
              onClick={clearAll}
            />
          )}

          <ChevronDown
            className={`w-4 h-4 text-gray-600 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500 italic">
              No options available
            </div>
          ) : (
            filteredOptions.map((opt) => (
              <div
                key={getValue(opt)}
                onClick={() => handleSelect(opt)}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex justify-between"
              >
                {getLabel(opt)}

                {!multiple &&
                  hasValue &&
                  getValue(opt) === getValue(value[0]) && (
                    <span className="text-blue-500 font-semibold">✓</span>
                  )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Error Message */}
      {hasError && (
        <p className="text-xs text-red-500 font-medium mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
