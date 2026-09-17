import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import type { Category } from "../types";

const BASE_URL = `${import.meta.env.VITE_API_URL}/categories`;

interface ApiEnvelope<T> {
  success: boolean;
  timestamp: string;
  data: T;
}

async function handleResponse<T>(res: Response): Promise<ApiEnvelope<T>> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      body?.message ?? `Request failed with status ${res.status}`,
    );
  }
  return res.json();
}

function authHeaders(): HeadersInit {
  const token = useAuthStore.getState().token;
  return { Authorization: `Bearer ${token}` };
}

export type CreateCategoryPayload = Omit<Category, "id" | "children">;
export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await fetch(BASE_URL);
    const envelope = await handleResponse<Category[]>(res);
    return envelope.data;
  },

  getOne: async (id: string): Promise<Category> => {
    const res = await fetch(`${BASE_URL}/${id}`);
    const envelope = await handleResponse<Category>(res);
    return envelope.data;
  },

  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });
    const envelope = await handleResponse<Category>(res);
    return envelope.data;
  },

  update: async (
    id: string,
    payload: UpdateCategoryPayload,
  ): Promise<Category> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });
    const envelope = await handleResponse<Category>(res);
    return envelope.data;
  },

  remove: async (id: string): Promise<Category> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const envelope = await handleResponse<Category>(res);
    return envelope.data;
  },
};
