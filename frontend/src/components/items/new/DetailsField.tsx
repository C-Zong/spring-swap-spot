"use client";

import Card from "@/components/ui/Card";
import type { Category, Condition, TradeMethod } from "@/types/item";

export default function DetailsField(props: {
  category: Category;
  setCategory: (v: Category) => void;
  condition: Condition;
  setCondition: (v: Condition) => void;
  tradeMethod: TradeMethod;
  setTradeMethod: (v: TradeMethod) => void;
  location: string;
  setLocation: (v: string) => void;
}) {
  const { category, setCategory, condition, setCondition, tradeMethod, setTradeMethod, location, setLocation } = props;

  return (
    <Card title="Details">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 px-3 py-2 text-sm outline-none
            focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
          >
            <option value="Clothing">Clothing</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Books">Books</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Condition</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value as Condition)}
            className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 px-3 py-2 text-sm outline-none
            focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
          >
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="For parts">For parts</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Trade method</label>
          <select
            value={tradeMethod}
            onChange={(e) => setTradeMethod(e.target.value as TradeMethod)}
            className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 px-3 py-2 text-sm outline-none
            focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
          >
            <option value="Pickup">Pickup only</option>
            <option value="Meetup">Meet up</option>
            <option value="Shipping">Shipping available</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. OSU campus / Columbus"
            className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
          />
        </div>
      </div>
    </Card>
  );
}
