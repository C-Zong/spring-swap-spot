import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatusBadge, type ListingStatus } from "@/components/ui/StatusBadge";
import { ArrowLeft, Pencil, Minus, Plus, ShoppingCart } from "lucide-react";
import { addToCart } from "@/lib/api/discover";
import toast from "react-hot-toast";

type SellerMini = {
  id: number;
  username: string;
  avatarUrl?: string | null;
};

export default function ItemHeaderBar({
  itemId,
  status,
  viewerIsSeller,
  seller,
  maxQty,
}: {
  itemId: number;
  status: ListingStatus;
  viewerIsSeller: boolean;
  seller?: SellerMini;
  maxQty: number;
}) {
  const router = useRouter();

  const safeMax = useMemo(() => Math.max(0, Math.floor(maxQty || 0)), [maxQty]);
  const [qty, setQty] = useState(1);
  const [busyCart, setBusyCart] = useState(false);

  const canBuy = safeMax > 0 && status === "Active";

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(safeMax || 1, q + 1));

  const onBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.history.length > 1) router.back();
    else router.push("/");
  };

  async function handleAddToCart() {
    if (!canBuy) return;
    try {
      setBusyCart(true);
      await addToCart(itemId, Math.min(Math.max(qty, 1), safeMax));
      toast.success("Added to cart");
    } finally {
      setBusyCart(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <a
        href="/"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </a>

      <div className="flex items-center gap-2">
        <StatusBadge status={status} />

        {viewerIsSeller ? (
          <Link
            href={`/items/${itemId}/edit`}
            className="inline-flex items-center gap-2 text-sm font-medium rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        ) : (
          <>
            {seller && (
              <Link
                href={`/users/${seller.id}`}
                className="group inline-flex items-center gap-2 rounded-xl px-2 py-2 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                title={`View ${seller.username}`}
              >
                <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  {seller.avatarUrl ? (
                    <img
                      src={seller.avatarUrl}
                      alt={seller.username}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {seller.username}
                </span>
              </Link>
            )}

            <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2 py-2 dark:border-gray-800 dark:bg-gray-900">
              <button
                type="button"
                onClick={dec}
                disabled={!canBuy || qty <= 1 || busyCart}
                className="cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-lg
                           text-gray-700 hover:bg-gray-100 active:bg-gray-200
                           disabled:opacity-50
                           dark:text-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>

              <div className="min-w-[2.25rem] text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                {canBuy ? qty : 0}
              </div>

              <button
                type="button"
                onClick={inc}
                disabled={!canBuy || qty >= (safeMax || 1) || busyCart}
                className="cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-lg
                           text-gray-700 hover:bg-gray-100 active:bg-gray-200
                           disabled:opacity-50
                           dark:text-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canBuy || busyCart}
                className="cursor-pointer ml-1 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
                           border border-gray-200 hover:bg-gray-50 active:bg-gray-100
                           disabled:opacity-50
                           dark:border-gray-800 dark:hover:bg-gray-800/40 dark:active:bg-gray-800"
                title={canBuy ? "Add to cart" : "Out of stock"}
              >
                <ShoppingCart className="h-4 w-4" />
                Add
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
