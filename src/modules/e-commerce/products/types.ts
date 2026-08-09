export type StockStatus = "In Stock" | "Out of Stock";

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: StockStatus;
  createdAt: string; // ISO date string
}

export type ProductSortField = "name" | "category" | "brand" | "price";
export type SortDirection = "asc" | "desc";