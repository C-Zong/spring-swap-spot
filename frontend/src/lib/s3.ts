import api from "@/lib/axios";

export async function presignGetUrl(key: string): Promise<string> {
  const res = await api.get("/api/uploads/item-images/url", { params: { key } });
  if (res.data?.code === 0) return res.data.data.url as string;
  return "";
}

export async function presignPutAndUpload(file: File): Promise<string> {
  const presignRes = await api.post("/api/uploads/item-images/presign", {
    contentType: file.type,
  });

  if (presignRes.data?.code !== 0) {
    throw new Error(presignRes.data?.message || "Presign failed");
  }

  const { uploadUrl, key } = presignRes.data.data as { uploadUrl: string; key: string };

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
      "Cache-Control": "public, max-age=86400",
    },
    body: file,
  });

  if (!putRes.ok) throw new Error("Upload to S3 failed");
  return key;
}
