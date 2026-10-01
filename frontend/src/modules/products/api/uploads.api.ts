import { authHeaders, handleResponse } from "@/lib/api-client";

// Uploads one image and returns its Cloudinary URL
export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch(`${import.meta.env.VITE_API_URL}/uploads/image`, {
    method: "POST",
    headers: authHeaders(), // no Content-Type, browser sets the boundary
    body,
  });
  return (await handleResponse<{ url: string }>(res)).data.url;
}
