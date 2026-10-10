import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface WishlistItem {
  variantId: string;
  productId: string;
  slug: string;
  sku: string;
  name: string;
  label: string;
  image: string | null;
  price: number;
  stockQuantity: number;
}

interface WishlistState {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  remove: (variantId: string) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],
      toggle: (item) =>
        set((state) =>
          state.items.some((i) => i.variantId === item.variantId)
            ? {
                items: state.items.filter(
                  (i) => i.variantId !== item.variantId,
                ),
              }
            : { items: [item, ...state.items] },
        ),
      remove: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const selectWishlistCount = (s: WishlistState) => s.items.length;
