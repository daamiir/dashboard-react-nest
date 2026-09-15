export type Category = "SMARTPHONE" | "LAPTOP" | "TABLET" | "HEADPHONES";

export interface Product {
  id: string;
  name: string;
  category: Category;
  brand: string;
  price: number;
  stockQuantity: number;
  images: string[];
  description: string;
  attributes: Record<string, unknown>;
  createdAt: string; // ISO date string

  sellerId: string;
}

export type SortBy = "name" | "category" | "brand" | "price";
export type SortOrder = "asc" | "desc";

export interface ProductQueryParams {
  search?: string;
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  ram?: number;
  storage?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
