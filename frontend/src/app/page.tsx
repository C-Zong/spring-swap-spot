import { Suspense } from "react";
import HomeClient from "@/components/home/HomeClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading…</div>}>
      <HomeClient />
    </Suspense>
  );
}