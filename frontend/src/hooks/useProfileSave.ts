"use client";

import api from "@/lib/axios";
import type { User } from "@/components/me/sections/ProfileHeader";

export default function useProfileSave() {
  return async function saveProfile(params: {
    user: User;
    headline: string;
    bio: string;
    avatarFile?: File | null;
  }): Promise<{ headline: string; bio: string; avatarUrl?: string }> {
    const { user, headline, bio, avatarFile } = params;

    let avatarKey: string | undefined;

    if (avatarFile) {
      const presignRes = await api.post("/api/uploads/avatar/presign", {
        userId: user.id,
        contentType: avatarFile.type,
      });

      if (presignRes.data.code !== 0) {
        throw new Error(presignRes.data.message || "Presign failed");
      }

      const { uploadUrl, key } = presignRes.data.data as {
        uploadUrl: string;
        key: string;
      };

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": avatarFile.type,
          "Cache-Control": "public, max-age=86400",
        },
        body: avatarFile,
      });

      if (!putRes.ok) {
        throw new Error("Upload to S3 failed");
      }

      avatarKey = key;
    }

    const saveRes = await api.patch("/api/profile", {
      headline,
      bio,
      ...(avatarKey ? { avatarKey } : {}),
    });

    if (saveRes.data.code !== 0) {
      throw new Error(saveRes.data.message || "Save profile failed");
    }

    let nextAvatarUrl = user.avatarUrl;
    if (avatarKey) {
      const urlRes = await api.get("/api/uploads/avatar/url", {
        params: { key: avatarKey },
      });
      if (urlRes.data.code === 0) {
        nextAvatarUrl = urlRes.data.data.url;
      }
    }

    return { headline, bio, avatarUrl: nextAvatarUrl };
  };
}
