"use client";

import React, { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/lib/money";
import axios from "axios";

type CartLineVM = {
  itemId: number;
  title: string;
  priceCents: number;
  currency: string;
  qty: number;
  availableQty: number;
  coverUrl?: string | null;
};

type CartSellerVM = {
  sellerId: number;
  sellerUsername: string;
  sellerAvatarUrl?: string | null;
  lines: CartLineVM[];
};

type ApiResp<T> = { code: number; message?: string; data: T };

function sellerSubtotal(g: CartSellerVM) {
  return g.lines.reduce((sum, l) => sum + l.priceCents * l.qty, 0);
}

export default function CartPage() {
  const [groups, setGroups] = useState<CartSellerVM[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const router = useRouter();

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<ApiResp<CartSellerVM[]>>("/api/cart");
      if (res.data.code !== 0) throw new Error(res.data.message || "Failed to load cart");
      setGroups(res.data.data);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        toast.error( e.message);
      } else {
        toast.error("Network error");
      }
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const total = useMemo(() => {
    if (!groups) return 0;
    let sum = 0;
    for (const g of groups) {
      for (const l of g.lines) sum += (l.priceCents ?? 0) * (l.qty ?? 0);
    }
    return sum;
  }, [groups]);

  async function patchQty(itemId: number, nextQty: number, maxQty: number) {
    const qty = Math.max(1, Math.min(nextQty, Math.max(maxQty, 1)));
    const key = `qty:${itemId}`;
    setBusyKey(key);

    setGroups((prev) => {
      if (!prev) return prev;
      return prev.map((g) => ({
        ...g,
        lines: g.lines.map((l) => (l.itemId === itemId ? { ...l, qty } : l)),
      }));
    });

    try {
      const res = await api.patch<ApiResp<null>>(`/api/cart/${itemId}`, null, { params: { qty } });
      if (res.data.code !== 0) throw new Error(res.data.message || "Failed to update quantity");
    } catch (e: any) {
      toast.error(e?.message || "Update failed");
      await load();
    } finally {
      setBusyKey(null);
    }
  }

  async function remove(itemId: number) {
    const key = `rm:${itemId}`;
    setBusyKey(key);

    const snapshot = groups;
    setGroups((prev) => {
      if (!prev) return prev;
      const next = prev
        .map((g) => ({ ...g, lines: g.lines.filter((l) => l.itemId !== itemId) }))
        .filter((g) => g.lines.length > 0);
      return next;
    });

    try {
      const res = await api.delete<ApiResp<null>>(`/api/cart/${itemId}`);
      if (res.data.code !== 0) throw new Error(res.data.message || "Failed to remove");
    } catch (e: any) {
      toast.error(e?.message || "Remove failed");
      setGroups(snapshot ?? []);
    } finally {
      setBusyKey(null);
    }
  }

  async function checkoutSeller(sellerId: number) {
    const key = `checkout:${sellerId}`;
    setBusyKey(key);
    try {
      const res = await api.post("/api/checkout/seller/" + sellerId);
      if (res.data?.code !== 0) throw new Error(res.data?.message || "Checkout failed");
      toast.success("Checked out!");
      await load();
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || "Checkout failed");
      await load();
    } finally {
      setBusyKey(null);
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading cart…</div>;
  }

  const data = groups ?? [];
  if (data.length === 0) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="text-lg font-semibold">Your cart is empty</div>
          <div className="mt-2 text-sm text-gray-500">Go add something you like.</div>
          <Link
            href="/"
            className="mt-4 inline-flex items-center rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/40"
          >
            Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-2xl font-semibold">Cart</div>
          <div className="mt-1 text-sm text-gray-500">Grouped by seller</div>
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-200">
          Total: <span className="font-semibold">{formatMoney(total, "USD")}</span>
        </div>
      </div>

      <div className="space-y-6">
        {data.map((g) => (
          <section
            key={g.sellerId}
            className="rounded-2xl border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  {g.sellerAvatarUrl ? (
                    <img src={g.sellerAvatarUrl} alt={g.sellerUsername} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{g.sellerUsername}</div>
                  <div className="text-xs text-gray-500">Seller</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">
                  {g.lines.length} item{g.lines.length > 1 ? "s" : ""}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-200">
                  {formatMoney(sellerSubtotal(g), "USD")}
                </div>

                <button
                  className="cursor-pointer inline-flex items-center rounded-xl px-3 py-2 text-sm
                    border border-gray-200 dark:border-gray-800
                    hover:bg-gray-50 dark:hover:bg-gray-800/40
                    disabled:opacity-50"
                  disabled={busyKey === `checkout:${g.sellerId}`}
                  onClick={() => checkoutSeller(g.sellerId)}
                >
                  Checkout
                </button>
              </div>
            </div>

            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {g.lines.map((l) => (
                <li key={l.itemId} className="px-4 py-4">
                  <div className="flex gap-4">
                    <Link
                      href={`/items/${l.itemId}`}
                      className="relative h-20 w-20 flex-none overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40"
                    >
                      {l.coverUrl ? (
                        <img src={l.coverUrl} alt={l.title} className="h-full w-full object-cover" />
                      ) : null}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link href={`/items/${l.itemId}`} className="font-medium hover:underline">
                        {l.title}
                      </Link>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {formatMoney(l.priceCents, l.currency)}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        Available: {l.availableQty}
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <QtyStepper
                          value={l.qty}
                          min={1}
                          max={Math.max(1, l.availableQty)}
                          disabled={busyKey === `qty:${l.itemId}` || l.availableQty <= 0}
                          onChange={(v) => patchQty(l.itemId, v, l.availableQty)}
                        />

                        <button
                          className="cursor-pointer text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                          disabled={busyKey === `rm:${l.itemId}`}
                          onClick={() => remove(l.itemId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function QtyStepper({
  value,
  min,
  max,
  disabled,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  onChange: (v: number) => void;
}) {
  const decDisabled = disabled || value <= min;
  const incDisabled = disabled || value >= max;

  return (
    <div className="inline-flex items-center rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <button
        className="px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/40 disabled:opacity-50"
        disabled={decDisabled}
        onClick={() => onChange(value - 1)}
        type="button"
      >
        −
      </button>

      <div className="px-3 py-2 text-sm tabular-nums min-w-[48px] text-center">
        {value}
      </div>

      <button
        className="px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/40 disabled:opacity-50"
        disabled={incDisabled}
        onClick={() => onChange(value + 1)}
        type="button"
      >
        +
      </button>
    </div>
  );
}
