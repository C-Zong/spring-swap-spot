export type OrderStatus = "Pending" | "Completed" | "Refunded";
export type ListingStatus = "Active" | "Draft" | "Sold" | "Archived";

export function StatusBadge({ status }: { status: OrderStatus | ListingStatus }) {
  type Status = OrderStatus | ListingStatus;

  const map: Record<Status, string> = {
    Pending:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200",
    Completed:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-200",
    Refunded:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-200",
    Active:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-900/20 dark:text-sky-200",
    Draft:
      "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-200",
    Sold:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/50 dark:bg-purple-900/20 dark:text-purple-200",
    Archived:
      "border-gray-200 bg-gray-100 text-gray-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <span className={`text-xs rounded-full border px-2 py-0.5 ${map[status]}`}>
      {status}
    </span>
  );
}
