import type { Category } from "../types";
import { handleResponse, authHeaders, jsonAuthHeaders } from "@/lib/api-client";

const BASE_URL = `${import.meta.env.VITE_API_URL}/categories`;

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
      headers: jsonAuthHeaders(),
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
      headers: jsonAuthHeaders(),
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
