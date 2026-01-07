"use client";

import React from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { formatTime } from "@/lib/time";
import { useDeleteItem } from "@/hooks/useDeleteItem";
import { ListingVM } from "@/hooks/useMyListings";

export default function ItemsTable({
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
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-800">
              <th className="py-2 pr-3">Title</th>
              <th className="py-2 pr-3">Price</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Updated</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((it) => (
              <tr
                key={it.id}
                className="border-b border-gray-100 dark:border-gray-800/60"
              >
                <td className="py-3 pr-3">
                  <div className="font-medium truncate max-w-[360px]">
                    {it.title}
                  </div>
                  <div className="text-xs text-gray-500">#{it.id}</div>
                </td>

                <td className="py-3 pr-3">
                  {it.price}
                </td>

                <td className="py-3 pr-3">
                  <StatusBadge status={it.status} />
                </td>

                <td className="py-3 pr-3 text-gray-500">
                  {formatTime(it.updatedAt)}
                </td>

                <td className="py-3 text-right">
                  <div className="inline-flex gap-3">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
