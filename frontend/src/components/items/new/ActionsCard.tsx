"use client";

import Card from "@/components/ui/Card";

export default function ActionsCard(props: {
  submitting: boolean;
  submit: (nextStatus: "Draft" | "Active" | "Sold" | "Archived") => Promise<void> | void;
}) {
  const { submitting, submit } = props;

  return (
    <Card title="Actions">
      <div className="space-y-2">
        <button
          type="button"
          disabled={submitting}
          onClick={() => submit("Draft")}
          className="cursor-pointer w-full inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 disabled:opacity-50"
        >
          Save draft
        </button>

        <button
          type="button"
          disabled={submitting}
          onClick={() => submit("Active")}
          className="cursor-pointer w-full inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium bg-black text-white hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Publishing..." : "Publish"}
        </button>

        <div className="text-xs text-gray-500">
          Tip: Keep Draft if you want to edit later.
        </div>
      </div>
    </Card>
  );
}
