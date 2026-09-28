import { useMemo, useState } from "react";
import type { Product } from "../types";

// Color/storage pickers and the resolved variant
export function useVariantSelection(product?: Product) {
  const [color, setColor] = useState<string | null>(null);
  const [storage, setStorage] = useState<string | null>(null);

  const variants = product?.variants ?? [];

  const colors = useMemo(
    () => [
      ...new Set(
        variants.map((v) => v.attributes.color as string).filter(Boolean),
      ),
    ],
    [variants],
  );

  const storages = useMemo(
    () => [
      ...new Set(
        variants
          .map((v) =>
            v.attributes.storage ? String(v.attributes.storage) : "",
          )
          .filter(Boolean),
      ),
    ],
    [variants],
  );

  const activeVariant = useMemo(
    () =>
      variants.find(
        (v) =>
          (!color || v.attributes.color === color) &&
          (!storage || String(v.attributes.storage) === storage),
      ) ??
      variants[0] ??
      null,
    [variants, color, storage],
  );

  return { colors, storages, activeVariant, setColor, setStorage };
}
