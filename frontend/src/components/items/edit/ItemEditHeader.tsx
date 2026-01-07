"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeleteItem } from "@/hooks/useDeleteItem";

export default function ItemEditHeader({
  backHref,
  saving,
  onSave,
  itemId,
}: {
  backHref: string;
  saving: boolean;
  onSave: () => void;
  itemId: number | undefined;
}) {
  const router = useRouter();

  const deleteItem = useDeleteItem(async () => {
    router.push("/items");
    router.refresh();
  });

  return (
    <div className="flex items-center justify-between gap-3">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="cursor-pointer inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          Save
        </button>

        {itemId && (
          <button
            type="button"
            onClick={() => deleteItem(itemId)}
            disabled={saving}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium
             border border-red-300 text-red-600
             hover:bg-red-50
             dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20
             disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
