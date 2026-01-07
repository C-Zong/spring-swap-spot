"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { ChevronLeft, ChevronRight, ImagePlus, Trash2 } from "lucide-react";
import type { ItemImage } from "@/types/item";

export default function ItemEditPhotos(props: {
  fileRef: React.RefObject<HTMLInputElement | null>;
  saving: boolean;
  canAddMore: boolean;
  images: ItemImage[];
  onPick: () => void;
  onFilesSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMove: (idx: number, dir: -1 | 1) => void;
  onRemove: (idx: number) => void;
}) {
  return (
    <Card
      title="Photos"
      action={
        <button
          type="button"
          onClick={props.onPick}
          disabled={props.saving || !props.canAddMore}
          className="cursor-pointer inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white disabled:opacity-50"
        >
          <ImagePlus className="h-4 w-4" />
          Add
        </button>
      }
    >
      <input
        ref={props.fileRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        multiple
        className="hidden"
        onChange={props.onFilesSelected}
      />

      <div className="text-xs text-gray-500">First photo is the cover. Max 5 photos.</div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {props.images.map((img, idx) => (
          <div
            key={`${img.key}-${idx}`}
            className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-gray-50 dark:bg-gray-800/40"
          >
            <div className="relative aspect-square">
              {img.url ? (
                <img src={img.url} alt={`img-${idx}`} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">
                  ...
                </div>
              )}

              {idx === 0 && (
                <div className="absolute left-2 top-2 text-[10px] px-2 py-0.5 rounded-full bg-black/70 text-white">
                  Cover
                </div>
              )}
            </div>

            <div className="p-2 flex items-center justify-between">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => props.onMove(idx, -1)}
                  disabled={idx === 0}
                  className="cursor-pointer rounded-lg border border-gray-200 dark:border-gray-800 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
                  aria-label="move left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => props.onMove(idx, 1)}
                  disabled={idx === props.images.length - 1}
                  className="cursor-pointer rounded-lg border border-gray-200 dark:border-gray-800 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
                  aria-label="move right"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => props.onRemove(idx)}
                className="cursor-pointer rounded-lg border border-rose-200 dark:border-rose-900/50 p-1 text-rose-600 dark:text-rose-200 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                aria-label="remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {props.images.length === 0 && (
          <div className="col-span-3 text-sm text-gray-500">
            No photos. Click <span className="font-medium">Add</span> to upload.
          </div>
        )}
      </div>
    </Card>
  );
}
