"use client";

import React, { useState } from "react";
import ItemsHeaderBar, { type ItemsView } from "@/components/items/ItemsHeaderBar";
import ItemsEmpty from "@/components/items/ItemsEmpty";
import ItemsTable from "@/components/items/ItemsTable";
import ItemsList from "@/components/items/ItemsList";
import { useMyListings } from "@/hooks/useMyListings";

export default function ItemsPage() {
  const [view, setView] = useState<ItemsView>("table");

  const { listings: items, loading, reload } = useMyListings();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <ItemsHeaderBar view={view} onChangeView={setView} />

      <div className="mt-6">
        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : items.length === 0 ? (
          <ItemsEmpty />
        ) : view === "table" ? (
          <ItemsTable items={items} reload={reload} />
        ) : (
          <ItemsList items={items} reload={reload} />
        )}
      </div>
    </div>
  );
}
