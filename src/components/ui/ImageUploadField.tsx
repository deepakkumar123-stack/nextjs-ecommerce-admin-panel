"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import { UploadCloud, X, Plus, Trash2 } from "lucide-react";

type ImageUploadFieldProps = {
  label: string;
  name: string;
  value: File | File[] | null;
  onChange: (files: File | File[] | null) => void;

  multiple?: boolean;
  accept?: string;
  required?: boolean;
  maxFileSizeMB?: number;
  errorMessage?: string;
  onBlur?: () => void;
};

const formatAcceptLabel = (accept: string) =>
  accept
    .split(",")
    .map((t) => t.replace("image/", "").toUpperCase().trim())
    .join(", ");

const validateSize = (file: File, maxMB: number) =>
  file.size / (1024 * 1024) <= maxMB;

const ImageUploadField: FC<ImageUploadFieldProps> = ({
  label,
  name,
  value,
  onChange,

  multiple = false,
  accept = "image/*",
  required = false,
  maxFileSizeMB = 5,

  errorMessage,
  onBlur,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const hasError = Boolean(errorMessage);

  // Sync previews from value
  useEffect(() => {
    if (!value) {
      setPreviews([]);
      return;
    }
    const files = multiple ? (value as File[]) : [value as File];
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);

    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [value, multiple]);

  // Add files
  const handleFiles = (files: FileList | File[]) => {
    const list = Array.from(files);
    const valid = list.filter((f) => validateSize(f, maxFileSizeMB));

    if (valid.length !== list.length) {
      alert(`Some files exceeded ${maxFileSizeMB}MB and were skipped.`);
    }
    if (!valid.length) return;

    if (multiple) {
      const existing = (value as File[]) || [];
      onChange([...existing, ...valid]);
    } else {
      onChange(valid[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length === 0) return;
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    if (!value) return;
    if (multiple) {
      const arr = value as File[];
      const updated = arr.filter((_, i) => i !== index);
      onChange(updated.length ? updated : null);
    } else {
      onChange(null);
    }
  };

  const removeAll = () => {
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const acceptedLabel = formatAcceptLabel(accept);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`border-2 border-dashed rounded-xl p-6 bg-gray-50 transition 
        ${hasError ? "border-red-500" : "border-gray-300"}
        hover:border-blue-500`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {previews.length === 0 ? (
          <div className="text-center flex flex-col items-center">
            <UploadCloud className="w-10 h-10 text-blue-500 mb-2" />
            <p className="text-sm text-gray-900">
              <span className="font-semibold text-blue-600">
                Click to upload
              </span>{" "}
              or drag & drop
            </p>
            <p className="text-xs text-gray-500">
              {acceptedLabel} · Max {maxFileSizeMB}MB
            </p>
            {multiple && (
              <p className="text-xs text-gray-400">(Multiple images allowed)</p>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {previews.map((src, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-lg overflow-hidden"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(idx);
                    }}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="px-3 py-2 text-sm bg-gray-200 rounded-lg flex items-center gap-1 hover:bg-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Plus className="w-4 h-4" /> Upload More
              </button>

              <button
                type="button"
                className="px-3 py-2 text-sm bg-red-100 text-red-600 rounded-lg flex items-center gap-1 hover:bg-red-200"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAll();
                }}
              >
                <Trash2 className="w-4 h-4" /> Remove All
              </button>
            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          required={required && previews.length === 0}
          onChange={handleInputChange}
          onBlur={onBlur}
          className="hidden"
        />
      </div>

      {hasError && <p className="text-xs text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default ImageUploadField;
