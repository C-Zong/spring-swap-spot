"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, Wallet } from "lucide-react";
import Card from "../../ui/Card";
import api from "@/lib/axios";
import { formatMoney } from "@/lib/money";
import { formatTime } from "@/lib/time";

export type TradeRecordVM = {
  id: number;
  role: "BUYER" | "SELLER";
  itemId: number;
  title: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
  currency: string;
  createdAt: string;
};

export default function TradeHistoryCard() {
  const [rows, setRows] = useState<TradeRecordVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.get("/api/me/trades?limit=4");

      if (res.data?.code !== 0) {
        throw new Error(res.data?.message || `Request failed`);
      }
      setRows((res.data.data || []) as TradeRecordVM[]);
    } catch (e: any) {
      setErr(e?.message || "Failed to load trades");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Card
      title={"Trade History"}
      action={
        <div className="flex items-center gap-3">
          <Link
            href="/me/trades"
            className="text-sm font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
          >
            View All
          </Link>
        </div>
      }
    >
      {loading ? (<div>Loading...</div>) : err ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          {err}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-6 text-center">
          <div className="text-sm font-medium">No trades yet</div>
          <div className="mt-2 text-sm text-gray-500">
            Once you buy or sell items, your records will show up here.
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => {
            const isBuy = r.role === "BUYER";
            const Icon = isBuy ? CreditCard : Wallet;

            return (
              <li
                key={r.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3"
              >
                <div className="flex min-w-0 gap-3">
                  <div
                    className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800"
                    title={isBuy ? "Bought" : "Sold"}
                  >
                    <Icon className={isBuy ? "text-sky-500 h-4 w-4" : "text-rose-500 h-4 w-4"} />
                  </div>

                  <div className="min-w-0">
                    <Link
                      href={`/items/${r.itemId}`}
                      className="block font-medium truncate hover:underline"
                      title={r.title}
                    >
                      {r.title}
                    </Link>
                    <div className="mt-1 text-xs text-gray-500">
                      {isBuy ? "Bought" : "Sold"} · Qty {r.quantity}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTime(r.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-sm font-medium">
                    {isBuy ? "-" : "+"}
                    {formatMoney(r.totalCents, r.currency)}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {isBuy ? "Spending" : "Earning"}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
