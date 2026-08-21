export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stockQuantity: number;
  createdAt: string; // ISO date string
}

export type ProductSortField = "name" | "category" | "brand" | "price";
export type SortDirection = "asc" | "desc";
