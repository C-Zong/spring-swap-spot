"use client";

import React from "react";
import Link from "next/link";
import { LayoutGrid, List, Plus } from "lucide-react";

export type ItemsView = "table" | "list";

export default function ItemsHeaderBar({
  view,
  onChangeView,
}: {
  view: ItemsView;
  onChangeView: (v: ItemsView) => void;
}) {
  const tabBase =
    "cursor-pointer inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium border";
  const active =
    "border-black dark:border-white bg-black text-white dark:bg-white dark:text-black";
  const idle =
    "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold">My Listings</h1>
        <div className="mt-1 text-sm text-gray-500">
          Items you posted for sale
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChangeView("table")}
          className={`${tabBase} ${view === "table" ? active : idle}`}
        >
          <LayoutGrid className="h-4 w-4" />
          Table
        </button>

        <button
          type="button"
          onClick={() => onChangeView("list")}
          className={`${tabBase} ${view === "list" ? active : idle}`}
        >
          <List className="h-4 w-4" />
          List
        </button>

        <Link
          href="/items/new"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium bg-black text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New
        </Link>
      </div>
    </div>
  );
}
