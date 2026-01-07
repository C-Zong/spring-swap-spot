"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import ItemEditHeader from "@/components/items/edit/ItemEditHeader";
import { useItemEdit } from "@/hooks/useItemEdit";
import ItemEditForm from "@/components/items/edit/ItemEditForm";
import ItemEditPhotos from "@/components/items/edit/ItemEditPhotos";
import Card from "@/components/ui/Card";

export default function ItemEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const s = useItemEdit(id);

  if (s.loading) return <div className="px-4 py-8">Loading...</div>;

  const backHref = s.itemId ? `/items/${s.itemId}` : "/items";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <ItemEditHeader
        backHref={backHref}
        saving={s.saving}
        onSave={async () => {
          const itemId = await s.save();
          if (itemId) {
            router.push(`/items/${itemId}`);
            router.refresh();
          }
        }}
        itemId={s.itemId ?? undefined}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-bold">Edit listing</h1>
        <div className="mt-1 text-sm text-gray-500">
          Update details, photos, and status.
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ItemEditForm
            title={s.title}
            setTitle={s.setTitle}
            price={s.price}
            setPrice={s.setPrice}
            description={s.description}
            setDescription={s.setDescription}
            category={s.category}
            setCategory={s.setCategory}
            condition={s.condition}
            setCondition={s.setCondition}
            tradeMethod={s.tradeMethod}
            setTradeMethod={s.setTradeMethod}
            location={s.location}
            setLocation={s.setLocation}
            tagsInput={s.tagsInput}
            setTagsInput={s.setTagsInput}
            tags={s.tags}
            quantity={s.quantity}
            setQuantity={s.setQuantity}
            negotiable={s.negotiable}
            setNegotiable={s.setNegotiable}
            status={s.status}
            setStatus={s.setStatus}
          />
        </div>

        <div className="lg:col-span-1 space-y-5">
          <ItemEditPhotos
            fileRef={s.fileRef}
            saving={s.saving}
            canAddMore={s.canAddMore}
            images={s.images}
            onPick={s.pickImages}
            onFilesSelected={s.onFilesSelected}
            onMove={s.moveImage}
            onRemove={s.removeImage}
          />

          <Card title="Tip">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Keep the cover photo clear and bright. Add a close-up for any flaws.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
