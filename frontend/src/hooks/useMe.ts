"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import type { User } from "@/components/me/sections/ProfileHeader";

export default function useMe() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadMe() {
      try {
        const res = await api.get("/api/me");
        if (!alive) return;
        setUser(res.data.data);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    loadMe();
    return () => {
      alive = false;
    };
  }, []);

  return { user, setUser, loading };
}
