"use client";

import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Cropper, { Area } from "react-easy-crop";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { UploadCloud, X, Plus, Trash2 } from "lucide-react";

/* ------------------------------------------------------------------
Types
------------------------------------------------------------------ */
export type ImageUploadAdvancedProps = {
  label?: string;
  name?: string;

  value: File | File[] | null;
  onChange: (files: File | File[] | null) => void;

  multiple?: boolean;
  accept?: string;
  required?: boolean;
  maxFileSizeMB?: number;

  errorMessage?: string;
  onBlur?: () => void;
};

type Item = {
  id: UniqueIdentifier;
  file: File;
  url: string;
};

type AspectRatio = number | "free";

/* ------------------------------------------------------------------
Helpers
------------------------------------------------------------------ */
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  crop: Area,
  rotation: number
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context missing");

  canvas.width = Math.round(crop.width);
  canvas.height = Math.round(crop.height);

  ctx.drawImage(
    image,
    Math.round(crop.x),
    Math.round(crop.y),
    Math.round(crop.width),
    Math.round(crop.height),
    0,
    0,
    Math.round(crop.width),
    Math.round(crop.height)
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.92);
  });
}

const blobToFile = (blob: Blob, name: string): File =>
  new File([blob], name, { type: blob.type });

/* ------------------------------------------------------------------
Sortable Thumbnail
------------------------------------------------------------------ */
const SortableThumb: FC<{
  id: UniqueIdentifier;
  children: React.ReactNode;
}> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------
Main Component
------------------------------------------------------------------ */
const ImageUploadAdvanced: FC<ImageUploadAdvancedProps> = ({
  label = "Upload Images",
  name = "images",
  value,
  onChange,
  multiple = false,
  accept = "image/*",
  required = false,
  maxFileSizeMB = 5,
  errorMessage,
  onBlur,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* ------------------------------------------------------------------
  Convert incoming files -> Items[]
  ------------------------------------------------------------------ */
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!value) {
      setItems([]);
      return;
    }

    const files = Array.isArray(value) ? value : [value];
    const mapped: Item[] = files.map((f) => ({
      id: uuidv4(),
      file: f,
      url: URL.createObjectURL(f),
    }));

    // cleanup old URLs
    setItems((prev) => {
      prev.forEach((i) => URL.revokeObjectURL(i.url));
      return mapped;
    });

    return () => mapped.forEach((i) => URL.revokeObjectURL(i.url));
  }, [value]);

  /* ------------------------------------------------------------------
  Cropping modal state
  ------------------------------------------------------------------ */
  const [queue, setQueue] = useState<File[]>([]);
  const [isCropping, setIsCropping] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [currentRawFile, setCurrentRawFile] = useState<File | null>(null);
  const [cropArea, setCropArea] = useState<Area | null>(null);

  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [aspect, setAspect] = useState<AspectRatio>("free");

  /* ------------------------------------------------------------------
  Validators
  ------------------------------------------------------------------ */
  const validateSize = useCallback(
    (file: File) => file.size / 1024 / 1024 <= maxFileSizeMB,
    [maxFileSizeMB]
  );

  /* ------------------------------------------------------------------
  Handle file processing (validation -> crop queue)
  ------------------------------------------------------------------ */
  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files);
      const valid = arr.filter(validateSize);

      if (valid.length !== arr.length) {
        alert(`Skipped some files over ${maxFileSizeMB}MB`);
      }
      if (valid.length === 0) return;

      setQueue((q) => [...q, ...valid]);
    },
    [validateSize, maxFileSizeMB]
  );

  /* ------------------------------------------------------------------
  Start cropping next file in queue
  ------------------------------------------------------------------ */
  useEffect(() => {
    if (!isCropping && queue.length > 0) {
      const next = queue[0];

      setCurrentRawFile(next);

      const reader = new FileReader();
      reader.onload = () => {
        setCropSrc(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(next);
    }
  }, [queue, isCropping]);

  /* ------------------------------------------------------------------
  Cropper handlers
  ------------------------------------------------------------------ */
  const onCropComplete = useCallback((_: Area, cropped: Area) => {
    setCropArea(cropped);
  }, []);

  const dequeue = () => {
    setQueue((q) => q.slice(1));
    setIsCropping(false);
    setCropSrc(null);
    setCurrentRawFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCropArea(null);
  };

  const skipCrop = () => {
    if (currentRawFile) addFile(currentRawFile);
    dequeue();
  };

  /* ------------------------------------------------------------------
  Add file to items + notify parent
  ------------------------------------------------------------------ */
  const notifyParent = (next: Item[]) => {
    if (next.length === 0) {
      onChange(null);
      return;
    }

    const files = next.map((i) => i.file);
    onChange(multiple ? files : files[0]);
  };

  const addFile = (file: File) => {
    const newItem: Item = {
      id: uuidv4(),
      file,
      url: URL.createObjectURL(file),
    };

    setItems((prev) => {
      const next = multiple ? [...prev, newItem] : [newItem];
      notifyParent(next);
      return next;
    });
  };

  /* ------------------------------------------------------------------
  Save crop
  ------------------------------------------------------------------ */
  const saveCrop = async () => {
    if (!cropSrc || !cropArea || !currentRawFile) return;

    const blob = await getCroppedImg(cropSrc, cropArea, rotation);
    const file = blobToFile(blob, `${currentRawFile.name}-cropped.jpg`);

    const compressed = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
    });

    addFile(compressed);
    dequeue();
    onBlur?.();
  };

  /* ------------------------------------------------------------------
  Remove single / all images
  ------------------------------------------------------------------ */
  const removeItem = (id: UniqueIdentifier) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      notifyParent(next);
      return next;
    });
  };

  const removeAll = () => {
    items.forEach((i) => URL.revokeObjectURL(i.url));
    setItems([]);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  /* ------------------------------------------------------------------
  Drag Sort
  ------------------------------------------------------------------ */
  const sensors = useSensors(useSensor(PointerSensor));

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      const next = arrayMove(prev, oldIndex, newIndex);
      notifyParent(next);
      return next;
    });
  };

  /* ------------------------------------------------------------------
  UI
  ------------------------------------------------------------------ */
  const acceptedLabel = useMemo(
    () =>
      accept
        .split(",")
        .map((a) => a.replace("image/", "").toUpperCase())
        .join(", "),
    [accept]
  );

  const hasError = Boolean(errorMessage);

  /* ------------------------------------------------------------------
  RENDER
  ------------------------------------------------------------------ */
  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 bg-gray-50 cursor-pointer transition ${
          hasError ? "border-red-500" : "border-gray-300"
        } hover:border-blue-500`}
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          processFiles(e.dataTransfer.files);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        {items.length === 0 ? (
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={items.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {items.map((i) => (
                    <SortableThumb key={i.id} id={i.id}>
                      <div className="relative rounded-lg overflow-hidden">
                        <img
                          src={i.url}
                          className="w-full h-40 object-cover"
                          alt="preview"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeItem(i.id);
                          }}
                          className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </SortableThumb>
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Actions */}
            <div className="flex justify-between mt-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-3 py-2 bg-gray-200 rounded-lg flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  <Plus className="w-4 h-4" /> Upload More
                </button>

                <button
                  type="button"
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAll();
                  }}
                >
                  <Trash2 className="w-4 h-4" /> Remove All
                </button>
              </div>

              <span className="text-xs text-gray-500 self-center">
                Drag to reorder
              </span>
            </div>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          required={required && items.length === 0}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) processFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Error */}
      {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}

      {/* Crop Modal */}
      {isCropping && cropSrc && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-40">
          <div className="bg-white w-full max-w-4xl rounded-lg overflow-hidden">
            {/* Header */}
            <div className="p-3 border-b flex items-center justify-between">
              <h3 className="text-sm font-semibold">Crop Image</h3>
              <div className="flex gap-2">
                {/* Aspect Ratio */}
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={aspect}
                  onChange={(e) =>
                    setAspect(
                      e.target.value === "free"
                        ? "free"
                        : Number(e.target.value)
                    )
                  }
                >
                  <option value="free">Free</option>
                  <option value={1}>1:1</option>
                  <option value={4 / 3}>4:3</option>
                  <option value={16 / 9}>16:9</option>
                  <option value={9 / 16}>9:16</option>
                </select>

                {/* Rotation */}
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                >
                  -90°
                </button>
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                >
                  +90°
                </button>

                <button
                  className="px-3 py-1 bg-red-200 text-red-700 rounded"
                  onClick={() => {
                    setQueue([]);
                    setIsCropping(false);
                    setCropSrc(null);
                  }}
                >
                  Cancel All
                </button>
              </div>
            </div>

            {/* Cropper */}
            <div className="relative h-[520px] bg-gray-100">
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect === "free" ? undefined : aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Footer */}
            <div className="p-4 flex justify-between">
              {/* Zoom */}
              <div className="flex items-center gap-2">
                <span className="text-sm">Zoom</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
              </div>

              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={skipCrop}
                >
                  Skip
                </button>

                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={saveCrop}
                >
                  Save Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadAdvanced;
