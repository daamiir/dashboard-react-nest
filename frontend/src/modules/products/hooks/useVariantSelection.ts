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
    () =>
      [
        ...new Set(
          variants
            .map((v) =>
              v.attributes.storage ? String(v.attributes.storage) : "",
            )
            .filter(Boolean),
        ),
      ].sort((a, b) => Number(a) - Number(b)),
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

  const colorImages = useMemo(
    () =>
      Object.fromEntries(
        colors.map((c) => [
          c,
          variants.find((v) => v.attributes.color === c && v.images[0])
            ?.images[0],
        ]),
      ) as Record<string, string | undefined>,
    [variants, colors],
  );

  return { colors, colorImages, storages, activeVariant, setColor, setStorage };
}
