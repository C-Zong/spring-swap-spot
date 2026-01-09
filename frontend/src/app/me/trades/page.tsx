"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "@/lib/axios";
import { ArrowRight, CreditCard, RefreshCw, Wallet } from "lucide-react";
import { TradeRecordVM } from "@/components/me/sections/TradeHistoryCard";
import { formatMoney } from "@/lib/money";
import { formatTime } from "@/lib/time";

type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export default function MyTradesPage() {
  const [rows, setRows] = useState<TradeRecordVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await axios.get<ApiResponse<TradeRecordVM[]>>("/api/me/trades", {
        params: { limit: 50 },
      });
      if (res.data.code !== 0) throw new Error(res.data.message || "Failed to load");
      setRows(res.data.data || []);
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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          My Trades
        </h1>

        <button
          onClick={load}
          className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm
                     text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800/40"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
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
            Recent trades ({loading ? "..." : rows.length})
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
                  <div className="h-4 w-60 rounded bg-gray-100 dark:bg-gray-800/60" />
                  <div className="mt-2 h-3 w-40 rounded bg-gray-100 dark:bg-gray-800/60" />
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-xl border border-gray-200 px-4 py-8 text-center dark:border-gray-800">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                No trades yet
              </div>
              <div className="mt-2 text-sm text-gray-500">
                When you buy or sell items, records will appear here.
              </div>
              <div className="mt-4">
                <Link
                  href="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-black dark:text-gray-200 dark:hover:text-white"
                >
                  Go discover <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
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
                    className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 px-4 py-3
                               dark:border-gray-800"
                  >
                    <div className="flex min-w-0 gap-3">
                      <div
                        className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                                   border border-gray-200 dark:border-gray-800"
                        title={isBuy ? "Bought" : "Sold"}
                      >
                        <Icon className={isBuy ? "text-sky-500 h-4 w-4" : "text-rose-500 h-4 w-4"} />
                      </div>

                      <div className="min-w-0">
                        <Link
                          href={`/items/${r.itemId}`}
                          className="block truncate font-medium text-gray-900 hover:underline dark:text-gray-100"
                          title={r.title}
                        >
                          {r.title}
                        </Link>
                        <div className="mt-1 text-xs text-gray-500">
                          {isBuy ? "Bought" : "Sold"} · Qty {r.quantity} · Unit{" "}
                          {formatMoney(r.unitPriceCents, r.currency)} · {formatTime(r.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
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
        </div>
      </div>
    </div>
  );
}
