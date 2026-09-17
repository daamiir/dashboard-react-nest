export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  stockQuantity: number;
  images: string[];
  attributes: Record<string, unknown>;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  brand: string;
  description: string;
  attributes: Record<string, unknown>;
  createdAt: string; // ISO date string

  createdById: string;

  variants: ProductVariant[];
}

export type SortBy = "name" | "brand" | "price";
export type SortOrder = "asc" | "desc";

export interface ProductQueryParams {
  search?: string;
  categoryId?: string;
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
