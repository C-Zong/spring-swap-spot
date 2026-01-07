export type Category = "Clothing" | "Electronics" | "Furniture" | "Books" | "Other";
export type Condition = "New" | "Like New" | "Good" | "Fair" | "For parts";
export type TradeMethod = "Pickup" | "Meetup" | "Shipping";
export type ListingStatus = "Draft" | "Active" | "Sold" | "Archived";

export type NewItemImage = {
  id: string;
  file: File;
  previewUrl: string;
};

export type ItemImage = { key: string; url?: string };

export type ItemDetail = {
  id: number;
  sellerId: number;
  title: string;
  description: string;
  priceCents: number;
  currency?: string;

  category: Category | string;
  condition: Condition | string;
  tradeMethod: TradeMethod | string;
  location: string;

  tags: string[];
  quantity: number;
  negotiable: boolean;
  status: ListingStatus;

  images: Array<{ key: string; sortOrder?: number; url?: string }>;
  updatedAt?: string;
};

export type PatchItemPayload = {
  title: string;
  priceCents: number;
  description: string;
  category: Category;
  condition: Condition;
  tradeMethod: TradeMethod;
  location: string;
  tags: string[];
  quantity: number;
  negotiable: boolean;
  status: ListingStatus;
  imageKeys: string[];
};
