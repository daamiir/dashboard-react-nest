import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  productsApi,
  type CreateProductPayload,
  type UpdateProductPayload,
} from "../api/products.api";

import { toast } from "sonner";
import type { ProductQueryParams } from "../types";

export const PRODUCTS_QUERY_KEY = ["products"] as const;

export function useProducts(query: ProductQueryParams) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, query],
    queryFn: () => productsApi.getAll(query),
    placeholderData: keepPreviousData,
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, id],
    queryFn: () => productsApi.getOne(id as string),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => productsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      toast.success("Product created");
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to create product"),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProductPayload;
    }) => productsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      toast.success("Product updated");
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to update product"),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      toast.success("Product deleted");
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to delete product"),
  });
}