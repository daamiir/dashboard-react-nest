export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stockQuantity: number;
  createdAt: string; // ISO date string
}

export type SortBy = "name" | "category" | "brand" | "price";
export type SortOrder = "asc" | "desc";

export interface ProductQueryParams {
  search?: string,
  sortBy?: SortBy,
  sortOrder?: SortOrder,
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