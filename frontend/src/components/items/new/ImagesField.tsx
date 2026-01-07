"use client";

import React from "react";
import Card from "@/components/ui/Card";
import type { NewItemImage } from "@/types/item";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function ImagesField(props: {
  fileRef: React.RefObject<HTMLInputElement | null>;
  images: NewItemImage[];
  maxImages: number;
  pickImages: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent) => void;
  removeImage: (id: string) => void;
  moveImage: (id: string, dir: -1 | 1) => void;
  submitting: boolean;
}) {
  const {
    fileRef,
    images,
    maxImages,
    pickImages,
    onFileChange,
    onDrop,
    removeImage,
    moveImage,
    submitting,
  } = props;

  return (
    <Card
      title="Photos"
      action={<span className="text-xs text-gray-500">{images.length}/{maxImages}</span>}
    >
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={cx(
          "rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 p-4",
          "bg-gray-50/50 dark:bg-gray-800/20"
        )}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          multiple
          className="hidden"
          onChange={onFileChange}
        />

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium">Upload 1–5 photos</div>
            <div className="text-xs text-gray-500">
              First photo is the cover. Drag files here.
            </div>
          </div>

          <button
            type="button"
            onClick={pickImages}
            disabled={submitting || images.length >= maxImages}
            className="cursor-pointer inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 disabled:opacity-50"
          >
            Add photos
          </button>
        </div>

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
              >
                <div className="relative aspect-square">
                  <img src={img.previewUrl} alt={`preview-${idx}`} className="h-full w-full object-cover" />
                  {idx === 0 && (
                    <div className="absolute left-2 top-2 text-xs rounded-full px-2 py-0.5 bg-black/80 text-white">
                      Cover
                    </div>
                  )}
                </div>

                <div className="p-2 flex items-center justify-between gap-2">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveImage(img.id, -1)}
                      disabled={idx === 0}
                      className="cursor-pointer rounded-lg border border-gray-200 dark:border-gray-800 px-2 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-800/40 disabled:opacity-50"
                      title="Move left"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(img.id, 1)}
                      disabled={idx === images.length - 1}
                      className="cursor-pointer rounded-lg border border-gray-200 dark:border-gray-800 px-2 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-800/40 disabled:opacity-50"
                      title="Move right"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="cursor-pointer rounded-md p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition"
                    title="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
