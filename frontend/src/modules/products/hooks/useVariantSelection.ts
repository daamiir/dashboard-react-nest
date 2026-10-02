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

  const inStock = (v: (typeof variants)[number]) => v.stockQuantity > 0;
  const attr = (v: (typeof variants)[number], k: "color" | "storage") =>
    v.attributes[k] ? String(v.attributes[k]) : "";

  const activeVariant = useMemo(() => {
    const matches = variants.filter(
      (v) =>
        (!color || attr(v, "color") === color) &&
        (!storage || attr(v, "storage") === storage),
    );
    return (
      matches.find(inStock) ??
      matches[0] ??
      variants.find(inStock) ??
      variants[0] ??
      null
    );
  }, [variants, color, storage]);

  const curColor = activeVariant ? attr(activeVariant, "color") : "";
  const curStorage = activeVariant ? attr(activeVariant, "storage") : "";

  type Kind = "color" | "storage";
  const otherOf = (k: Kind): Kind => (k === "color" ? "storage" : "color");
  const otherCur = (k: Kind) => (k === "color" ? curStorage : curColor);

  const optionStatus = (kind: Kind, value: string) => {
    const withValue = variants.filter(
      (v) => attr(v, kind) === value && inStock(v),
    );
    if (!withValue.length) return "out";
    const cur = otherCur(kind);
    const fits = !cur || withValue.some((v) => attr(v, otherOf(kind)) === cur);
    return fits ? "available" : "switch";
  };

  const select = (kind: Kind, value: string) => {
    const withValue = variants.filter(
      (v) => attr(v, kind) === value && inStock(v),
    );
    const fits = withValue.some(
      (v) => attr(v, otherOf(kind)) === otherCur(kind),
    );
    if (kind === "color") setColor(value);
    else setStorage(value);
    if (!fits && withValue[0]) {
      const next = attr(withValue[0], otherOf(kind));
      if (kind === "color") setStorage(next);
      else setColor(next);
    }
  };

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

  return {
    colors,
    colorImages,
    storages,
    activeVariant,
    optionStatus,
    select,
  };
}
