"use client";

import useNewItemForm from "@/hooks/useNewItemForm";
import ImagesField from "@/components/items/new/ImagesField";
import BasicInfoField from "@/components/items/new/BasicInfoField";
import DetailsField from "@/components/items/new/DetailsField";
import TagsField from "@/components/items/new/TagsField";
import InventoryField from "@/components/items/new/InventoryField";
import ActionsCard from "@/components/items/new/ActionsCard";

export default function NewItemPage() {
  const form = useNewItemForm();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Listing</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <ImagesField {...form.photos} />
          <BasicInfoField {...form.basic} />
        </div>

        <div className="space-y-5">
          <DetailsField {...form.details} />
          <TagsField {...form.tags} />
          <InventoryField {...form.inventory} />
          <ActionsCard {...form.actions} />
        </div>
      </div>
    </div>
  );
}
