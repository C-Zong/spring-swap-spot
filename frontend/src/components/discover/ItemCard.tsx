"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Heart, Plus, ShoppingCart } from "lucide-react";
import type { ListingVM } from "@/hooks/useMyListings";
import { addToCart, toggleFavorite } from "@/lib/api/discover";
import Image from "next/image";
import { formatTime } from "@/lib/time";
import toast from "react-hot-toast";

export default function ItemCard({ item }: { item: ListingVM }) {
  const [fav, setFav] = useState(item.favored ?? false);
  const [busyFav, setBusyFav] = useState(false);
  const [busyCart, setBusyCart] = useState(false);
  const [added, setAdded] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-[1px] hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* image */}
      <Link href={`/items/${item.id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-800/50">
          {item.coverUrl ? (
            <Image
              src={item.coverUrl}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}
          {/* Gradient Overlay */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/35 to-transparent" />
        </div>
      </Link>

      {/* actions */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
        <button
          type="button"
          disabled={busyFav}
          onClick={async () => {
            if (busyFav) return;
            const next = !fav;
            setFav(next);
            setBusyFav(true);
            try {
              const serverFav = await toggleFavorite(item.id);
              setFav(serverFav);
            } catch (e: any) {
              setFav(!next);
              toast.error(e.message || "Failed to update favorite status");
            } finally {
              setBusyFav(false);
            }
          }}
          className="
            cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-xl
            border border-white/30
            bg-black/30
            text-white
            backdrop-blur
            transition
            hover:bg-black/40
            disabled:opacity-60
            dark:hover:bg-black/60
            dark:hover:border-white/50
          "
          aria-label="Favorite"
          title="Favorite"
        >
          <Heart className={fav ? "h-4 w-4 fill-current" : "h-4 w-4"} />
        </button>

        <button
          type="button"
          disabled={busyCart || added}
          onClick={async () => {
            if (busyCart) return;
            setBusyCart(true);
            try {
              await addToCart(item.id);
              setAdded(true);
              toast.success("Added to cart");
            } catch (e: any) {
              setAdded(false);
              toast.error(e.message || "Failed to add to cart");
            } finally {
              setBusyCart(false);
            }
          }}
          className="
            enabled:cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-xl
            border border-white/30
            bg-black/30
            text-white
            backdrop-blur
            transition
            hover:bg-black/40
            disabled:opacity-60
            dark:hover:bg-black/60
            dark:hover:border-white/50
          "
          aria-label="Add to cart"
          title="Add to cart"
        >
          {added ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <div className="relative">
              <ShoppingCart className="h-4 w-4" />
              <Plus className="absolute -right-1 -top-1 h-3 w-3" />
            </div>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        <Link href={`/items/${item.id}`} className="block">
          <div className="text-base font-semibold leading-snug text-gray-900 line-clamp-2 dark:text-gray-100">
            {item.title}
          </div>
        </Link>

        <div className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
          {item.price}
        </div>

        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {item.status}
          {item.updatedAt ? ` · Updated ${formatTime(item.updatedAt)}` : ""}
        </div>
      </div>
    </div>
  );
}
