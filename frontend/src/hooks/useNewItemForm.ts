"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import type {
  Category,
  Condition,
  ListingStatus,
  TradeMethod,
  NewItemImage,
} from "@/types/item";
import api from "@/lib/axios";

const MAX_IMAGES = 5;

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export default function useNewItemForm() {
  // Photos
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<NewItemImage[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const pickImages = () => fileRef.current?.click();

  const addFiles = (files: FileList | File[]) => {
    const arr = Array.from(files ?? []);
    if (arr.length === 0) return;

    const remain = MAX_IMAGES - images.length;
    if (remain <= 0) {
      toast.error(`Max ${MAX_IMAGES} images`);
      return;
    }

    const picked = arr.slice(0, remain);
    const next: NewItemImage[] = picked.map((f) => ({
      id: uid(),
      file: f,
      previewUrl: URL.createObjectURL(f),
    }));

    setImages((prev) => [...prev, ...next]);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    addFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!e.dataTransfer.files?.length) return;
    addFiles(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const hit = prev.find((x) => x.id === id);
      if (hit?.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(hit.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  const moveImage = (id: string, dir: -1 | 1) => {
    setImages((prev) => {
      const idx = prev.findIndex((x) => x.id === id);
      if (idx < 0) return prev;
      const j = idx + dir;
      if (j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      const tmp = copy[idx];
      copy[idx] = copy[j];
      copy[j] = tmp;
      return copy;
    });
  };

  // Basic
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const priceCents = useMemo(() => {
    const s = price.replace(/[^0-9.]/g, "");
    if (!s) return null;
    const n = Number(s);
    if (Number.isNaN(n) || n < 0) return null;
    return Math.round(n * 100);
  }, [price]);

  // Details
  const [category, setCategory] = useState<Category>("Other");
  const [condition, setCondition] = useState<Condition>("Good");
  const [tradeMethod, setTradeMethod] = useState<TradeMethod>("Meetup");
  const [location, setLocation] = useState("");

  // Tags
  const [tagsInput, setTagsInput] = useState("");
  const tags = useMemo(() => {
    return Array.from(
      new Set(
        tagsInput
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean)
      )
    ).slice(0, 10);
  }, [tagsInput]);

  // Inventory
  const [quantity, setQuantity] = useState(1);
  const [negotiable, setNegotiable] = useState(true);

  // Submit
  const router = useRouter();
  
  const validate = () => {
    if (images.length < 1) return "Please upload at least 1 image";
    if (!title.trim()) return "Title is required";
    if (priceCents === null) return "Price is invalid";
    if (!description.trim()) return "Description is required";
    if (!location.trim()) return "Location is required";
    if (!Number.isFinite(quantity) || quantity < 1) return "Quantity must be at least 1";
    return null;
  };

  const submit = async (nextStatus: ListingStatus) => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setSubmitting(true);
    try {
      // 1) presign + put images (keep order)
      const imageKeys: string[] = [];

      for (const img of images) {
        const presignRes = await api.post("/api/uploads/item-images/presign", {
          contentType: img.file.type,
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
            "Content-Type": img.file.type,
            "Cache-Control": "public, max-age=86400",
          },
          body: img.file,
        });
        if (!putRes.ok) throw new Error("Upload to S3 failed");

        imageKeys.push(key);
      }

      // 2) create item
      const payload = {
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
        status: nextStatus,
        imageKeys,
      };

      const createRes = await api.post("/api/items", payload);
      if (createRes.data.code !== 0) {
        throw new Error(createRes.data.message || "Create item failed");
      }

      toast.success(nextStatus === "Draft" ? "Draft saved!" : "Published!");
      router.push(`/items/${createRes.data.data.id}`);
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    photos: {
      fileRef,
      images,
      maxImages: MAX_IMAGES,
      pickImages,
      onFileChange,
      onDrop,
      removeImage,
      moveImage,
      submitting,
    },

    basic: {
      title,
      setTitle,
      price,
      setPrice,
      description,
      setDescription,
      priceCents,
    },

    details: {
      category,
      setCategory,
      condition,
      setCondition,
      tradeMethod,
      setTradeMethod,
      location,
      setLocation,
    },

    tags: {
      tagsInput,
      setTagsInput,
      tags,
    },

    inventory: {
      quantity,
      setQuantity,
      negotiable,
      setNegotiable,
    },

    actions: {
      submitting,
      submit,
    },
  };
}
