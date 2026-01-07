import React from "react";
import Link from "next/link";
import { StatusBadge, type ListingStatus } from "@/components/ui/StatusBadge";
import { ArrowLeft, Pencil } from "lucide-react";

export default function ItemHeaderBar({
  itemId,
  status,
}: {
  itemId: number;
  status: ListingStatus;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Link
        href="/items"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="flex items-center gap-2">
        <StatusBadge status={status} />
        <Link
          href={`/items/${itemId}/edit`}
          className="inline-flex items-center gap-2 text-sm font-medium rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Link>
      </div>
    </div>
  );
}
