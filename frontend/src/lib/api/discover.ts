import api from "@/lib/axios";
import type { Listing } from "@/hooks/useMyListings";

export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export async function getDiscoverRaw(limit = 36): Promise<Listing[]> {
  const res = await api.get<ApiResponse<Listing[]>>("/api/discover", {
    params: { limit },
  });

  if (res.data.code !== 0) {
    throw new Error(res.data.message || "Load failed");
  }

  return res.data.data ?? [];
}

export async function toggleFavorite(itemId: number): Promise<boolean> {
  const res = await api.post<ApiResponse<{ favored: boolean }>>(`/api/items/${itemId}/favorite`);
  if (res.data.code !== 0) throw new Error(res.data.message || "Favorite failed");
  return res.data.data.favored;
}

export async function addToCart(itemId: number, quantity?: number): Promise<void> {
  const res = await api.post<ApiResponse<null>>(`/api/cart/add`, { itemId, quantity });
  if (res.data.code !== 0) throw new Error(res.data.message || "Add to cart failed");
}
