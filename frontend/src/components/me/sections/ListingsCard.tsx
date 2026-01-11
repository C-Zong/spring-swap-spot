import Link from "next/link";
import Card from "../../ui/Card";
import { StatusBadge } from "../../ui/StatusBadge";
import { ListingVM } from "@/hooks/useMyListings";
import { ChevronRight } from "lucide-react";
import { useDeleteItem } from "@/hooks/useDeleteItem";

export default function ListingsCard({
  listings,
  loading,
  reload,
}: {
  listings: ListingVM[];
  loading?: boolean;
  reload: () => Promise<void> | void;
}) {

  const onDelete = useDeleteItem(async () => {
    await reload();
  });

  if (loading) return <Card title="My Listings"><div className="text-sm text-gray-500">Loading...</div></Card>;

  return (
    <Card
      title="My Listings"
      action={
        <Link
          href="/items/new"
          className="text-sm font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
        >
          + New
        </Link>
      }
    >
      {listings.length ? (
        <ul className="space-y-3">
          {listings.map((it) => (
            <li
              key={it.id}
              className="rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{it.title}</div>
                  <div className="mt-1 text-xs text-gray-500">{it.price}</div>
                </div>
                <StatusBadge status={it.status} />
              </div>

              <div className="mt-3 flex gap-3 text-sm">
                <Link
                  href={`/items/${it.id}`}
                  className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
                >
                  View
                </Link>
                <Link
                  href={`/items/${it.id}/edit`}
                  className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => onDelete(it.id)}
                  className="cursor-pointer text-rose-600 hover:text-rose-700 dark:text-rose-300 dark:hover:text-rose-200"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-500">No listings yet.</div>
      )}

      <div className="mt-4 flex justify-end">
        <Link
          href="/items"
          className="
            inline-flex items-center gap-1
            rounded-lg border border-gray-200 dark:border-gray-800
            px-3 py-1.5 text-sm font-medium
            text-gray-700 hover:bg-gray-50 hover:text-black
            dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white
            transition
          "
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

    </Card>
  );
}
