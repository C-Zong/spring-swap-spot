"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { ListingStatus } from "@/types/item";
import { formatMoney } from "@/lib/money";

export type Listing = {
  id: number;
  title: string;
  priceCents: number;
  currency: string;
  status: ListingStatus;
  updatedAt?: string;
};

export type ListingVM = {
  id: number;
  title: string;
  price: string;
  status: ListingStatus;
  updatedAt?: string;
};

export function useMyListings(opts?: { limit?: number }) {
  const [listings, setListings] = useState<ListingVM[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/api/items/mine");
      if (res.data.code !== 0) throw new Error(res.data.message || "Load failed");

      const rows = res.data.data ?? [];

      const limited = typeof opts?.limit === "number" ? rows.slice(0, opts.limit) : rows;

      setListings(
        limited.map((it:Listing) => ({
          id: String(it.id),
          title: it.title,
          price: formatMoney(it.priceCents, it.currency || "USD"),
          status: it.status,
          updatedAt: it.updatedAt,
        }))
      );
    } catch (e: any) {
      toast.error(e?.message || "Failed to load listings");
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { listings, loading, reload: load };
}
