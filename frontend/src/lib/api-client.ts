import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import type { PaginationMeta } from "@/modules/products/types";
import { ApiError } from "./errors";

export interface ApiEnvelope<T> {
  success: boolean;
  timestamp: string;
  data: T;
  meta?: PaginationMeta;
}

// Throws with the backend message on non-2xx
export async function handleResponse<T>(
  res: Response,
): Promise<ApiEnvelope<T>> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(
      typeof body?.message === "string" ? body.message : "",
      res.status,
    );
  }
  return res.json();
}

// Bearer header from the auth store
export function authHeaders(): HeadersInit {
  return { Authorization: `Bearer ${useAuthStore.getState().token}` };
}

export const jsonAuthHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  ...authHeaders(),
});
