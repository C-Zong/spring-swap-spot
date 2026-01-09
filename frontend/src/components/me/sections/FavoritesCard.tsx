"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, HeartOff, Trash2 } from "lucide-react";
import Card from "../../ui/Card";
import api from "@/lib/axios";
import { formatMoney } from "@/lib/money";

export type FavoriteItemVM = {
  itemId: number;
  title: string;
  priceCents: number;
  currency: string;
  createdAt: string;
};

export default function FavoritesCard() {
  const [favorites, setFavorites] = useState<FavoriteItemVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.get("/api/me/favorites?limit=5");

      if (res.data?.code !== 0) {
        throw new Error(res.data?.message || `Request failed`);
      }
      setFavorites((res.data.data || []) as FavoriteItemVM[]);
    } catch (e: any) {
      setErr(e?.message || "Failed to load favorites");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }

  async function remove(itemId: number) {
    setBusyId(itemId);
    try {
      const res = await api.delete(`/api/me/favorites/${itemId}`);

      if (res.data?.code !== 0) {
        throw new Error(res.data?.message || `Request failed`);
      }
      setFavorites((prev) => prev.filter((x) => x.itemId !== itemId));
    } catch (e: any) {
      setErr(e?.message || "Failed to remove");
    } finally {
      setBusyId(null);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Card
      title={"Favorites"}
      action={
        <Link
          href="/me/favorites"
          className="text-sm font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
        >
          View All
        </Link>
      }
    >
      {loading ? (<div>Loading...</div>) : err ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          {err}
        </div>
      ) : favorites.length === 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 text-sm font-medium">
            <HeartOff className="h-4 w-4" />
            No favorites yet
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Save items you like, and they’ll show up here.
          </div>
          <div className="mt-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white inline-flex items-center"
            >
              Discover more <ArrowRight className="inline h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {favorites.map((f) => (
              <li
                key={f.itemId}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3"
              >
                <div className="min-w-0">
                  <Link
                    href={`/items/${f.itemId}`}
                    className="block font-medium truncate hover:underline"
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
                  className="cursor-pointer inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black disabled:opacity-50 dark:text-gray-300 dark:hover:text-white"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
