import React from "react";
import Card from "@/components/ui/Card";
import { PackageOpen } from "lucide-react";

export default function ItemsEmpty() {
  return (
    <Card title="No listings yet">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <PackageOpen className="h-5 w-5 text-gray-500" />
        </div>

        <div className="min-w-0">
          <div className="text-sm text-gray-700 dark:text-gray-200">
            You haven’t posted anything yet.
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Create your first item and it will show up here.
          </div>
        </div>
      </div>
    </Card>
  );
}
