"use client";

import { useEffect, useState } from "react";
import type { Listing, ListingVM } from "@/hooks/useMyListings";
import { formatMoney } from "@/lib/money";
import { getDiscoverRaw } from "@/lib/api/discover";

export function useDiscover(opts?: { limit?: number }) {
  const [listings, setListings] = useState<ListingVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const rows = await getDiscoverRaw(typeof opts?.limit === "number" ? opts.limit : 36);

      const limited =
        typeof opts?.limit === "number" ? rows.slice(0, opts.limit) : rows;

      setListings(
        limited.map((it: Listing) => ({
          id: it.id,
          title: it.title,
          price: formatMoney(it.priceCents, it.currency || "USD"),
          status: it.status,
          updatedAt: it.updatedAt,
          coverUrl: it.coverUrl ?? null,
          favored: !!it.favored,
        }))
      );
    } catch (e: any) {
      setError(e?.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [opts?.limit]);

  return { listings, loading, error };
}
