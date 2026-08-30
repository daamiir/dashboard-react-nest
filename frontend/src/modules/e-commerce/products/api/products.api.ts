import type {
  PaginatedResponse,
  PaginationMeta,
  Product,
  ProductQueryParams,
} from "../types";

const BASE_URL = `${import.meta.env.VITE_API_URL}/products`;

interface ApiEnvelope<T> {
  success: boolean;
  timestamp: string;
  data: T;
  meta?: PaginationMeta;
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

export type CreateProductPayload = Omit<Product, "id" | "createdAt">;
export type UpdateProductPayload = Partial<CreateProductPayload>;

export const productsApi = {
  getAll: async (
    query: ProductQueryParams,
  ): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    if (query.search) params.set("search", query.search);
    if (query.sortBy) params.set("sortBy", query.sortBy);
    if (query.sortOrder) params.set("sortOrder", query.sortOrder);
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));

    const res = await fetch(`${BASE_URL}?${params}`);
    const envelope = await handleResponse<Product[]>(res);
    return { data: envelope.data, meta: envelope.meta! };
  },

  getOne: async (id: string): Promise<Product> => {
    const res = await fetch(`${BASE_URL}/${id}`);
    const envelope = await handleResponse<Product>(res);
    return envelope.data;
  },

  create: async (payload: CreateProductPayload): Promise<Product> => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const envelope = await handleResponse<Product>(res);
    return envelope.data;
  },

  update: async (
    id: string,
    payload: UpdateProductPayload,
  ): Promise<Product> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const envelope = await handleResponse<Product>(res);
    return envelope.data;
  },

  remove: async (id: string): Promise<Product> => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    const envelope = await handleResponse<Product>(res);
    return envelope.data;
  },
};
