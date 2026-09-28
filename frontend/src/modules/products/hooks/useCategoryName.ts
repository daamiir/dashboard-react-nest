import { useCategories } from "@/modules/categories/hooks/useCategories";

// Category name by id, "—" when missing
export const useCategoryName = (categoryId: string) => {
  const { data: categories = [] } = useCategories();
  return categories.find((c) => c.id === categoryId)?.name ?? "—";
};
