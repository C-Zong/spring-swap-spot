"use client";

import React from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { formatTime } from "@/lib/time";
import { useDeleteItem } from "@/hooks/useDeleteItem";
import { ListingVM } from "@/hooks/useMyListings";

export default function ItemsList({
  items,
  reload,
}: {
  items: ListingVM[];
  reload: () => void | Promise<void>;
}) {
  const onDelete = useDeleteItem(async () => {
    await reload();
  });

  return (
    <Card title="Listings">
      <ul className="space-y-3">
        {items.map((it) => (
          <li
            key={it.id}
            className="rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium truncate">{it.title}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {it.price}
                  {" · "}
                  Updated {formatTime(it.updatedAt)}
                </div>
              </div>

              <StatusBadge status={it.status} />
            </div>

            <div className="mt-3 flex gap-3 text-sm">
              <Link
                href={`/items/${it.id}`}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                View
              </Link>

              <Link
                href={`/items/${it.id}/edit`}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>

              <button
                type="button"
                onClick={() => onDelete(it.id)}
                className="cursor-pointer inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 dark:text-rose-300 dark:hover:text-rose-200"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
