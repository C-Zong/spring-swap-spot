"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { v4 as uuidv4 } from "uuid";
import { generateHTML } from "@tiptap/html";
import { Inbox } from "lucide-react";
import { formatTime } from "@/lib/time";

type ApiResp<T> = { code: number; message: string; data: T };

type MsgRow = {
  id: string;
  senderId: number;
  contentJson: string;
  createdAt: string;
  revokedAt?: string | null;
  isMe: boolean;
};

function renderTiptap(contentJson: string) {
  try {
    const doc = JSON.parse(contentJson);
    return generateHTML(doc, [StarterKit]);
  } catch {
    return "";
  }
}

export default function ThreadPage() {
  const params = useParams<{ id: string }>();
  const threadId = params.id;
  const router = useRouter();

  const [msgs, setMsgs] = useState<MsgRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const latestMsgId = useMemo(() => {
    let max = BigInt(0);
    for (const m of msgs) {
      try {
        const id = BigInt(m.id);
        if (id > max) max = id;
      } catch {
      }
    }
    return max;
  }, [msgs]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResp<MsgRow[]>>(`/api/messages/threads/${threadId}?limit=30`);
      setMsgs(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[42px] px-3 py-2",
      },
      handleKeyDown: (_view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          void send();
          return true;
        }
        return false;
      },
    },
  });

  const send = async () => {
    if (!editor || sending) return;
    const json = editor.getJSON();

    const text = editor.getText().trim();
    if (!text) return;

    setSending(true);
    try {
      const clientMsgId = uuidv4();
      await api.post(`/api/messages/threads/${threadId}/send`, {
        contentJson: JSON.stringify(json),
        clientMsgId,
      });
      editor.commands.clearContent(true);
      await load();
      await markRead();
    } finally {
      setSending(false);
    }
  };

  const markRead = async () => {
    if (!latestMsgId) return;
    await api.post(`/api/messages/threads/${threadId}/read`, { lastMsgId: latestMsgId.toString() });
  };

  useEffect(() => {
    if (!threadId) {
      router.push("/messages");
      return;
    }
    try {
      BigInt(threadId);
    } catch {
      router.push("/messages");
      return;
    }
    void (async () => {
      await load();
    })();
  }, [threadId]);

  useEffect(() => {
    if (!loading && msgs.length) {
      void markRead();
    }
  }, [loading, msgs.length, latestMsgId]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Chat</div>
        <button
          onClick={() => router.push("/messages")}
          className="cursor-pointer inline-flex items-center text-sm rounded-xl px-3 py-1 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 py-1"
        >
          <Inbox className="mr-1 h-4 w-4" />
          Inbox
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="h-[60vh] overflow-y-auto bg-white dark:bg-gray-900 px-4 py-4 space-y-3">
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : msgs.length === 0 ? (
            <div className="text-sm text-gray-500">No messages yet. Say hi 👋</div>
          ) : (
            msgs
              .slice()
              .sort((a, b) => BigInt(a.id) < BigInt(b.id) ? -1 : BigInt(a.id) > BigInt(b.id) ? 1 : 0)
              .map((m) => (
                <div
                  key={m.id}
                  className={`flex mb-2 ${m.isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-3 py-2
                    ${m.isMe
                        ? "bg-blue-600 dark:bg-blue-900 text-white"
                        : "border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"}
                    `}
                  >
                    {m.revokedAt ? (
                      <div className="text-xs text-gray-400 italic">
                        Message revoked
                      </div>
                    ) : (
                      <div
                        className={`
                          prose prose-sm max-w-none
                          ${m.isMe ? "prose-invert" : "dark:prose-invert"}
                        `}
                        dangerouslySetInnerHTML={{
                          __html: renderTiptap(m.contentJson),
                        }}
                      />
                    )}

                    <div
                      className={`
                        mt-1 text-[11px]
                        ${m.isMe ? "text-blue-100" : "text-gray-500"}
                      `}
                    >
                      {formatTime(m.createdAt)}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-end gap-2 p-2">
            <div className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
              <EditorContent editor={editor} />
            </div>
            <button
              onClick={() => void send()}
              disabled={sending}
              className="cursor-pointer rounded-2xl px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 disabled:opacity-50"
            >
              Send
            </button>
          </div>
          <div className="px-3 pb-2 text-[11px] text-gray-500">
            Send (Enter) • Newline (Shift+Enter)  • Bold (⌘/Ctrl+B) • Italic (⌘/Ctrl+I) • Code (⌘/Ctrl+E)
          </div>
        </div>
      </div>
    </div>
  );
}
