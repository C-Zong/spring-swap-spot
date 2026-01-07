import React, { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import { ImageOff } from "lucide-react";

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export type ItemImage = {
  key: string;
  url?: string;
};

export default function ItemPhotoGallery({ images }: { images: ItemImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const coverUrl = useMemo(() => {
    if (!images?.length) return "";
    return images[Math.min(activeIndex, images.length - 1)]?.url || "";
  }, [images, activeIndex]);

  return (
    <Card title="Photos">
      {images?.length ? (
        <div>
          <div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 aspect-video">
            {coverUrl ? (
              <img src={coverUrl} alt="cover" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">
                Loading image...
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {images.map((img, i) => (
                <button
                  key={`${img.key}-${i}`}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={cx(
                    "relative aspect-square overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800/40",
                    i === activeIndex && "ring-2 ring-offset-2 ring-black/60 dark:ring-white/60",
                  )}
                >
                  {img.url ? (
                    <img src={img.url} alt={`thumb-${i}`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">
                      ...
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ImageOff className="h-4 w-4" />
          No photos
        </div>
      )}
    </Card>
  );
}
