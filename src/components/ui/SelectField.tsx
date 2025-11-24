"use client";

import { useEffect, useRef, useState } from "react";

export type SelectOption<T> = T;

interface SelectBoxProps<T> {
  label?: string;
  options: SelectOption<T>[];
  value: T[]; // always an array
  onChange: (val: T[]) => void;
  placeholder?: string;
  required?: boolean;
  multiple?: boolean;
  getLabel: (item: T) => string;
  getValue: (item: T) => string | number;
}

export default function SelectBox<T>({
  label,
  options,
  value,
  onChange,
  placeholder = "Select option",
  required,
  multiple = true,
  getLabel,
  getValue,
}: SelectBoxProps<T>) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options: hide selected ones
  const filteredOptions = options.filter(
    (opt) => !value.some((v) => getValue(v) === getValue(opt))
  );

  // Select item
  const handleSelect = (item: T) => {
    if (multiple) {
      onChange([...value, item]);
    } else {
      onChange([item]);
      setOpen(false);
    }
  };

  // Clear selected
  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabels = value.map((v) => getLabel(v));
  const displayLabel =
    selectedLabels.length === 0
      ? placeholder
      : multiple
      ? selectedLabels.join(", ")
      : selectedLabels[0];

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input Box */}
      <div
        className="w-full px-4 py-2 border rounded-lg cursor-pointer bg-white flex justify-between items-center relative"
        onClick={() => setOpen(!open)}
      >
        <span className={value.length === 0 ? "text-gray-400" : ""}>
          {displayLabel}
        </span>

        {/* Clear button show only if value exists */}
        {value.length > 0 ? (
          <button
            className="absolute right-8 text-gray-400 hover:text-gray-600"
            onClick={clearSelection}
          >
            ✕
          </button>
        ) : null}

        <svg
          className={`w-4 h-4 ml-2 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredOptions.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-400">
              No more options
            </div>
          )}

          {filteredOptions.map((opt, index) => (
            <div
              key={index}
              onClick={() => handleSelect(opt)}
              className="px-4 py-2 cursor-pointer hover:bg-blue-50"
            >
              {getLabel(opt)}
            </div>
          ))}
        </div>
      )}

      {/* Tags for multiple select */}
      {multiple && value.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {value.map((item) => (
            <span
              key={getValue(item)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
            >
              {getLabel(item)}

              <button
                onClick={() =>
                  onChange(value.filter((v) => getValue(v) !== getValue(item)))
                }
                className="hover:text-blue-900"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
