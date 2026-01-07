"use client";

import api from "@/lib/axios";
import { toast } from "react-hot-toast";

export function useDeleteItem(onSuccess?: () => void | Promise<void>) {
  return async (id: number) => {
    const ok = window.confirm("Delete this listing? This can't be undone.");
    if (!ok) return;

    try {
      const res = await api.delete(`/api/items/${id}`);
      if (res.data?.code !== 0) {
        throw new Error(res.data?.message || "Delete failed");
      }
      toast.success("Deleted");
      await onSuccess?.();
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    }
  };
}
