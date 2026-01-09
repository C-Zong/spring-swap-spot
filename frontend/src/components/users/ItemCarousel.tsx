import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMoney} from "@/lib/money";

export type ItemVM = {
  id: number;
  title: string;
  priceCents: number;
  currency: string;
  location: string;
  negotiable: boolean;
  quantity: number;
  coverUrl?: string | null;
  updatedAt: string;
};

export function ItemCarousel({
  title,
  items,
}: {
  title: string;
  items: ItemVM[];
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollByPage = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>

        <div className="flex items-center gap-2">
          {items.length > 0 ? (
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByPage("left")}
                className="cursor-pointer rounded-xl border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/40"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByPage("right")}
                className="cursor-pointer rounded-xl border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/40"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 text-sm text-gray-500">
          No listings.
        </div>
      ) : (
        <div
          ref={scrollerRef}
          className="
            flex gap-4 overflow-x-auto pb-2
            scroll-smooth
            snap-x snap-mandatory
            [-ms-overflow-style:none] [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {items.map((it) => (
            <Link
              key={it.id}
              href={`/items/${it.id}`}
              className="
                snap-start shrink-0
                w-[85%] sm:w-[48%] lg:w-[32%]
                rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden
                hover:shadow-sm transition
                bg-white dark:bg-transparent
              "
            >
              <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800/40">
                {it.coverUrl ? (
                  <img
                    src={it.coverUrl}
                    alt={it.title}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="p-4 space-y-2">
                <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {it.title}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-200">
                  {formatMoney(it.priceCents, it.currency)}
                  <span className="text-gray-400"> · </span>
                  {it.location}
                </div>
                <div className="text-xs text-gray-500">
                  Qty {it.quantity}
                  <span className="text-gray-400"> · </span>
                  {it.negotiable ? "Negotiable" : "Fixed price"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}