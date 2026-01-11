"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { formatTime } from "@/lib/time";
import { extractPreview } from "@/components/utils/tiptapPreview";

type ApiResp<T> = { code: number; message: string; data: T };

type ThreadRow = {
  threadId: string;
  otherUserId: number;
  otherUsername: string;
  otherAvatarUrl?: string | null;
  latestMsgId?: string | null;
  latestContentJson?: string | null;
  latestAt?: string | null;
  clearedBeforeMsgId: string;
  unreadDot?: boolean;
};

export default function MessagesPage() {
  const [threads, setThreads] = useState<ThreadRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResp<ThreadRow[]>>("/api/messages/threads");
      setThreads(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const hide = async (id: string) => {
    await api.post(`/api/messages/threads/${id}/hide`);
    await load();
  };

  const clear = async (id: string) => {
    await api.post(`/api/messages/threads/${id}/clear`);
    await load();
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="text-xl font-semibold">Messages</div>

      <div className="mt-4 space-y-2">
        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : threads.length === 0 ? (
          <div className="text-sm text-gray-500">No conversations yet.</div>
        ) : (
          threads.map((t) => (
            <div
              key={t.threadId}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <Link
                href={`/messages/${t.threadId}`}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded-2xl"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 shrink-0">
                  {t.otherAvatarUrl ? (
                    <img src={t.otherAvatarUrl} alt={t.otherUsername} className="h-full w-full object-cover" />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium truncate">{t.otherUsername}</div>
                    {t.unreadDot ? (
                      <span className="inline-flex h-2 w-2 rounded-full bg-red-500" />
                    ) : null}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 truncate">
                    {t.latestContentJson ? extractPreview(t.latestContentJson) : "Say hi 👋"}
                  </div>
                </div>

                <div className="text-xs text-gray-500 shrink-0">
                  {t.latestAt ? formatTime(t.latestAt) : ""}
                </div>
              </Link>

              <div className="flex gap-2 px-4 pb-3">
                <div className="flex-1" />
                <button
                  onClick={() => clear(t.threadId)}
                  className="cursor-pointer text-xs rounded-xl px-3 py-1 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                >
                  Clear
                </button>
                <button
                  onClick={() => hide(t.threadId)}
                  className="cursor-pointer text-xs rounded-xl px-3 py-1 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                >
                  Hide
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
