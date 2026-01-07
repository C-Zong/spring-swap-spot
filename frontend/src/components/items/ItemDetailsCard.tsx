import React from "react";
import Card from "@/components/ui/Card";
import { StatusBadge, type ListingStatus } from "@/components/ui/StatusBadge";
import { MapPin, Package, HandCoins } from "lucide-react";

export default function ItemDetailsCard({
  location,
  quantity,
  negotiable,
  status,
  tags,
}: {
  location: string;
  quantity: number;
  negotiable: boolean;
  status: ListingStatus;
  tags: string[];
}) {
  return (
    <Card title="Details">
      <div className="space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <div className="text-gray-500 inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </div>
          <div className="text-right">{location}</div>
        </div>

        <div className="flex justify-between gap-4">
          <div className="text-gray-500 inline-flex items-center gap-2">
            <Package className="h-4 w-4" />
            Quantity
          </div>
          <div className="text-right">{quantity}</div>
        </div>

        <div className="flex justify-between gap-4">
          <div className="text-gray-500 inline-flex items-center gap-2">
            <HandCoins className="h-4 w-4" />
            Negotiable
          </div>
          <div className="text-right">{negotiable ? "Yes" : "No"}</div>
        </div>

        <div className="flex justify-between gap-4">
          <div className="text-gray-500">Status</div>
          <div className="text-right">
            <StatusBadge status={status} />
          </div>
        </div>
      </div>

      {tags?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="text-xs rounded-full px-2 py-1 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300"
            >
              #{t}
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-4 text-xs text-gray-500">No tags</div>
      )}
    </Card>
  );
}
