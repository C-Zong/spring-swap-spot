export function formatTime(updatedAt?: string) {
  if (!updatedAt) return "-";

  const d = new Date(updatedAt);
  if (isNaN(d.getTime())) return "-";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}
