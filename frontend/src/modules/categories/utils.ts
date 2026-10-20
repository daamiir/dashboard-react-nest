import type { Category } from "./types";

export interface CategoryRow {
  category: Category;
  depth: number;
}

export function flattenCategories(list: Category[]): CategoryRow[] {
  const byParent = new Map<string | null, Category[]>();
  list.forEach((c) => {
    const key = c.parentId ?? null;
    byParent.set(key, [...(byParent.get(key) ?? []), c]);
  });

  const rows: CategoryRow[] = [];
  const walk = (parentId: string | null, depth: number) => {
    (byParent.get(parentId) ?? []).forEach((category) => {
      rows.push({ category, depth });
      walk(category.id, depth + 1);
    });
  };
  walk(null, 0);
  return rows;
}

export function getDescendantIds(list: Category[], id: string): string[] {
  const ids = [id];
  for (let i = 0; i < ids.length; i++) {
    list.forEach((c) => {
      if (c.parentId === ids[i]) ids.push(c.id);
    });
  }
  return ids;
}
