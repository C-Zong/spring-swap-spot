"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "@/lib/axios";
import { Trash2, RefreshCw, Sparkles, ArrowRight } from "lucide-react";
import { FavoriteItemVM } from "@/components/me/sections/FavoritesCard";
import { formatMoney } from "@/lib/money";

type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export default function MyFavoritesPage() {
  const [rows, setRows] = useState<FavoriteItemVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await axios.get<ApiResponse<FavoriteItemVM[]>>("/api/me/favorites", {
        params: { limit: 50 },
      });
      if (res.data.code !== 0) throw new Error(res.data.message || "Failed to load");
      setRows(res.data.data || []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load favorites");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function remove(itemId: number) {
    setBusyId(itemId);
    setErr(null);
    try {
      const res = await axios.delete<ApiResponse<void>>(`/api/me/favorites/${itemId}`);
      if (res.data.code !== 0) throw new Error(res.data.message || "Failed to remove");
      setRows((prev) => prev.filter((x) => x.itemId !== itemId));
    } catch (e: any) {
      setErr(e?.message || "Failed to remove favorite");
    } finally {
      setBusyId(null);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          My Favorites
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm
                       text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800/40"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm
                       text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800/40"
          >
            <Sparkles className="h-4 w-4" />
            Discover
          </Link>
        </div>
      </div>

      {err ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700
                        dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          {err}
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Favorites ({loading ? "..." : rows.length})
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-800"
                >
                  <div className="h-4 w-56 rounded bg-gray-100 dark:bg-gray-800/60" />
                  <div className="mt-2 h-3 w-28 rounded bg-gray-100 dark:bg-gray-800/60" />
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-xl border border-gray-200 px-4 py-8 text-center dark:border-gray-800">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                No favorites yet
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Go to Discover and save items you like.
              </div>
              <div className="mt-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-black dark:text-gray-200 dark:hover:text-white"
                >
                  Discover more <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {rows.map((f) => (
                <li
                  key={f.itemId}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 px-4 py-3
                             dark:border-gray-800"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/items/${f.itemId}`}
                      className="block truncate font-medium text-gray-900 hover:underline dark:text-gray-100"
                      title={f.title}
                    >
                      {f.title}
                    </Link>
                    <div className="mt-1 text-xs text-gray-500">
                      {formatMoney(f.priceCents, f.currency)}
                    </div>
                  </div>

                  <button
                    onClick={() => remove(f.itemId)}
                    disabled={busyId === f.itemId}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm
                               text-gray-700 hover:bg-gray-50 disabled:opacity-50
                               dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800/40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
