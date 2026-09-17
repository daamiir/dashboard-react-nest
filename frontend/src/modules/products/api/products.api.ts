import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import type {
  PaginatedResponse,
  PaginationMeta,
  Product,
  ProductQueryParams,
  ProductVariant,
} from "../types";
import type { VariantFormValues } from "../schema";

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

function authHeaders(): HeadersInit {
  const token = useAuthStore.getState().token;
  return { Authorization: `Bearer ${token}` };
}

export type CreateProductPayload = Omit<
  Product,
  "id" | "createdAt" | "createdById" | "variants"
> & {
  variants: Omit<ProductVariant, "id">[];
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

function buildQueryParams(query: ProductQueryParams): URLSearchParams {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.categoryId) params.set("categoryId", query.categoryId);
  if (query.minPrice !== undefined)
    params.set("minPrice", String(query.minPrice));
  if (query.maxPrice !== undefined)
    params.set("maxPrice", String(query.maxPrice));
  if (query.ram !== undefined) params.set("ram", String(query.ram));
  if (query.storage !== undefined) params.set("storage", String(query.storage));
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortOrder) params.set("sortOrder", query.sortOrder);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  return params;
}

export const productsApi = {
  getAll: async (
    query: ProductQueryParams,
  ): Promise<PaginatedResponse<Product>> => {
    const params = buildQueryParams(query);

    const res = await fetch(`${BASE_URL}?${params}`);
    const envelope = await handleResponse<Product[]>(res);
    return { data: envelope.data, meta: envelope.meta! };
  },

  getMyProducts: async (
    query: ProductQueryParams,
  ): Promise<PaginatedResponse<Product>> => {
    const params = buildQueryParams(query);

    const res = await fetch(`${BASE_URL}/me?${params}`, {
      headers: authHeaders(),
    });
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
      headers: { "Content-Type": "application/json", ...authHeaders() },
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
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });
    const envelope = await handleResponse<Product>(res);
    return envelope.data;
  },

  remove: async (id: string): Promise<Product> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const envelope = await handleResponse<Product>(res);
    return envelope.data;
  },

  addVariant: async (
    productId: string,
    payload: Omit<VariantFormValues, "id">,
  ): Promise<ProductVariant> => {
    const res = await fetch(`${BASE_URL}/${productId}/variants`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });
    const envelope = await handleResponse<ProductVariant>(res);
    return envelope.data;
  },

  updateVariant: async (
    productId: string,
    variantId: string,
    payload: VariantFormValues,
  ): Promise<ProductVariant> => {
    const res = await fetch(`${BASE_URL}/${productId}/variants/${variantId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });
    const envelope = await handleResponse<ProductVariant>(res);
    return envelope.data;
  },

  removeVariant: async (
    productId: string,
    variantId: string,
  ): Promise<ProductVariant> => {
    const res = await fetch(`${BASE_URL}/${productId}/variants/${variantId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const envelope = await handleResponse<ProductVariant>(res);
    return envelope.data;
  },
};
