"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import type {
  Category,
  Condition,
  ItemDetail,
  ItemImage,
  ListingStatus,
  PatchItemPayload,
  TradeMethod,
} from "@/types/item";
import { presignGetUrl, presignPutAndUpload } from "../lib/s3";

function parsePriceToCents(input: string): number | null {
  const cleaned = input.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

function centsToInput(cents: number) {
  return (cents / 100).toFixed(2);
}

export function useItemEdit(id: string | undefined) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [itemId, setItemId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState<Category>("Other");
  const [condition, setCondition] = useState<Condition>("Good");
  const [tradeMethod, setTradeMethod] = useState<TradeMethod>("Meetup");
  const [location, setLocation] = useState("");

  const [tagsInput, setTagsInput] = useState("");
  const tags = useMemo(() => {
    const arr = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => t.toLowerCase());
    return Array.from(new Set(arr)).slice(0, 10);
  }, [tagsInput]);

  const [quantity, setQuantity] = useState(1);
  const [negotiable, setNegotiable] = useState(true);
  const [status, setStatus] = useState<ListingStatus>("Draft");

  const [images, setImages] = useState<ItemImage[]>([]);

  const priceCents = useMemo(() => parsePriceToCents(price), [price]);
  const canAddMore = images.length < 5;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        const res = await api.get(`/api/items/${id}`);
        const data = res.data?.data as ItemDetail;

        if (cancelled) return;

        setItemId(data.id);
        setTitle(data.title ?? "");
        setPrice(centsToInput(data.priceCents ?? 0));
        setDescription(data.description ?? "");

        setCategory((data.category as Category) ?? "Other");
        setCondition((data.condition as Condition) ?? "Good");
        setTradeMethod((data.tradeMethod as TradeMethod) ?? "Meetup");
        setLocation(data.location ?? "");

        setQuantity(data.quantity ?? 1);
        setNegotiable(!!data.negotiable);
        setStatus((data.status as ListingStatus) ?? "Draft");

        setTagsInput((data.tags ?? []).join(", "));

        const baseImgs = (data.images ?? [])
          .slice()
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((x) => ({ key: x.key, url: x.url }));

        const need = baseImgs.some((x) => !x.url);
        if (!need) {
          setImages(baseImgs);
          return;
        }

        const urls = await Promise.all(
          baseImgs.map(async (img) => (img.url ? img.url : await presignGetUrl(img.key)))
        );

        setImages(baseImgs.map((img, i) => ({ ...img, url: urls[i] })));
      } catch (e: any) {
        toast.error(e?.message || "Failed to load item");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function validate(): string | null {
    if (!title.trim()) return "Title required";
    if (priceCents === null) return "Price invalid";
    if (!description.trim()) return "Description required";
    if (!location.trim()) return "Location required";
    if (quantity < 1) return "Quantity must be >= 1";
    if (images.length < 1) return "At least 1 photo required";
    if (images.length > 5) return "Max 5 photos";
    return null;
  }

  function pickImages() {
    fileRef.current?.click();
  }

  async function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    if (!canAddMore) return toast.error("Max 5 photos");

    const allowed = new Set(["image/png", "image/jpeg", "image/webp"]);
    for (const f of files) {
      if (!allowed.has(f.type)) return toast.error("Only png/jpg/webp allowed");
    }

    const room = 5 - images.length;
    const slice = files.slice(0, room);

    try {
      setSaving(true);

      const keys: string[] = [];
      for (const f of slice) {
        const key = await presignPutAndUpload(f);
        keys.push(key);
      }

      const urls = await Promise.all(keys.map((k) => presignGetUrl(k)));
      setImages((prev) => [...prev, ...keys.map((k, i) => ({ key: k, url: urls[i] }))]);

      toast.success("Uploaded!");
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setSaving(false);
    }
  }

  function moveImage(from: number, dir: -1 | 1) {
    setImages((prev) => {
      const to = from + dir;
      if (to < 0 || to >= prev.length) return prev;
      const next = prev.slice();
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  async function save() {
    const err = validate();
    if (err) return toast.error(err);
    if (!itemId) return toast.error("Invalid item id");

    const payload: PatchItemPayload = {
      title: title.trim(),
      priceCents: priceCents!,
      description: description.trim(),
      category,
      condition,
      tradeMethod,
      location: location.trim(),
      tags,
      quantity,
      negotiable,
      status,
      imageKeys: images.map((x) => x.key),
    };

    try {
      setSaving(true);
      const res = await api.patch(`/api/items/${itemId}`, payload);
      if (res.data?.code !== 0) throw new Error(res.data?.message || "Save failed");

      toast.success("Saved!");
      return itemId;
    } catch (e: any) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }

    return itemId;
  }

  return {
    fileRef,
    loading,
    saving,

    itemId,

    title,
    setTitle,
    price,
    setPrice,
    description,
    setDescription,

    category,
    setCategory,
    condition,
    setCondition,
    tradeMethod,
    setTradeMethod,
    location,
    setLocation,

    tagsInput,
    setTagsInput,
    tags,

    quantity,
    setQuantity,
    negotiable,
    setNegotiable,
    status,
    setStatus,

    images,
    canAddMore,

    pickImages,
    onFilesSelected,
    moveImage,
    removeImage,

    save,
  };
}
