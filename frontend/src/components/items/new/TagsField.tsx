"use client";

import Card from "@/components/ui/Card";

export default function TagsField(props: {
  tagsInput: string;
  setTagsInput: (v: string) => void;
  tags: string[];
}) {
  const { tagsInput, setTagsInput, tags } = props;

  return (
    <Card title="Tags">
      <div>
        <label className="block text-sm font-medium">Tags (comma separated)</label>
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g. wireless mouse, bluetooth, portable"
          className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
        />
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="text-xs rounded-full px-2 py-0.5 border border-gray-200 dark:border-gray-800 text-gray-500"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
        <div className="mt-2 text-xs text-gray-500">Up to 10 tags.</div>
      </div>
    </Card>
  );
}
