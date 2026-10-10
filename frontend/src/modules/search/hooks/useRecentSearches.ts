import { useCallback, useState } from "react";

const KEY = "recent-searches";
const MAX = 5;

const read = (): string[] => {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(value) ? value.slice(0, MAX) : [];
  } catch {
    return [];
  }
};

const write = (list: string[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
};

export function useRecentSearches() {
  const [items, setItems] = useState<string[]>(read);

  // Newest first, no duplicates, max 5
  const add = useCallback((term: string) => {
    const value = term.trim();
    if (!value) return;
    setItems((prev) => {
      const next = [
        value,
        ...prev.filter((i) => i.toLowerCase() !== value.toLowerCase()),
      ].slice(0, MAX);
      write(next);
      return next;
    });
  }, []);

  const remove = useCallback((term: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i !== term);
      write(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    write([]);
    setItems([]);
  }, []);

  return { items, add, remove, clear };
}
