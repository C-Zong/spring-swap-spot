"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

export type User = {
  id: number;
  username: string;
  headline: string | null;
  bio: string | null;
  avatarKey: string | null;
  avatarUrl?: string;
};

type Props = {
  user: User;
  onSave?: (next: { headline: string; bio: string; avatarFile: File | null }) => Promise<void> | void;
};

export default function ProfileHeader({ user, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    headline: user.headline ?? "",
    bio: user.bio ?? "",
  });

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const snapshotRef = useRef<{
    form: { headline: string; bio: string };
    avatarFile: File | null;
    avatarPreview: string | null;
  } | null>(null);

  useEffect(() => {
    if (isEditing) return;
    setForm({ headline: user.headline ?? "", bio: user.bio ?? "" });
  }, [user.headline, user.bio, isEditing]);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const startEdit = () => {
    snapshotRef.current = {
      form: { ...form },
      avatarFile,
      avatarPreview,
    };
    setIsEditing(true);
  };

  const rollback = () => {
    const snap = snapshotRef.current;
    if (!snap) return;
    setForm(snap.form);
    setAvatarFile(snap.avatarFile);
    setAvatarPreview(snap.avatarPreview);
  };

  const cancelEdit = () => {
    rollback();
    setIsEditing(false);
  };

  const onPickAvatar = () => {
    if (!isEditing) return;
    fileRef.current?.click();
  };

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (avatarPreview?.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);

    const url = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview(url);
  };

  const saveProfile = async () => {
    snapshotRef.current = {
      form: { ...form },
      avatarFile,
      avatarPreview,
    };

    setSaving(true);
    try {
      await onSave?.({
        headline: form.headline,
        bio: form.bio,
        avatarFile,
      });

      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success("Saved!");
    } catch (e: any) {
      rollback();
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const imgSrc = avatarPreview || user.avatarUrl || null;

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 w-full">
          {/* Avatar */}
          <button
            type="button"
            onClick={onPickAvatar}
            className={`relative h-16 w-16 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 flex items-center justify-center group ${isEditing ? "cursor-pointer hover:opacity-90" : "cursor-default"
              }`}
            aria-label={isEditing ? "Upload avatar" : "Avatar"}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={onAvatarChange}
            />

            {imgSrc ? (
              <>
                <Image src={imgSrc} alt="avatar" fill className="object-cover" />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
                )}
              </>
            ) : (
              <span className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                {user.username?.[0]?.toUpperCase() ?? "?"}
              </span>
            )}
          </button>

          {/* Name & content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold truncate">{user.username}</h1>
              <span className="text-xs rounded-full px-2 py-0.5 border border-gray-200 dark:border-gray-800 text-gray-500">
                Dashboard
              </span>
            </div>

            {/* headline */}
            {!isEditing ? (
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {user.headline}
              </div>
            ) : (
              <input
                value={form.headline}
                onChange={(e) => setForm((p) => ({ ...p, headline: e.target.value }))}
                placeholder="Headline"
                className="mt-2 w-full max-w-xl rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
              />
            )}

            {/* bio */}
            {!isEditing ? (
              <div className="mt-2 text-sm text-gray-500">{user.bio}</div>
            ) : (
              <textarea
                value={form.bio}
                onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Bio"
                rows={3}
                className="mt-2 w-full max-w-xl resize-none rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
              />
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={startEdit}
              className="cursor-pointer inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium bg-black text-white hover:opacity-90 whitespace-nowrap"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={saveProfile}
                disabled={saving}
                className="cursor-pointer inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium bg-black text-white hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="cursor-pointer inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
