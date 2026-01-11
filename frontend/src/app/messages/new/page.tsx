import NewMessageClient from "@/components/messages/NewMessageClient";
import { Suspense } from "react";

export default function NewMessagePage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading…</div>}>
      <NewMessageClient />
    </Suspense>
  );
}
