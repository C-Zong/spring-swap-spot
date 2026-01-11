"use client";

import React from "react";
import ItemCard from "@/components/discover/ItemCard";
import { useDiscover } from "@/hooks/useDiscover";
import { useSearchParams } from "next/navigation";

export default function HomeClient() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";

  const { listings, loading, error } = useDiscover({ limit: 36, q });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div>
        <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Discover
        </div>
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {q ? `Results for "${q}"` : "Hot listings right now"}
        </div>
      </div>

      <div className="mt-6">
        {loading && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Loading…
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && listings.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
            No listings yet.
          </div>
        )}

        {!loading && !error && listings.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((it) => (
              <ItemCard key={it.id} item={it} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
