"use client";

import Card from "@/components/ui/Card";

export default function InventoryField(props: {
  quantity: number;
  setQuantity: (v: number) => void;
  negotiable: boolean;
  setNegotiable: (v: boolean) => void;
}) {
  const { quantity, setQuantity, negotiable, setNegotiable } = props;

  return (
    <Card title="Inventory">
      <div className="space-y-4">
        <div className="grid">
          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
              className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={negotiable}
            onChange={(e) => setNegotiable(e.target.checked)}
            className="h-4 w-4"
          />
          Negotiable
        </label>
      </div>
    </Card>
  );
}
