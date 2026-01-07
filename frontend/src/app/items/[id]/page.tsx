"use client";

import React, { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import ItemHeaderBar from "@/components/items/ItemHeaderBar";
import ItemPhotoGallery, { type ItemImage } from "@/components/items/ItemPhotoGallery";
import ItemDetailsCard from "@/components/items/ItemDetailsCard";
import ItemDescriptionCard from "@/components/items/ItemDescriptionCard";
import { formatMoney } from "@/lib/money";
import type { ListingStatus } from "@/components/ui/StatusBadge";

type Item = {
  id: number;
  sellerId: number;
  title: string;
  description: string;
  priceCents: number;
  currency?: string;

  category: string;
  condition: string;
  tradeMethod: string;
  location: string;

  tags: string[];
  quantity: number;
  negotiable: boolean;
  status: ListingStatus;

  images: ItemImage[];
};

export default function ItemDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        const res = await api.get(`/api/items/${id}`);
        const data = res.data?.data as Item;

        if (cancelled) return;

        const images = data.images ?? [];
        const needPresign = images.some((img) => !img.url);

        if (!needPresign) {
          setItem(data);
          return;
        }

        const urls = await Promise.all(
          images.map(async (img) => {
            if (img.url) return img.url;
            const urlRes = await api.get("/api/uploads/item-images/url", {
              params: { key: img.key },
            });
            if (urlRes.data?.code === 0) return urlRes.data.data.url as string;
            return "";
          })
        );

        setItem({
          ...data,
          images: images.map((img, i) => ({ ...img, url: urls[i] })),
        });
      } catch (e) {
        setItem(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const priceText = useMemo(() => {
    if (!item) return "";
    return formatMoney(item.priceCents, item.currency || "USD");
  }, [item]);

  if (loading) return <div className="px-4 py-8">Loading...</div>;
  if (!item) return <div className="px-4 py-8">Item not found</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <ItemHeaderBar itemId={item.id} status={item.status} />

      <div className="mt-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold truncate">{item.title}</h1>
            <div className="mt-1 text-sm text-gray-500">
              {item.category} · {item.condition} · {item.tradeMethod}
            </div>
          </div>
          <div className="text-2xl font-bold">{priceText}</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ItemPhotoGallery images={item.images} />
        </div>

        <div className="lg:col-span-1 space-y-5">
          <ItemDetailsCard
            location={item.location}
            quantity={item.quantity}
            negotiable={item.negotiable}
            status={item.status}
            tags={item.tags ?? []}
          />
          <ItemDescriptionCard description={item.description} />
        </div>
      </div>
    </div>
  );
}
