import React from "react";
import Card from "@/components/ui/Card";

export default function ItemDescriptionCard({ description }: { description: string }) {
  return (
    <Card title="Description">
      <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
        {description}
      </p>
    </Card>
  );
}
