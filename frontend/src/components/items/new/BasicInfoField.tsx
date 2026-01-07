"use client";

import Card from "@/components/ui/Card";

export default function BasicInfoField(props: {
  title: string;
  setTitle: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  priceCents: number | null;
}) {
  const { title, setTitle, price, setPrice, description, setDescription, priceCents } = props;

  return (
    <Card title="Basic info">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='e.g. "Wireless mouse, barely used"'
            className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 29.99"
            inputMode="decimal"
            className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
          />
          <div className="mt-1 text-xs text-gray-500">
            {priceCents === null ? "You can enter up to 2 decimal places." : `Preview: ${priceCents} cents`}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Usage, defects, why selling..."
            className="mt-2 w-full resize-none rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
          />
        </div>
      </div>
    </Card>
  );
}
