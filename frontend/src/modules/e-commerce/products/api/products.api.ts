import type { PaginatedResponse, Product, ProductQueryParams } from "../types";

const BASE_URL = `${import.meta.env.VITE_API_URL}/products`;

async function handleResponse<T>(res: Response): Promise<T> {
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
  getAll: (query: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    if (query.search) params.set("search", query.search);
    if (query.sortBy) params.set("sortBy", query.sortBy);
    if (query.sortOrder) params.set("sortOrder", query.sortOrder);
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    return fetch(`${BASE_URL}?${params}`).then((res) => handleResponse(res))
  },

  getOne: (id: string): Promise<Product> =>
    fetch(`${BASE_URL}/${id}`).then((res) => handleResponse(res)),

  create: (payload: CreateProductPayload): Promise<Product> =>
    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => handleResponse(res)),

  update: (id: string, payload: UpdateProductPayload): Promise<Product> =>
    fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => handleResponse(res)),

  remove: (id: string): Promise<Product> =>
    fetch(`${BASE_URL}/${id}`, { method: "DELETE" }).then((res) =>
      handleResponse(res),
    ),
};
