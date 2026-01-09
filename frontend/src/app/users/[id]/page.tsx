"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import api from "@/lib/axios";
import { formatMoney } from "@/lib/money";
import { ArrowLeft } from "lucide-react";
import { ItemCarousel, ItemVM } from "@/components/users/ItemCarousel";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

type SellerProfile = {
  id: number;
  username: string;
  headline: string | null;
  bio: string | null;
  avatarUrl?: string | null;
};

type MonthlySales = {
  month: string;
  units: number;
  revenueCents: number;
};

export default function SellerPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();

  const { id } = React.use(params);
  const sellerId = Number(id);

  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [items, setItems] = useState<ItemVM[]>([]);
  const [sales, setSales] = useState<MonthlySales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [p, it, s] = await Promise.all([
          api.get<ApiResponse<SellerProfile>>(`/api/users/${sellerId}`),
          api.get<ApiResponse<ItemVM[]>>(`/api/users/${sellerId}/items?status=Active`),
          api.get<ApiResponse<MonthlySales[]>>(
            `/api/users/${sellerId}/sales/monthly?months=12`
          ),
        ]);

        if (cancelled) return;

        setProfile(p.data.code === 0 ? p.data.data : null);
        setItems(it.data.code === 0 ? it.data.data : []);
        setSales(s.data.code === 0 ? s.data.data : []);
      } catch {
        if (cancelled) return;
        setProfile(null);
        setItems([]);
        setSales([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (!Number.isNaN(sellerId)) load();
    return () => {
      cancelled = true;
    };
  }, [sellerId]);

  const chartData = useMemo(() => {
    const labels = sales.map((x) => x.month);
    const units = sales.map((x) => x.units);
    const revenue = sales.map((x) => Math.round(x.revenueCents / 100));

    return {
      labels,
      datasets: [
        {
          label: "Revenue ($)",
          data: revenue,
          tension: 0.35,
          borderColor: "#047857",
          pointBackgroundColor: "#047857",
          pointBorderColor: "#047857",
        },
        {
          label: "Units sold",
          data: units,
          tension: 0.35,
          borderColor: "#1d4ed8",
          pointBackgroundColor: "#1d4ed8",
          pointBorderColor: "#1d4ed8",
        },
      ],
    };
  }, [sales]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" as const, labels: { color: "#4b5563" } },
        tooltip: { mode: "index" as const, intersect: false },
      },
      interaction: { mode: "index" as const, intersect: false },
      scales: {
        x: {
          ticks: { color: "#4b5563" },
          grid: { color: "rgba(75,85,99,0.25)" },
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#4b5563" },
          grid: { color: "rgba(75,85,99,0.25)" },
        },
      },
    };
  }, []);

  if (loading && !profile) {
    return <div className="p-6 text-sm text-gray-500">Loading seller…</div>;
  }

  if (!profile) {
    return <div className="p-6 text-sm text-gray-500">Seller not found.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <Link
          href={`/messages/new?to=${profile.id}`}
          className="cursor-pointer inline-flex items-center rounded-xl px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40"
        >
          Message
        </Link>
      </div>

      {/* Profile */}
      <section className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.username}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            <div className="min-w-0">
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                {profile.username}
              </div>
              {profile.headline ? (
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {profile.headline}
                </div>
              ) : null}
            </div>

            {profile.bio ? (
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">
                {profile.bio}
              </p>
            ) : (
              <p className="mt-3 text-sm text-gray-500">No bio yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Active items */}
      <ItemCarousel
        title="Active Items"
        items={items}
      />

      {/* Monthly sales chart */}
      <section className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Monthly Sales
          </h2>
          <div className="text-xs text-gray-500">{sales.length || 0} months with sales</div>
        </div>

        {sales.length === 0 ? (
          <div className="text-sm text-gray-500">No sales data.</div>
        ) : (
          <div className="w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}

        {sales.length > 0 ? (
          <div className="text-xs text-gray-500">
            Total revenue:{" "}
            <span className="text-gray-800 dark:text-gray-200 font-medium">
              {formatMoney(sales.reduce((sum, x) => sum + x.revenueCents, 0))}
            </span>
          </div>
        ) : null}
      </section>
    </div>
  );
}
