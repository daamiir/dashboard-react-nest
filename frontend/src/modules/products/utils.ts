import type { Product, ProductVariant } from "./types";

export const formatPrice = (price: number) =>
  `$${price.toLocaleString("en-US")}`;

export const variantUrl = (slug: string, sku: string) =>
  "/shop/" + slug + "?variant=" + encodeURIComponent(sku);

export const variantTitle = (product: Product, v: ProductVariant) => {
  const { ram, storage, color } = v.attributes;
  const { screenSize, mainCamera } = product.attributes;
  if (!ram || !storage) return product.name;
  return `${product.name} ${ram}/${storage}GB/${screenSize ?? ""}/${mainCamera ?? ""} ${color ?? ""}`;
};

// Range across variants, single value when equal
export const formatPriceRange = (product: Product) => {
  const prices = product.variants.map((v) => v.price);
  if (!prices.length) return formatPrice(0);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max
    ? formatPrice(min)
    : `${formatPrice(min)} – ${formatPrice(max)}`;
};

// Total stock across variants
export const totalStock = (product: Product) =>
  product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  return `${day} ${d.toLocaleString("en-US", { month: "short" })}, ${d.getFullYear()}`;
};

// Stable avatar color per brand
const AVATAR_PALETTE = [
  "bg-slate-900",
  "bg-blue-600",
  "bg-purple-600",
  "bg-orange-500",
  "bg-emerald-600",
  "bg-rose-600",
  "bg-cyan-600",
  "bg-amber-600",
];

export const getAvatarColor = (key: string) => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
};

export const formatVariantLabel = (v: ProductVariant) =>
  Object.values(v.attributes ?? {})
    .filter((x) => ["string", "number", "boolean"].includes(typeof x))
    .join(" · ");
