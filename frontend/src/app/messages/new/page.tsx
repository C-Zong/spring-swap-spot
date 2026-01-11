"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";

export default function NewMessagePage() {
  const router = useRouter();
  const params = useSearchParams();
  const to = params.get("to");

  useEffect(() => {
    if (!to) {
      router.push("/messages");
      return;
    }

    (async () => {
      try {
        const res = await api.post(`/api/messages/dm/${to}`);
        const threadId = res.data.data.threadId;
        router.push(`/messages/${threadId}`);
      } catch (e) {
        router.push("/messages");
      }
    })();
  }, [to, router]);

  return (
    <div className="p-6 text-sm text-gray-500">
      Starting conversation…
    </div>
  );
}
